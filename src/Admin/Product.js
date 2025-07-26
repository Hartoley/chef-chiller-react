import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Product = ({
  activeSection2,
  setActiveSection2,
  activeSection3,
  setActiveSection3,
  showCustomAlert,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const productId = JSON.parse(localStorage.getItem("productId"));
  const [isUpdating, setIsUpdating] = useState(false);
  const [user, setUser] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // 👈 loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://chef-chiller-node.onrender.com/user/getuser/${id}`
        );
        setUser(res.data.data);
        setOrderItems(res.data.data.orders);
        const subtotal = res.data.data.orders.reduce((total, order) => {
          return total + order.productPrice * order.quantity;
        }, 0);
        setSubtotal(subtotal);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const updateCart = async (product, action) => {
    if (isUpdating) return;
    setIsUpdating(true);

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
    showCustomAlert("Updating cart...", "info", true);

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

      showCustomAlert(
        response.data.message || "Cart updated successfully!",
        "success"
      );

      return response;
    } catch (error) {
      showCustomAlert("Error updating the cart. Please try again.", "error");
      throw error;
    }
  };

  useEffect(() => {
    handleQuantityChange();

    axios
      .get(
        `https://chef-chiller-node.onrender.com/chefchiller/product/${productId}`
      )
      .then((res) => {
        if (res.data) {
          setProducts([res.data]);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false); // ✅ Finished loading
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
      <section className="section1 flex items-center justify-between w-full mb-6">
        <button
          onClick={() => setActiveSection3("mainMenu1")}
          className="text-gray-700 hover:text-gray-900 transition text-sm font-medium flex items-center"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Food Details</h1>
        <div />
      </section>

      <section className="section2 w-full max-w-lg bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500 animate-pulse">
            Loading product...
          </div>
        ) : products.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No product found.</div>
        ) : (
          products.map((product) => (
            <div key={product._id}>
              <div className="w-full h-52">
                <img
                  src={product.image}
                  alt={product.name}
                  className=" w-full h-full object-cover"
                />
              </div>

              <div className="section4 p-6">
                <h4 className="text-2xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h4>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-md font-semibold text-gray-800">
                  Price: ₦{product.price.toFixed(2)}
                </p>

                <div className="flex items-center mt-6">
                  <button
                    onClick={() => updateCart(product, "decrease")}
                    className="px-4 py-2 bg-gray-300 rounded-full text-gray-800 font-md transition hover:bg-gray-400"
                  >
                    −
                  </button>
                  <span className="mx-4 text-lg font-semibold">
                    {/* {quantity} */}
                  </span>
                  <button
                    onClick={() => updateCart(product, "increase")}
                    className="px-4 py-2 bg-gray-300 rounded-full text-gray-800 font-bold transition hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>

                <p className="text-lg font-medium text-gray-800 mt-4">
                  Total: ₦{(product.price * quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default Product;
