import React, { useEffect, useState } from "react";
import axios from "axios";
import "./user.css";
import { ToastContainer, toast } from "react-toastify";

const FoodsDrinks = () => {
  const [orders, setOrders] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const id = JSON.parse(localStorage.getItem("id"));

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

  const handleUploadPaymentProof = async (orderId) => {
    setIsUploading(true);
    const toastId = toast.loading("Uploading payment proof...");

    try {
      const response = await axios.post(
        "https://chef-chiller-node.onrender.com/chefchiller/uploadPaymentProof",
        { orderId }
      );

      toast.update(toastId, {
        render: response.data.message || "Payment proof uploaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Error uploading payment proof. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleApproveDelivery = async (orderId) => {
    setIsUploading(true);
    const toastId = toast.loading("Approving delivery...");

    try {
      const response = await axios.post(
        "https://chef-chiller-node.onrender.com/chefchiller/approveDelivery",
        { orderId }
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
              orders.map((order, index) => (
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
                        <p className="text-gray-600">Status: {order.status}</p>
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
                    <div className="flex justify-between mt-4">
                      <button
                        className="text-green-500 text-sm"
                        onClick={() => handleUploadPaymentProof(order._id)}
                      >
                        Upload Payment Proof
                      </button>

                      <button
                        className="text-blue-500 text-sm"
                        onClick={() => handleApproveDelivery(order._id)}
                      >
                        Approve Delivery
                      </button>
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
