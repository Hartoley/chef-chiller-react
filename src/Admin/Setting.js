import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";
import "./user.css";

const socket = io("https://chef-chiller-node.onrender.com");

const Setting = ({ showCustomAlert }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const id = JSON.parse(localStorage.getItem("id"));
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

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

    socket.on("orderApprovedByAdmin", (data) => {
      console.log("Order approved:", data);
    });

    socket.on("orderDeclinedByAdmin", (data) => {
      console.log("Order approved:", data);
    });

    return () => {
      socket.off("ordersRetrieved");
      socket.off("orderApproved");
      socket.off("orderApprovedByAdmin");
      socket.off("orderDeclinedByAdmin");
    };
  }, [socket]);

  useEffect(() => {
    const userId = id;

    const fetchOrders = async () => {
      showCustomAlert("Fetching orders, please wait...", "info", true);

      try {
        const res = await axios.get(
          `https://chef-chiller-node.onrender.com/chefchiller/getmyorders/${userId}`
        );

        console.log("API response:", res.data);

        setOrders(res.data.orders);

        showCustomAlert("Orders fetched successfully!", "success");
      } catch (err) {
        console.error("Error fetching orders:", err);

        showCustomAlert(
          "Failed to fetch orders. Please check your connection and try again.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [id]);

  return (
    <main className="child flex-1 p-6 bg-gray-400 w-[63.65vw]">
      <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">
        Order History
      </h1>
      <section className="section1 flex items-center rounded-md justify-between mb-6 overflow-hidden">
        <div className="bg-gray-400 w-full rounded-lg shadow-lg">
          <section className="p-4 rounded-md">
            <div className="mb-4 rounded-md">
              {isLoading ? (
                <div className="overflow-y-scroll no-scrollbar max-h-[70vh]">
                  {/* Placeholder Loading State */}
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-gray-300 p-4 rounded-lg mb-4 shadow-md animate-pulse"
                    >
                      <h6 className="font-semibold text-gray-800">
                        Loading...
                      </h6>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-y-scroll no-scrollbar max-h-[70vh]">
                  {Array.isArray(orders) && orders.length > 0 ? (
                    orders.map((order, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg mb-4 shadow-md cursor-pointer"
                        onClick={() => handleOrderClick(order)}
                      >
                        <p className="font-semibold text-gray-800">
                          Order {index + 1}
                        </p>
                        <p className="text-gray-600">
                          Ordered On:{" "}
                          {new Date(order.orderedDate).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-900 text-center">
                      No orders found.
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>

      {/* Modal for displaying full order details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md">
            <h2 className="text-lg font-bold mb-4">Order Details</h2>
            <p className="text-sm text-gray-800">
              Status: {selectedOrder.status}
            </p>
            <p className="text-sm text-gray-800">
              Payment Method: {selectedOrder.paymentMethod}
            </p>
            <p className="text-sm text-gray-800">
              Ordered On: {new Date(selectedOrder.orderedDate).toLocaleString()}
            </p>
            <p className="text-sm text-gray-800">
              Date Delivered:{" "}
              {new Date(selectedOrder.dateToBeDelivered).toLocaleDateString()}
            </p>

            <div className="mt-4 overflow-y-auto max-h-48">
              {selectedOrder.products.map((product, idx) => (
                <div key={idx} className="border-b py-2">
                  <p className="font-semibold text-gray-800">
                    {product.productName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {product.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ₦
                    {product.price.toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              ))}
            </div>

            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Setting;
