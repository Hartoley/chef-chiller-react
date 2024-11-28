import React, { useEffect, useState } from "react";
import axios from "axios";
import "./user.css";
import { ToastContainer, toast } from "react-toastify";

const FoodsDrinks = () => {
  const [approvedOrders, setApprovedOrders] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const id = JSON.parse(localStorage.getItem("id"));

  useEffect(() => {
    const fetchApprovedOrders = async () => {
      try {
        const res = await axios.get(
          `https://chef-chiller-node.onrender.com/user/getuser/${id}`
        );
        setApprovedOrders(res.data.data.orders);
        console.log(approvedOrders);
      } catch (err) {
        console.error("Error fetching approved orders:", err);
      }
    };

    fetchApprovedOrders();
    console.log(id);
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
    <main className="child flex-1 p-4 bg-gray-600 w-[63.65vw] overflow-y-scroll">
      <div className="bg-white w-full rounded-lg shadow-lg">
        <section className="p-4 ">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
            Approved Orders Waiting for Delivery
          </h1>

          <div className=" mb-4">
            {approvedOrders.length > 0 ? (
              approvedOrders.map((order, index) => (
                <>
                  <div
                    key={index}
                    className="bg-gray-50 p-2 rounded-lg mb-4 shadow-md flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="selectedProduct"
                        className="w-4 h-4 accent-green-500"
                      />
                      <img
                        src={order.image}
                        alt={order.productName}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                      <div className="text-sm">
                        <h6 className="font-semibold text-gray-800">
                          {order.productName}
                        </h6>
                        <p className="text-gray-600">
                          Processed and waiting for delivery
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-800 text-sm">
                        ${order.productPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      className="text-green-500 text-sm"
                      onClick={() => handleUploadPaymentProof(order.id)}
                    >
                      Upload Payment Proof
                    </button>

                    <button
                      className="text-blue-500 text-sm"
                      onClick={() => handleApproveDelivery(order.id)}
                    >
                      Approve Delivery
                    </button>
                  </div>
                </>
              ))
            ) : (
              <p className="text-gray-600 text-center">
                No approved orders found.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default FoodsDrinks;
