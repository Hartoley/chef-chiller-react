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
    <main className="child flex flex-col w-[63.55vw] items-center bg-gray-100 p-6">
      <section className="flex items-center justify-between w-full max-w-6xl mb-6">
        <button
          onClick={() => setActiveSection3("mainMenu1")}
          className="text-gray-700 hover:text-gray-900 transition text-sm font-medium flex items-center"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Food Details</h1>
        <div />
      </section>

      <section className="w-full max-w-6xl bg-white rounded-lg shadow-md overflow-hidden flex flex-col lg:flex-row gap-6 p-4">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500 animate-pulse w-full">
            Loading product...
          </div>
        ) : products.length === 0 ? (
          <div className="p-6 text-center text-gray-400 w-full">
            No product found.
          </div>
        ) : (
          products.map((product) => (
            <React.Fragment key={product._id}>
              {/* Image section */}
              <div className="flex flex-col lg:w-1/2">
                <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-2 mt-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden"
                    >
                      <img
                        src={product.image}
                        alt={`thumb-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Info section */}
              <div className="lg:w-1/2 flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <p className="text-gray-500 text-sm">Chef Chiller’s Menu</p>

                <div className="text-xl font-bold text-[rgb(17,24,39)]">
                  ₦{product.price.toFixed(2)}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      handleQuantityChange("increase");
                      updateCart(product, "increase");
                    }}
                    className="bg-[rgba(17,24,39,0.82)] text-white px-4 py-2 rounded-md text-sm hover:bg-[rgb(17,24,39)] transition"
                  >
                    ADD TO CART +
                  </button>
                  <button className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-100">
                    ADD TO WISHLIST +
                  </button>
                </div>

                <div className="text-sm text-gray-500 mt-1">
                  Free shipping when you spend ₦50,000 or more.
                </div>

                {/* Tabs section */}
                <div className="mt-6">
                  <div className="flex gap-6 border-b border-gray-200 mb-4">
                    {["Description", "Sizing", "Shipping"].map((tab) => (
                      <button
                        key={tab}
                        className="pb-2 text-sm font-semibold text-gray-700 border-b-2 border-transparent hover:border-bg-[rgba(17,24,39,0.82)]"
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="text-gray-700 text-sm leading-relaxed">
                    {product.description ||
                      "No detailed description available."}
                    <ul className="list-disc ml-6 mt-2 text-sm text-gray-600">
                      <li>Made in Nigeria</li>
                      <li>100% Fresh Ingredients</li>
                      <li>Prepared by professional chefs</li>
                    </ul>
                  </div>
                </div>

                {/* Total section */}
                <div className="text-lg font-medium text-gray-800 mt-4">
                  Total: ₦{(product.price * quantity).toFixed(2)}
                </div>
              </div>
            </React.Fragment>
          ))
        )}
      </section>
    </main>
  );
};

export default Product;
