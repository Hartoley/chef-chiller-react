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
  const [delivered, setDelivered] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const id = JSON.parse(localStorage.getItem("id"));

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("Message from server:", message);
    });

    socket.emit("message", "Hello from client!");

    socket.on("deliveredRetrieved", (delivered) => {
      setDelivered(delivered);
    });

    // Cleanup on unmount
    return () => {
      socket.off("deliveredRetrieved");
    };
  }, []);

  useEffect(() => {
    const userId = id;
    const fetchDelivered = async () => {
      // setIsLoading(true); // Set loading to true when the fetch starts

      try {
        const res = await axios.get(
          `https://chef-chiller-node.onrender.com/chefchiller/getmydelivered/${userId}`
        );
        console.log("API response:", res.data);
        setDelivered(res.data.delivered);
      } catch (err) {
        toast.error("Failed to fetch delivered");
        console.error("Error fetching delivered:", err);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchDelivered();
  }, [id]);

  return (
    <>
      <main className="child flex-1 p-6 bg-gray-400 w-[63.65vw]">
        <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">
          Order History
        </h1>
        <section className="section1 flex items-center rounded-md justify-between mb-6 overflow-hidden">
          <div className="bg-gray-400 w-full rounded-lg shadow-lg">
            <section className="p-4 rounded-md">
              <div className="mb-4 rounded-md">
                {Array.isArray(delivered) && delivered.length > 0 ? (
                  <div className="overflow-y-scroll max-h-[70vh]">
                    {" "}
                    {/* Scrollable Content Area */}
                    {delivered
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

                            {/* Only display the action buttons for delivered with 'Payment Pending' or 'Approved' */}
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
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-900 text-center">
                    No delivered found.
                  </p>
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
