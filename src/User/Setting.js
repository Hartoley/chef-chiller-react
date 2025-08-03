import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";
import "./user.css";
import { useParams } from "react-router-dom";
const socket = io("https://chef-chiller-node.onrender.com");

const Setting = ({ showCustomAlert }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 10;
  const { id } = useParams();

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
      console.log("Order approved by admin:", data);
    });

    socket.on("orderDeclinedByAdmin", (data) => {
      console.log("Order declined by admin:", data);
    });

    return () => {
      socket.off("ordersRetrieved");
      socket.off("orderApproved");
      socket.off("orderApprovedByAdmin");
      socket.off("orderDeclinedByAdmin");
    };
  }, []);

  const fetchOrders = async (page = 1) => {
    setIsLoading(true);
    showCustomAlert("Fetching orders, please wait...", "info", true);

    try {
      const res = await axios.get(
        `https://chef-chiller-node.onrender.com/chefchiller/getmyorders/${id}?page=${page}&limit=${ordersPerPage}`
      );

      console.log("API response:", res.data);

      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.currentPage || 1);

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

  useEffect(() => {
    fetchOrders(currentPage);
  }, [id, currentPage]);

  return (
    <main className="flex-1 px-4 py-6 bg-gray-100 w-full max-w-screen md:w-[63.65vw] mx-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-center text-gray-800">
        Order History
      </h1>

      <section className="bg-white rounded-lg shadow-lg p-1">
        <div className="rounded-md">
          {isLoading ? (
            <div className="overflow-y-auto no-scrollbar max-h-[70vh]">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 p-1 rounded-lg mb-4 shadow animate-pulse"
                >
                  <h6 className="font-semibold text-gray-700">Loading...</h6>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-y-auto no-scrollbar max-h-[70vh]">
              {Array.isArray(orders) && orders.length > 0 ? (
                orders
                  .filter(
                    (order) =>
                      ![
                        "payment",
                        "Payment Pending",
                        "Payment Declined",
                      ].includes(order.status) && order.paid !== false
                  )
                  .map((order, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg mb-4 shadow hover:shadow-md transition cursor-pointer"
                      onClick={() => handleOrderClick(order)}
                    >
                      <p className="font-semibold text-gray-800">
                        Order {index + 1}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Ordered On:{" "}
                        {new Date(order.orderedDate).toLocaleString()}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="text-gray-600 text-center">No orders found.</p>
              )}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </section>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Order Details
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
              <p>Status: {selectedOrder.status}</p>
              <p>Payment Method: {selectedOrder.paymentMethod}</p>
              <p>
                Ordered On:{" "}
                {new Date(selectedOrder.orderedDate).toLocaleString()}
              </p>
              <p>
                Date Delivered:{" "}
                {new Date(selectedOrder.dateToBeDelivered).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-4 max-h-48 overflow-y-auto pr-2">
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
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
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
