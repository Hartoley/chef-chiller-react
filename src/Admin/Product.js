import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Product = ({
  activeSection2,
  setActiveSection2,
  activeSection3,
  setActiveSection3,
}) => {
  const [quantity, setQuantity] = useState(1);
  const id = JSON.parse(localStorage.getItem("id"));
  const [products, setProducts] = useState([]); // Changed to handle multiple products
  const productId = JSON.parse(localStorage.getItem("productId"));
  const [isUpdating, setIsUpdating] = useState(false);
  const [user, setuser] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [subtotal, setsubtotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://chef-chiller-node.onrender.com/user/getuser/${id}`
        );
        // console.log("students data from API:", res.data);
        setuser(res.data.data);
        setOrderItems(res.data.data.orders);
        const subtotal = res.data.data.orders.reduce((total, order) => {
          return total + order.productPrice * order.quantity;
        }, 0);

        setsubtotal(subtotal);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const updateCart = async (product, action) => {
    if (isUpdating) return;

    setIsUpdating(true);

    console.log("updateCart called with action:", action);

    try {
      const response = await syncCartWithServer(product, action);
      console.log(response.data.message);
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const syncCartWithServer = async (product, action) => {
    const toastId = toast.loading("Updating cart...");

    try {
      const response = await axios.post(
        "https://chef-chiller-node.onrender.com/chefchiller/updatecart",
        {
          userId: user._id,
          productId: product._id,
          productName: product.name,
          productPrice: product.price,
          image: product.image,
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
    handleQuantityChange();
    console.log("Received Product ID:", productId);
    axios
      .get(
        `https://chef-chiller-node.onrender.com/chefchiller/product/${productId}`
      )
      .then((res) => {
        setProducts([res.data]); // Changed to set an array of products
      })
      .catch((error) => {
        console.log(error);
      });
  }, [productId]);

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <main className="child flex flex-col w-[63.65vw] items-center bg-gray-100  p-6">
      {/* Header */}
      <section className="section1 flex items-center justify-between w-full mb-6">
        <button
          onClick={() => setActiveSection3("mainMenu1")}
          className="text-gray-700 hover:text-gray-900 transition text-sm font-medium flex items-center"
        >
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Food Details</h1>
        <div />
      </section>

      {/* Food List or Single Product Details */}
      <section className="section2 w-full max-w-lg bg-white rounded-lg shadow-md overflow-hidden">
        {products.length === 0 ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : (
          products.map((product) => (
            <div key={product._id}>
              {/* Food Image */}
              <div className="w-full h-52">
                <img
                  src={product.image}
                  alt={product.name}
                  className=" w-full h-full object-cover"
                />
              </div>

              {/* Food Information */}
              <div className="section4 p-6">
                <h4 className="text-2xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h4>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-md font-semibold text-gray-800">
                  Price: ₦{product.price.toFixed(2)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center mt-6">
                  <button
                    onClick={() => updateCart(product, "decrease")}
                    className="px-4 py-2 bg-gray-300 rounded-full text-gray-800 font-md transition hover:bg-gray-400"
                  >
                    −
                  </button>
                  <span className="mx-4 text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => updateCart(product, "increase")}
                    className="px-4 py-2 bg-gray-300 rounded-full text-gray-800 font-bold transition hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>

                {/* Total Price */}
                <p className="text-lg font-medium text-gray-800 mt-4">
                  Total: ₦{(product.price * quantity).toFixed(2)}
                </p>

                {/* Action Buttons */}
                {/* <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => setActiveSection3("mainMenu1")}
                    className="px-6 py-2 bg-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      alert(`Added ${quantity} ${product.name}(s) to cart`)
                    }
                    className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                  >
                    Add to Cart
                  </button>
                </div> */}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default Product;
