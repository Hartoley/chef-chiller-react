import React, { useEffect, useState } from "react";
import axios from "axios";
import "./user.css";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";

const FoodsDrinks = () => {
  const [orders, setOrders] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const id = JSON.parse(localStorage.getItem("id"));
  const [file, setFile] = useState(null);

  useEffect(() => {
    const userId = id;
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5010/chefchiller/getmyorders/${userId}`
        );
        setOrders(res.data.orders); // Set orders state to the fetched orders
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // Get the first file from the input
    if (selectedFile) {
      console.log("File selected:", selectedFile); // Log for debugging
      setFile(selectedFile); // Set the file in the state
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
      console.log(file);

      formData.append("image", file); // Send the file in FormData

      const response = await axios.post(
        `http://localhost:5010/chefchiller/approveDelivery/${orderId}`, // Send orderId as part of the URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type for file upload
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

  return (
    <main className="child flex-1 p-4 bg-gray-600 w-[63.65vw] overflow-y-scroll no-scrollbar">
      <div className="bg-white w-full rounded-lg shadow-lg">
        <section className="p-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
            All Orders (Important Details)
          </h1>

          <div className="mb-4">
            {orders.length > 0 ? (
              orders

                .filter(
                  (order) =>
                    order.status !== "Payment Pending" &&
                    order.status !== "Seen"
                )
                .map((order, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg mb-4 shadow-md"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Order Header: Basic Information */}
                      <div className="flex justify-between text-sm">
                        <div>
                          <h6 className="font-semibold text-gray-800">
                            Order #{index + 1}
                          </h6>
                          <p className="text-gray-600">
                            Status: {order.status}
                          </p>
                          <p className="text-gray-600">
                            Payment Method: {order.paymentMethod}
                          </p>
                          <p className="text-gray-600">
                            Total: ${order.Total.toFixed(2)}
                          </p>
                          <p className="text-gray-600">
                            Ordered On:{" "}
                            {new Date(order.orderedDate).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-col items-end">
                          <p className="text-sm text-gray-600">
                            Date to be Delivered:{" "}
                            {new Date(
                              order.dateToBeDelivered
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Order Products List: List of Food Items */}
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
                                Price: ${product.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
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

                        {/* <button
                        className="text-blue-500 text-sm"
                        onClick={() => handleApproveDelivery(order._id)}
                      >
                        Approve Delivery
                      </button> */}
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-600 text-center">No orders found.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default FoodsDrinks;
