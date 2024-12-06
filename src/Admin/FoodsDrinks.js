import React, { useEffect, useState } from "react";
import axios from "axios";
import "./user.css";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";

const socket = io("https://chef-chiller-node.onrender.com");

const FoodsDrinks = ({ showCustomAlert }) => {
  const [orders, setOrders] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const id = JSON.parse(localStorage.getItem("id"));
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 10;

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("Message from server:", message);
    });

    socket.emit("message", "Hello from client!");

    socket.on("ordersRetrieved", (orders) => {
      setOrders(orders);
    });

    socket.on("orderApproved", (data) => {
      console.log("Order approved:", data);
      setOrders(data.order);
    });

    return () => {
      socket.off("orderApproved");
      socket.off("ordersRetrieved");
    };
  }, []);

  const fetchOrders = async (page = 1) => {
    try {
      // Show progress alert
      showCustomAlert("Fetching orders, please wait...", "info", true);

      const res = await axios.get(
        `https://chef-chiller-node.onrender.com/chefchiller/getmyorders/${id}?page=${page}&limit=${ordersPerPage}`
      );

      setOrders(res.data.orders);
      setTotalOrders(res.data.totalOrders);

      showCustomAlert("Orders fetched successfully!", "success");
    } catch (err) {
      console.error("Error fetching orders:", err);

      if (axios.isCancel(err)) {
        console.log("Request canceled:", err.message);
      }

      showCustomAlert(
        "Failed to fetch orders. Please check your connection and try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [id, currentPage]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log("File selected:", selectedFile);
      setFile(selectedFile);
    }
  };

  const handleApproveDelivery = async (orderId) => {
    if (!file) {
      toast.error("Please select a payment proof image first!");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Approving delivery...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `https://chef-chiller-node.onrender.com/chefchiller/approveDelivery/${orderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.update(toastId, {
        render: response.data.message || "Delivery approved successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Error approving delivery. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (orders.length < totalOrders) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [orders, totalOrders]);

  return (
    <main className="child flex-1 p-4 bg-gray-600 w-[63.65vw]">
      <h1 className="text-xl md:text-2xl font-bold flex flex-col items-center text-white mb-4 text-center">
        All Orders
      </h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <p className="text-white">Loading...</p>
        </div>
      ) : (
        <div className="w-full rounded-lg shadow-lg bg-gray-200 max-h-[90%] overflow-y-scroll no-scrollbar">
          <section className="p-4">
            <div className="mb-4">
              {Array.isArray(orders) && orders.length > 0 ? (
                orders
                  .filter(
                    (order) =>
                      order.status !== "Payment Pending" &&
                      order.status !== "Payment Approved" &&
                      order.status !== "Payment Declined"
                  )
                  .map((order, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg mb-4 shadow-md"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between text-sm">
                          <div>
                            <h6 className="font-semibold text-gray-800">
                              Order {index + 1}
                            </h6>
                            <p className="text-gray-600">
                              Status: {order.status}
                            </p>
                            <p className="text-gray-600">
                              Payment Method: {order.paymentMethod}
                            </p>
                            <p className="text-gray-600">
                              Ordered On:{" "}
                              {new Date(order.orderedDate).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="overflow-y-auto max-h-48">
                          {order.products.map((product, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between border-b py-2 text-sm"
                            >
                              <div className="flex flex-col">
                                <p className="font-semibold text-gray-800">
                                  {product.productName}
                                </p>
                                <p className="text-gray-600">
                                  Quantity: {product.quantity}
                                </p>
                                <p className="text-gray-600">
                                  Price: ₦
                                  {product.price.toLocaleString("en-NG", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <input
                          type="file"
                          id="productImage"
                          name="image"
                          onChange={handleFileChange}
                          className="text-sm md:text-base mt-1 p-2 border border-gray-700 rounded bg-gray-900 text-gray-200"
                        />
                        <div className="flex justify-between mt-4">
                          <button
                            className="text-green-500 text-sm"
                            onClick={() => handleApproveDelivery(order._id)}
                          >
                            Upload Payment Proof
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-600 text-center">
                  Your wait list is currently empty.
                </p>
              )}
            </div>
          </section>
        </div>
      )}
      <ToastContainer />
    </main>
  );
};

export default FoodsDrinks;
