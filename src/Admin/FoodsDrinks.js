import React, { useEffect, useState } from "react";
import axios from "axios";
import "./user.css";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("https://chef-chiller-node.onrender.com");

const FoodsDrinks = ({ showCustomAlert }) => {
  const [orders, setOrders] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 10;
  const [awaiting, setAwaiting] = useState(0);

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("Message from server:", message);
    });

    socket.emit("message", "Hello from client!");

    socket.on("ordersRetrieved", (orders) => {
      setOrders(orders);
    });

    socket.on("orderApproved", (data) => {
      setOrders(data.order);
    });

    return () => {
      socket.off("orderApproved");
      socket.off("ordersRetrieved");
    };
  }, []);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      showCustomAlert("Fetching orders, please wait...", "info", true);

      const res = await axios.get(
        `https://chef-chiller-node.onrender.com/chefchiller/getmyorders/${id}?page=${page}&limit=${ordersPerPage}`
      );

      if (Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
        setTotalOrders(res.data.totalOrders || 0);
        setTotalPages(res.data.totalPages || 1);
        setAwaiting(res.data.orders.length);
        localStorage.setItem(
          "awaitingOrders",
          res.data.orders.length.toString()
        );
      } else {
        setOrders([]);
        setTotalOrders(0);
        setTotalPages(1);
        setAwaiting(0);
        localStorage.setItem("awaitingOrders", "0");
      }

      showCustomAlert("Orders fetched successfully!", "success", false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      showCustomAlert(
        "Failed to fetch orders. Please check your connection and try again.",
        "error",
        false
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
      setFile(selectedFile);
    }
  };

  const handleApproveDelivery = async (orderId) => {
    if (!file) {
      showCustomAlert(
        "Please select a payment proof image first!",
        "info",
        true
      );
      return;
    }

    setIsUploading(true);
    showCustomAlert("Approving delivery...", "info", true);

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

      showCustomAlert(
        response.data.message || "Delivery approved successfully!",
        "info",
        true
      );
    } catch (error) {
      showCustomAlert(
        "Error approving delivery. Please try again.",
        "info",
        true
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDelivery = async (orderId) => {
    setIsUploading(true);
    showCustomAlert("Deleting order...", "info", true);

    try {
      const response = await axios.post(
        `https://chef-chiller-node.onrender.com/chefchiller/deleteOrder/${orderId}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showCustomAlert(
        response.data.message || "Delivery deleted successfully!",
        "info",
        true
      );
    } catch (error) {
      showCustomAlert(
        "Error deleting delivery. Please try again.",
        "info",
        true
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (currentPage < totalPages) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [orders, totalOrders, currentPage, totalPages]);

  return (
    <main className="child flex-1 p-4 bg-gray-600 w-[63.65vw]">
      <h1 className="text-xl md:text-2xl font-bold flex flex-col items-center text-white mb-4 text-center">
        All Orders
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <p className="text-white text-lg">
            Loading your waitlist, kindly exercise patience
          </p>
        </div>
      ) : (
        <div className="w-full rounded-lg shadow-lg bg-gray-200 max-h-[90%] overflow-y-scroll no-scrollbar">
          <section className="p-4">
            <div className="mb-4">
              {Array.isArray(orders) && orders.length > 0 ? (
                orders
                  .filter((order) => order.status !== "Payment Approved")
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

                        {/* 👇 Conditional upload input */}
                        {order.paid === false && (
                          <>
                            <input
                              type="file"
                              id="productImage"
                              name="image"
                              onChange={handleFileChange}
                              className="text-sm md:text-base mt-1 p-2 border border-gray-700 rounded bg-gray-900 text-gray-200"
                            />
                            <button
                              className="text-green-500 text-sm"
                              onClick={() => handleApproveDelivery(order._id)}
                            >
                              Upload Payment Proof
                            </button>
                          </>
                        )}

                        <div className="flex justify-between mt-4">
                          {order.status === "Pending" && (
                            <p className="text-yellow-500 text-sm">
                              Please be patient, your order is being processed.
                            </p>
                          )}

                          {order.status === "Delivery declined" && (
                            <p className="text-red-500 text-sm">
                              We apologize, but your order couldn't be processed
                              because the item is out of stock.
                            </p>
                          )}

                          {order.paid === false && (
                            <button
                              className="text-sm px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                              onClick={() => handleDeleteDelivery(order._id)}
                            >
                              Delete Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-600 text-center">
                  Your waitlist is currently empty.
                </p>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev
                  )
                }
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default FoodsDrinks;
