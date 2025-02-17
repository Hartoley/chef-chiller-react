import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import "./user.css";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";

const socket = io("https://chef-chiller-node.onrender.com");

const MainMenu = ({
  activeSection2,
  setActiveSection2,
  activeSection3,
  setActiveSection3,
  showCustomAlert,
}) => {
  const [products, setProducts] = useState([]);
  const [user, setuser] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showMenu, setshowMenu] = useState(false);
  const [showMore, setshowMore] = useState(false);
  const [showMenu2, setshowMenu2] = useState(false);
  const [cart, setCart] = useState([]);
  const endpoint = "https://chef-chiller-node.onrender.com";
  const [orderItems, setOrderItems] = useState([]);
  const [subtotal, setsubtotal] = useState(0);
  const [productId, setProductId] = useState("");
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://chef-chiller-node.onrender.com/user/getuser/${id}`
        );
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
  }, [id]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://chef-chiller-node.onrender.com/chefchiller/user/getproducts"
      );
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formik = useFormik({
    initialValues: { category: "" },
  });

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

  return (
    <>
      <main className="child h-[100h] flex-1 p-6 bg-gray-100 w-[63.65vw]">
        <section className="section1 flex gap-3 items-center justify-between mb-6">
          <h3 className="text-2xl flex-shrink-0 font-[12px]">Food & Drinks</h3>
          <div className="list overflow-x-scroll no-scrollbar flex space-x-2">
            <button
              onClick={() => setActiveSection2("mainMenu")}
              className={`px-3 py-1 rounded-full flex-shrink-0 ${
                activeSection2 === "mainMenu"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveSection2("topMenu")}
              className={`px-3 py-1 rounded-full ${
                activeSection2 === "topMenu"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Top Menu
            </button>
            <button
              onClick={() => setActiveSection2("mainCourse")}
              className={`px-3 py-1 rounded-full ${
                activeSection2 === "mainCourse"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Main Course
            </button>
            <button
              onClick={() => setActiveSection2("sideMenu")}
              className={`px-3 py-1 rounded-full ${
                activeSection2 === "sideMenu"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Side Menu
            </button>
            <button
              onClick={() => setActiveSection2("bakedMenu")}
              className={`px-3 py-1 rounded-full ${
                activeSection2 === "bakedMenu"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Bakery Products
            </button>
          </div>
        </section>

        {loading ? (
          <div className="w-full flex flex-col min-h-[80vh] overflow-y-auto no-scrollbar">
            <section className="section2 flex w-[60vw] h-full flex-col">
              <h3 className="text-xl font-semibold mb-1">Top Menu</h3>
              <div className="section3 w-full py-4 h-[45vh] flex items-center overflow-y-auto gap-4 no-scrollbar">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="foodBox flex-shrink-0 py-4 px-2 w-[60vw] rounded-lg shadow-md bg-gray-300 animate-pulse"
                  >
                    <div className="w-[40%] h-full bg-gray-400"></div>
                    <div className="section4 flex h-full w-[60%] flex-col items-start">
                      <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-400 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          activeSection2 === "mainMenu" && (
            <div className="w-full flex flex-col min-h-[80vh] overflow-y-auto no-scrollbar">
              <section className="section2 flex w-full flex-col">
                <h3 className="text-xl font-semibold mb-1">Main Course</h3>
                <div className="section3 py-4 h-[45vh] flex items-center overflow-y-auto gap-4 no-scrollbar">
                  {products.map((product, index) => (
                    <div
                      key={index}
                      style={{
                        // backgroundColor: "rgb(204, 15, 49)",
                        height: "100%",
                        gap: "2vw",
                      }}
                      onClick={() => {
                        localStorage.setItem(
                          "productId",
                          JSON.stringify(product._id)
                        );
                        setActiveSection3("mainMenu5");
                      }}
                      className="foodBox flex-shrink-0 py-4 px-2 w-[60vw] rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-[40%] h-full object-cover"
                      />
                      <div className="section4 flex h-full w-[60%] flex-col items-start">
                        <h4 className="text-lg font-bold">{product.name}</h4>
                        <p className="text-gray-600 text-center">
                          ₦
                          {product.price.toLocaleString("en-NG", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <div className="flex justify-center items-center mt-2">
                          <button
                            // onClick={() => updateCart(product, "decrease")}
                            disabled={isUpdating}
                            className="px-2 py-1 bg-gray-300 rounded"
                          >
                            -
                          </button>
                          <span className="mx-3 text-lg font-semibold">1</span>
                          <button
                            // onClick={() => updateCart(product, "increase")}
                            disabled={isUpdating}
                            className="px-2 py-1 bg-gray-300 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="section2 flex w-full flex-col">
                <h3 className="text-xl font-semibold mb-1">Main Course</h3>
                <div className="section3 py-4 h-[45vh] flex items-center overflow-y-auto gap-4 no-scrollbar">
                  {products
                    .filter(
                      (product) =>
                        product.category.toLowerCase() === "main course"
                    ) // Filter for 'Main Course' category
                    .map((product, index) => (
                      <div
                        key={index}
                        style={{
                          // backgroundColor: "rgb(204, 15, 49)",
                          height: "100%",
                          gap: "2vw",
                        }}
                        onClick={() => {
                          localStorage.setItem(
                            "productId",
                            JSON.stringify(product._id)
                          );
                          setActiveSection3("mainMenu5");
                        }}
                        className="foodBox flex-shrink-0 py-4 px-2 w-[60vw] rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-[40%] h-full object-cover"
                        />
                        <div className="section4 flex h-full w-[60%] flex-col items-start">
                          <h4 className="text-lg font-bold">{product.name}</h4>
                          <p className="text-gray-600 text-center">
                            ₦
                            {product.price.toLocaleString("en-NG", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <div className="flex justify-center items-center mt-2">
                            <button
                              // onClick={() => updateCart(product, "decrease")}
                              disabled={isUpdating}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              -
                            </button>
                            <span className="mx-3 text-lg font-semibold">
                              1
                            </span>
                            <button
                              // onClick={() => updateCart(product, "increase")}
                              disabled={isUpdating}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>

              <section className="section2 flex w-full flex-col">
                <h3 className="text-xl font-semibold mb-1">Extras</h3>
                <div className="section3 py-4 h-[45vh] flex items-center overflow-y-auto gap-4 no-scrollbar">
                  {products
                    .filter((product) => product.category === "Extras") // Filter for 'Main Course' category
                    .map((product, index) => (
                      <div
                        key={index}
                        style={{
                          // backgroundColor: "rgb(204, 15, 49)",
                          height: "100%",
                          gap: "2vw",
                        }}
                        onClick={() => {
                          localStorage.setItem(
                            "productId",
                            JSON.stringify(product._id)
                          );
                          setActiveSection3("mainMenu5");
                        }}
                        className="foodBox flex-shrink-0 py-4 px-2 w-[60vw] rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-[40%] h-full object-cover"
                        />
                        <div className="section4 flex h-full w-[60%] flex-col items-start">
                          <h4 className="text-lg font-bold">{product.name}</h4>
                          <p className="text-gray-600 text-center">
                            ₦
                            {product.price.toLocaleString("en-NG", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <div className="flex justify-center items-center mt-2">
                            <button
                              // onClick={() => updateCart(product, "decrease")}
                              disabled={isUpdating}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              -
                            </button>
                            <span className="mx-3 text-lg font-semibold">
                              1
                            </span>
                            <button
                              // onClick={() => updateCart(product, "increase")}
                              disabled={isUpdating}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            </div>
          )
        )}

        {activeSection2 === "topMenu" && (
          <div className="w-[60vw] flex flex-col h-[80vh]">
            <section className="section5 flex w-full h-full flex-col">
              <h3 className="text-xl font-semibold mb-1">Top Menu</h3>
              <div className="section6 py-4 h-[97%] w-full flex flex-wrap overflow-x-auto gap-4 no-scrollbar">
                {products
                  .filter(
                    (product) => product.category.toLowerCase() === "specials"
                  )
                  .map((product, index) => (
                    <div
                      key={index}
                      style={{
                        height: "60%",
                        gap: "2vw",
                        width: "47%",
                      }}
                      onClick={() => {
                        localStorage.setItem(
                          "productId",
                          JSON.stringify(product._id)
                        );
                        setActiveSection3("mainMenu5");
                      }}
                      className="section7 flex-shrink-0 py-4 px-2 w-[60vw] rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-[40%] h-full object-cover"
                      />
                      <div className="section4 flex h-full w-[60%] flex-col items-start">
                        <h4 className="text-lg font-bold">{product.name}</h4>
                        <p className="text-gray-600 text-center">
                          ₦
                          {product.price.toLocaleString("en-NG", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <div className="flex justify-center items-center mt-2">
                          <button
                            disabled={isUpdating}
                            className="px-2 py-1 bg-gray-300 rounded"
                          >
                            -
                          </button>
                          <span className="mx-3 text-lg font-semibold">1</span>
                          <button
                            disabled={isUpdating}
                            className="px-2 py-1 bg-gray-300 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        )}

        {activeSection2 === "mainCourse" && (
          <div className="w-[60vw] flex flex-col h-[80vh]">
            <section className="flex w-full h-full flex-col">
              <h3 className="text-xl font-semibold mb-1">Our Main Course</h3>
              <div className="section6 py-4 h-[97%] w-full flex flex-wrap overflow-x-auto gap-4 no-scrollbar">
                {products
                  .filter(
                    (product) =>
                      product.category.toLowerCase() === "main course"
                  )
                  .map((product, index) => (
                    <div
                      key={index}
                      style={{
                        height: "60%",
                        gap: "2vw",
                        width: "47%",
                      }}
                      onClick={() => {
                        localStorage.setItem(
                          "productId",
                          JSON.stringify(product._id)
                        );
                        setActiveSection3("mainMenu5");
                      }}
                      className="section7 flex-shrink-0 py-4 px-2 w-[60vw] rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-[40%] h-full object-cover"
                      />
                      <div className="flex h-full w-[60%] flex-col items-start">
                        <h4 className="text-lg font-bold">{product.name}</h4>
                        <p className="text-gray-600 text-center">
                          ₦
                          {product.price.toLocaleString("en-NG", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <div className="flex justify-center items-center mt-2">
                          <button
                            disabled={isUpdating}
                            className="px-2 py-1 bg-gray-300 rounded"
                          >
                            -
                          </button>
                          <span className="mx-3 text-lg font-semibold">1</span>
                          <button
                            disabled={isUpdating}
                            className="px-2 py-1 bg-gray-300 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        )}

        {activeSection2 === "sideMenu" && (
          <div className="w-[60vw] flex flex-col h-[80vh]">
            <section className="flex w-full h-full flex-col">
              <h3 className="text-xl font-semibold mb-1">Side Menu</h3>
              <div className="section6 py-4 h-[97%] w-full flex flex-wrap overflow-x-auto gap-4 no-scrollbar">
                {products
                  .filter((product) =>
                    ["beverages", "appetizers", "extras"].includes(
                      product.category.toLowerCase()
                    )
                  )
                  .map((product, index) => (
                    <div
                      key={index}
                      style={{
                        height: "60%",
                        gap: "2vw",
                        width: "47%",
                      }}
                      onClick={() => {
                        localStorage.setItem(
                          "productId",
                          JSON.stringify(product._id)
                        );
                        setActiveSection3("mainMenu5");
                      }}
                      className="section7 flex-shrink-0 py-4 px-2 w-[60vw] rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-[40%] h-full object-cover"
                      />
                      <div className="flex h-full w-[60%] flex-col items-start">
                        <h4 className="text-lg font-bold">{product.name}</h4>
                        <p className="text-gray-600 text-center">
                          ₦
                          {product.price.toLocaleString("en-NG", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <div className="flex justify-center items-center mt-2">
                          <button
                            disabled={isUpdating}
                            className="px-2 py-1 bg-gray-300 rounded"
                          >
                            -
                          </button>
                          <span className="mx-3 text-lg font-semibold">1</span>
                          <button
                            disabled={isUpdating}
                            className="px-2 py-1 bg-gray-300 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        )}

        {activeSection2 === "bakedMenu" && (
          <div className="w-[60vw] flex flex-col h-[80vh]">
            <section className="flex w-full h-full flex-col">
              <h3 className="text-xl font-semibold mb-1">Bakery goods</h3>
              <div className="section6 py-4 h-[97%] w-full flex flex-wrap overflow-x-auto gap-4 no-scrollbar">
                {products
                  .filter(
                    (product) => product.category.toLowerCase() === "snacks"
                  )
                  .map((product, index) => (
                    <div
                      key={index}
                      style={{
                        height: "60%",
                        gap: "2vw",
                        width: "47%",
                      }}
                      onClick={() => {
                        localStorage.setItem(
                          "productId",
                          JSON.stringify(product._id)
                        );
                        setActiveSection3("mainMenu5");
                      }}
                      className="section7 flex-shrink-0 py-4 px-2 w-[60vw] rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-[40%] h-full object-cover"
                      />
                      <div className="flex h-full w-[60%] flex-col items-start">
                        <h4 className="text-lg font-bold">{product.name}</h4>
                        <p className="text-gray-600 text-center">
                          ₦
                          {product.price.toLocaleString("en-NG", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <div className="flex justify-center items-center mt-2">
                          <button
                            disabled={isUpdating}
                            className="px-2 py-1 bg-gray-300 rounded"
                          >
                            -
                          </button>
                          <span className="mx-3 text-lg font-semibold">1</span>
                          <button
                            disabled={isUpdating}
                            className="px-2 py-1 bg-gray-300 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
};

export default MainMenu;
