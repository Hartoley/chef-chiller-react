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
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
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
    <main className="flex flex-col w-full items-center bg-gray-100 py-2 px-2  sm:px-2 min-h-screen">
      <section className="flex items-center justify-between w-full max-w-6xl mb-6">
        <button
          onClick={() => setActiveSection3("mainMenu1")}
          className="text-gray-700 hover:text-gray-900 transition text-sm font-medium flex items-center"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Food Details
        </h1>
        <div />
      </section>

      <section className=" py-6 px-2 bg-white rounded-lg shadow-md overflow-hidden flex flex-col lg:flex-row gap-6 ">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500 animate-pulse flex flex-col lg:w-1/2 gap-3">
            Loading product...
          </div>
        ) : products.length === 0 ? (
          <div className="p-6 text-center text-gray-400 w-[63.65vw] ">
            No product found.
          </div>
        ) : (
          products.map((product) => (
            <React.Fragment key={product._id}>
              {/* Image Section */}
              <div className="flex flex-col lg:w-full gap-3">
                <div className="w-full h-[200px] sm:h-[260px] md:h-[360px] lg:h-[420px] bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-2">
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

              {/* Info Section */}
              <div className="lg:w-1/2 flex flex-col gap-4 overflow-auto no-scrollbar ">
                <h2 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <p className="text-gray-500 text-sm">Chef Chiller’s Menu</p>

                <div className="text-xl font-bold text-gray-800">
                  ₦{product.price.toFixed(2)}
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() => {
                      handleQuantityChange("increase");
                      updateCart(product, "increase");
                    }}
                    className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-900 transition"
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

                {/* Tabs Section */}
                <div className="mt-6">
                  <div className="flex gap-6 border-b border-gray-200 mb-4">
                    {["Description", "Sizing", "Shipping"].map((tab) => (
                      <button
                        key={tab}
                        className="pb-2 text-sm font-semibold text-gray-700 border-b-2 border-transparent hover:border-gray-800"
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

                {/* Total Section */}
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
