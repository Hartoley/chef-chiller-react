import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";
import "./user.css";

const socket = io("https://chef-chiller-node.onrender.com");

const Setting = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const id = JSON.parse(localStorage.getItem("id"));

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
    });

    // Cleanup on unmount
    return () => {
      socket.off("ordersRetrieved");
    };
  }, []);

  useEffect(() => {
    const userId = id;
    const fetchOrders = async () => {
      // setIsLoading(true);

      try {
        const res = await axios.get(
          `https://chef-chiller-node.onrender.com/chefchiller/getmyorders/${userId}`
        );
        console.log("API response:", res.data);
        setOrders(res.data.orders);
        setIsLoading(false); // Set loading to false when done
      } catch (err) {
        toast.error("Failed to fetch orders");
        console.error("Error fetching orders:", err);
        setIsLoading(false); // Set loading to false when done
      } finally {
        setIsLoading(false); // Set loading to false when done
      }
    };

    fetchOrders();
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
                {isLoading ? (
                  <div className="overflow-y-scroll no-srollbar max-h-[70vh]">
                    {/* Placeholder Loading State */}
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="bg-gray-300 p-4 rounded-lg mb-4 shadow-md animate-pulse"
                      >
                        <div className="flex justify-between text-sm">
                          <div>
                            <h6 className="font-semibold text-gray-800">
                              Loading...
                            </h6>
                            <p className="text-gray-600">Status: Loading...</p>
                            <p className="text-gray-600">
                              Payment Method: Loading...
                            </p>
                            <p className="text-gray-600">
                              Ordered On: Loading...
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-sm text-gray-600">
                              Date Delivered: Loading...
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-y-scroll no-scrollbar max-h-[70vh]">
                    {Array.isArray(orders) && orders.length > 0 ? (
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
                                    {new Date(
                                      order.orderedDate
                                    ).toLocaleString()}
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
                              <div className="overflow-y-auto no-scrollbar max-h-48">
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
        <ToastContainer /> {/* Toast notifications container */}
      </main>
    </>
  );
};

export default Setting;
