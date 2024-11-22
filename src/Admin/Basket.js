import React, { useEffect, useState } from "react";
import axios from "axios";
import "./user.css";
import { ToastContainer, toast } from "react-toastify";

const Basket = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [user, setUser] = useState([]);
  const id = JSON.parse(localStorage.getItem("id"));
  const [isUpdating, setIsUpdating] = useState(false);

  const makeOrder = async (id) => {
    const userId = id;
    setIsUpdating(true);

    try {
      const response = await axios.get(
        `http://localhost:5010/api/makeOrder/${userId}`
      );
      console.log("Order Response:", response.data);
      alert("Order approved and copied successfully!");
    } catch (error) {
      console.error(
        "Error making order:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Failed to make the order.");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateCart = async (order, action) => {
    if (isUpdating) return;

    setIsUpdating(true);

    console.log("updateCart called with action:", action);

    try {
      const response = await syncCartWithServer(order, action);
      console.log(response.data.message);
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const syncCartWithServer = async (order, action) => {
    const toastId = toast.loading("Updating cart...");

    try {
      const response = await axios.post(
        "http://localhost:5010/chefchiller/updatecart",
        {
          userId: id,
          productId: order.productId,
          productName: order.productName,
          productPrice: order.productPrice,
          image: order.image,
          action,
        }
      );

      toast.update(toastId, {
        render: response.data.message || "Cart updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      return response;
    } catch (error) {
      toast.update(toastId, {
        render: "Error updating the cart. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // console.log("This is my ID", id);

      try {
        const res = await axios.get(`http://localhost:5010/user/getuser/${id}`);
        setUser(res.data.data);
        setOrderItems(res.data.data.orders);

        const calculatedSubtotal = res.data.data.orders.reduce(
          (total, order) => total + order.productPrice * order.quantity,
          0
        );

        setSubtotal(calculatedSubtotal);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // console.log(user);

  // Handle delete item
  const handleDeleteItem = (index) => {
    const updatedOrderItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedOrderItems);

    const totalPrice = orderItems.reduce((total, order) => {
      console.log(total);

      return total + order.productPrice * order.quantity;
    }, 0);

    console.log(`Total Price: ${totalPrice}`);

    setSubtotal(totalPrice);
  };

  return (
    <main className="flex justify-center w-[63.65vw] p-4 bg-gray-100">
      <div className="bg-white w-full md:w-[65vw] rounded-lg shadow-lg">
        <section className="p-4">
          {/* Header */}
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
            Your <span className="text-green-500">Cart</span>
          </h1>

          {/* User Information */}
          <div className="mb-4">
            <h2 className="text-md md:text-lg font-semibold text-gray-600">
              User Information
            </h2>
            <div className="flex justify-between py-2 border-b border-gray-300 text-sm md:text-base">
              <span className="text-gray-700">{user.username}</span>
              <span className="text-gray-700">{user.email}</span>
            </div>
          </div>

          {/* Orders Section */}
          <div className="overflow-y-scroll max-h-[30vh] mb-4">
            {orderItems.length > 0 ? (
              orderItems.map((order, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-2 rounded-lg mb-4 shadow-md flex items-center justify-between gap-4"
                >
                  {/* Product Info */}
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
                        Fresh vegetables and salad
                      </p>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-200 rounded-full px-3 py-1">
                      <button
                        onClick={() => updateCart(order, "decrease")}
                        className="text-pink-500 font-bold text-sm"
                      >
                        −
                      </button>
                      <span className="text-gray-800 text-sm">
                        {order.quantity}
                      </span>
                      <button
                        onClick={() => updateCart(order, "increase")}
                        className="text-pink-500 font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">
                      ${order.productPrice.toFixed(2)}
                    </span>
                    <button
                      className="text-pink-500 text-sm"
                      onClick={() => handleDeleteItem(index)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">No orders found.</p>
            )}
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <span className="text-md font-semibold text-gray-800">
              Subtotal
            </span>
            <span className="text-lg font-bold text-gray-800">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div
            onClick={makeOrder}
            className="flex justify-evenly items-center bg-gray-400 p-4 rounded-lg"
          >
            <button> Verify Order</button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Basket;
