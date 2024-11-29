import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import "./user.css";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";

const socket = io("https://chef-chiller-node.onrender.com");

const Setting = () => {
  const [orders, setOrders] = useState([]);
  const id = JSON.parse(localStorage.getItem("id"));

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("Message from server:", message);
    });

    socket.emit("message", "Hello from client!");

    socket.on("ordersRetrieved", (orders) => {
      setOrders(orders);
    });

    // Cleanup on unmount
    return () => {
      socket.off("ordersRetrieved");
    };
  }, []);

  useEffect(() => {
    const userId = id;
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `https://chef-chiller-node.onrender.com/chefchiller/getmyorders/${userId}`
        );
        setOrders(res.data.orders); // Set orders state to the fetched orders
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [id]);

  return (
    <>
      <main className="child flex-1 p-6 bg-gray-400 w-[63.65vw] overflow-y-scroll no-scrollbar">
        <section className="section1 flex items-center justify-between mb-6">
          <div className="bg-white w-full rounded-lg shadow-lg">
            <section className="p-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
                Order History
              </h1>

              <div className="mb-4">
                {orders.length > 0 ? (
                  orders
                    .filter(
                      (order) =>
                        order.status === "Payment Pending" ||
                        order.status === "Seen"
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
                                Date Delivered:{" "}
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

                          {/* Only display the action buttons for orders with 'Payment Pending' or 'Approved' */}
                          {order.status === "Payment Pending" ||
                          order.status === "Seen" ? (
                            <div className="flex justify-between mt-4">
                              <p className="text-sm text-gray-600">
                                Payment status: {order.status}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-600 text-center">No orders found.</p>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
};

export default Setting;
