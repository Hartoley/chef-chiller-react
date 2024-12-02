import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./user.css"; // Ensure your styles are defined here

const socket = io("https://chef-chiller-node.onrender.com");

const Notifications = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const id = JSON.parse(localStorage.getItem("id"));
  const navigate = useNavigate();
  const [delivered, setDelivered] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true); // Start loading
      try {
        const res = await axios.get(
          `https://chef-chiller-node.onrender.com/chefchiller/getmyorders/${id}`
        );
        console.log("API response:", res.data);
        setOrders(res.data.orders);
        setIsLoading(false); // Stop loading
        console.log(isLoading);
      } catch (err) {
        toast.error("Failed to fetch orders");
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchOrders();

    // Socket connection for real-time updates
    socket.on("message", (message) => {
      console.log("Message from server:", message);
    });

    socket.emit("message", "Hello from client!");

    socket.on("ordersRetrieved", (orders) => {
      console.log("Orders retrieved from socket:", orders);
      setOrders(orders);
    });

    // Cleanup on unmount
    return () => {
      socket.off("ordersRetrieved");
    };
  }, [id]);

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
          Awaiting Delivery
        </h1>
        <section className="section1 flex items-center rounded-md justify-between mb-6 overflow-hidden">
          <div className="bg-gray-400 w-full rounded-lg shadow-lg">
            <section className="p-4 rounded-md">
              <div className="mb-4 rounded-md">
                {isLoading ? (
                  <div className="overflow-y-scroll no-scrollbar max-h-[70vh]">
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="bg-gray-300 p-4 rounded-lg mb-4 shadow-md animate-pulse"
                      >
                        <div className="flex justify-between text-sm">
                          <div>
                            <h6 className="font-semibold text-gray-800">
                              Order {index + 1}
                            </h6>
                            <p className="text-gray-600">Status: Loading...</p>
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
                      orders.map((order, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-4 rounded-lg mb-4 shadow-md cursor-pointer"
                          onClick={() =>
                            navigate(`/order-details/${order._id}`)
                          }
                        >
                          <div className="flex flex-col gap-4">
                            <div className="flex justify-between text-sm">
                              <div>
                                <h6 className="font-semibold text-gray-800">
                                  Order {index + 1}
                                </h6>
                                <p className="text-gray-600">
                                  Ordered On:{" "}
                                  {new Date(order.orderedDate).toLocaleString()}
                                </p>
                              </div>
                              <div className="flex flex-col items-end">
                                <p className="text-sm text-gray-600">
                                  Status: {order.status}
                                </p>
                              </div>
                            </div>
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
      </main>

      <ToastContainer />
    </>
  );
};

export default Notifications;
