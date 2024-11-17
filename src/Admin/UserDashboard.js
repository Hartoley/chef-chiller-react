import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import "./user.css";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";

const UserDashboard = () => {
  const [activeSection2, setActiveSection2] = useState("mainMenu");
  const [products, setProducts] = useState([]);
  const [user, setuser] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showMenu, setshowMenu] = useState(false);
  const [showMenu2, setshowMenu2] = useState(false);
  const [cart, setCart] = useState([]);
  const endpoint = "https://chef-chiller-node.onrender.com";
  const [orderItems, setOrderItems] = useState([]);
  const [subtotal, setsubtotal] = useState(0);
  const { id } = useParams();
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5010/user/getuser/${id}`);
        // console.log("students data from API:", res.data);
        setuser(res.data.data);
        setOrderItems(res.data.data.orders);
        const subtotal = res.data.data.orders.reduce((total, order) => {
          return total + order.productPrice;
        }, 0);

        setsubtotal(subtotal);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);
  // console.log(id);
  console.log(user);

  useEffect(() => {
    console.log(isMenuVisible);
  }, [isMenuVisible]);

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
    setshowMenu((prev) => !prev);
    console.log(isMenuVisible);
  };

  const toggleMenu2 = () => {
    setIsMenuVisible((prev) => !prev);
    setshowMenu2((prev) => !prev);
    console.log(isMenuVisible);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://chef-chiller-node.onrender.com/chefchiller/user/getproducts"
      );
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const formik = useFormik({
    initialValues: { category: "" },
  });

  const [isUpdating, setIsUpdating] = useState(false);

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
        "http://localhost:5010/chefchiller/updatecart",
        {
          userId: user._id,
          productId: product._id,
          productName: product.name,
          productPrice: product.price,
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

  // const syncCartWithServer = (product, action, quantity) => {
  //   const toastId = toast.loading("Updating cart...");
  //   console.log(quantity);

  //   axios
  //     .post("http://localhost:5010/chefchiller/updatecart", {
  //       userId: user._id,
  //       productId: product._id,
  //       productName: product.name,
  //       productPrice: product.price,
  //       quantity,
  //     })
  //     .then((response) => {
  //       toast.update(toastId, {
  //         render: response.data.message || "Cart updated successfully!",
  //         type: "success",
  //         isLoading: false,
  //         autoClose: 3000,
  //       });
  //     })
  //     .catch((error) => {
  //       toast.update(toastId, {
  //         render: "Error updating the cart. Please try again.",
  //         type: "error",
  //         isLoading: false,
  //         autoClose: 3000,
  //       });
  //       console.error("Error updating the cart:", error);
  //     });
  // };

  // console.log(user._id);

  useEffect(() => {
    fetchData();
  }, [formik.values.category]);

  return (
    <>
      <div className="mainContainer flex h-screen font-sans text-gray-800 bg-gray-100">
        <div class="flex items-center justify-between p-4 bg-gray-900 text-white md:hidden">
          <div class="text-lg font-semibold">Logo</div>

          <div class="flex items-center space-x-4">
            <div onClick={toggleMenu} class="relative">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m5.6 0L9 21m5-6H7m0 0l1.6-8m4.8 0h4.2"
                ></path>
              </svg>

              <span class="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs text-center">
                3
              </span>
            </div>

            <button onClick={toggleMenu2}>
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        {showMenu2 && (
          <aside className="sideNav4 w-[15vw] bg-gray-900 text-white flex flex-col justify-between py-4 px-2">
            <div>
              <div className="flex w-full items-center mb-8 justify-between h-10">
                <h1 className="text-2xl font-bold text-center">FoodWish!</h1>

                {/* <button onClick={toggleMenu2}>
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    ></path>
                  </svg>
                </button> */}
              </div>
              <nav className="flex bg-gray-900 items-start gap-2 flex-col">
                <p className="flex items-center text-[14px] hover:text-gray-300">
                  <span className="mr-3">🏠</span> Dashboard
                </p>
                <p className="flex items-center text-[14px] hover:text-gray-300">
                  <span className="mr-3">🍲</span> Food & Drinks
                </p>
                <p className="flex items-center text-[14px] hover:text-gray-300">
                  <span className="mr-3">💬</span> Messages
                </p>
                <p className="flex items-center text-[14px] hover:text-gray-300">
                  <span className="mr-3">💸</span> Bills
                </p>
                <p className="flex items-center text-[14px] hover:text-gray-300">
                  <span className="mr-3">⚙️</span> Settings
                </p>
                <p className="flex items-center text-[14px] hover:text-gray-300">
                  <span className="mr-3">🔔</span> Notifications
                </p>
              </nav>
            </div>
            <footer className="text-sm text-gray-500 mt-8">
              <p>© 2024 FoodWish! POS</p>
              <p>Terms • Privacy</p>
            </footer>
          </aside>
        )}
        <aside className="sideNav w-[15vw] bg-gray-900 text-white flex flex-col justify-between py-4 px-2">
          <div>
            <h1 className="text-2xl font-bold mb-8 text-center">FoodWish!</h1>
            <nav className="flex bg-gray-900 items-start gap-2 flex-col">
              <p className="flex items-center text-[14px] hover:text-gray-300">
                <span className="mr-3">🏠</span> Dashboard
              </p>
              <p className="flex items-center text-[14px] hover:text-gray-300">
                <span className="mr-3">🍲</span> Food & Drinks
              </p>
              <p className="flex items-center text-[14px] hover:text-gray-300">
                <span className="mr-3">💬</span> Messages
              </p>
              <p className="flex items-center text-[14px] hover:text-gray-300">
                <span className="mr-3">💸</span> Bills
              </p>
              <p className="flex items-center text-[14px] hover:text-gray-300">
                <span className="mr-3">⚙️</span> Settings
              </p>
              <p className="flex items-center text-[14px] hover:text-gray-300">
                <span className="mr-3">🔔</span> Notifications
              </p>
            </nav>
          </div>
          <footer className="text-sm text-gray-500 mt-8">
            <p>© 2024 FoodWish! POS</p>
            <p>Terms • Privacy</p>
          </footer>
        </aside>
        <main className="flex-1 p-6 bg-gray-100">
          <section className="section1 flex items-center justify-between mb-6">
            <h3 className="text-2xl font-[12px]">Food & Drinks</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveSection2("mainMenu")}
                className={`px-3 py-1 rounded-full ${
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

          {activeSection2 === "mainMenu" && (
            <div className="w-full flex flex-col  h-[80vh] overflow-y-auto no-scrollbar">
              <section className="section2 flex w-[60vw] flex-col">
                <h3 className="text-xl font-semibold mb-1">Top Menu</h3>
                <div className="section3 w-full py-4 h-[45vh] flex items-center overflow-y-auto gap-4 no-scrollbar">
                  {products.map((product, index) => (
                    <div
                      key={index}
                      style={{
                        // backgroundColor: "rgb(204, 15, 49)",
                        height: "100%",
                        gap: "2vw",
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
                          ₦{product.price.toFixed(2)}
                        </p>
                        <div className="flex justify-center items-center mt-2">
                          <button
                            onClick={() => updateCart(product, "decrease")}
                            disabled={isUpdating}
                            className="px-2 py-1 bg-gray-300 rounded"
                          >
                            -
                          </button>
                          <span className="mx-3 text-lg font-semibold">1</span>
                          <button
                            onClick={() => updateCart(product, "increase")}
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
                            ₦{product.price.toFixed(2)}
                          </p>
                          <div className="flex justify-center items-center mt-2">
                            <button
                              onClick={() => updateCart(product, "decrease")}
                              disabled={isUpdating}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              -
                            </button>
                            <span className="mx-3 text-lg font-semibold">
                              1
                            </span>
                            <button
                              onClick={() => updateCart(product, "increase")}
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
              <section className="section2 flex w-[60vw] flex-col">
                <h3 className="text-xl font-semibold mb-1">New Menu</h3>
                <div className="section3 py-4 h-[45vh] flex items-center overflow-y-auto gap-4 no-scrollbar">
                  {products
                    .filter((product) => {
                      const createdAt = new Date(product.createdAt);
                      const now = new Date();
                      const differenceInMs = now - createdAt;
                      return differenceInMs < 48 * 60 * 60 * 1000;
                    })
                    .map((product, index) => (
                      <div
                        key={index}
                        style={{
                          // backgroundColor: "rgb(204, 15, 49)",
                          height: "100%",
                          gap: "2vw",
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
                            ₦{product.price.toFixed(2)}
                          </p>
                          <div className="flex justify-center items-center mt-2">
                            <button
                              onClick={() => updateCart(product, "decrease")}
                              disabled={isUpdating}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              -
                            </button>
                            <span className="mx-3 text-lg font-semibold">
                              1
                            </span>
                            <button
                              onClick={() => updateCart(product, "increase")}
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

          {activeSection2 === "topMenu" && (
            <div className="w-[60vw] flex flex-col h-[80vh]">
              <section className="section5 flex w-full h-full flex-col">
                <h3 className="text-xl font-semibold mb-1">Top Menu</h3>
                <div className="section6 py-4 h-[97%] w-full flex flex-wrap overflow-x-auto gap-4 no-scrollbar">
                  {products
                    .filter(
                      (product) => product.category.toLowerCase() === "specials"
                    ) // Filter for 'Main Course' category
                    .map((product, index) => (
                      <div
                        key={index}
                        style={{
                          // backgroundColor: "rgb(204, 15, 49)",
                          height: "60%",
                          gap: "2vw",
                          width: "47%",
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
                            ₦{product.price.toFixed(2)}
                          </p>
                          <div className="flex justify-center items-center mt-2">
                            <button
                              onClick={() => updateCart(product, "decrease")}
                              disabled={isUpdating}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              -
                            </button>
                            <span className="mx-3 text-lg font-semibold">
                              1
                            </span>
                            <button
                              onClick={() => updateCart(product, "increase")}
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
                    ) // Filter for 'Main Course' category
                    .map((product, index) => (
                      <div
                        key={index}
                        style={{
                          // backgroundColor: "rgb(204, 15, 49)",
                          height: "60%",
                          gap: "2vw",
                          width: "47%",
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
                            ₦{product.price.toFixed(2)}
                          </p>
                          <div className="flex justify-center items-center mt-2">
                            <button
                              onClick={() => updateCart(product, "decrease")}
                              disabled={isUpdating}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              -
                            </button>
                            <span className="mx-3 text-lg font-semibold">
                              1
                            </span>
                            <button
                              onClick={() => updateCart(product, "increase")}
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
                    ) // Filter for 'Main Course' category
                    .map((product, index) => (
                      <div
                        key={index}
                        style={{
                          // backgroundColor: "rgb(204, 15, 49)",
                          height: "60%",
                          gap: "2vw",
                          width: "47%",
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
                            ₦{product.price.toFixed(2)}
                          </p>
                          <div className="flex justify-center items-center mt-2">
                            <button
                              onClick={() => updateCart(product, "decrease")}
                              disabled={isUpdating}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              -
                            </button>
                            <span className="mx-3 text-lg font-semibold">
                              1
                            </span>
                            <button
                              onClick={() => updateCart(product, "increase")}
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
                    ) // Filter for 'Main Course' category
                    .map((product, index) => (
                      <div
                        key={index}
                        style={{
                          // backgroundColor: "rgb(204, 15, 49)",
                          height: "60%",
                          gap: "2vw",
                          width: "47%",
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
                            ₦{product.price.toFixed(2)}
                          </p>
                          <div className="flex justify-center items-center mt-2">
                            <button
                              onClick={() => updateCart(product, "decrease")}
                              disabled={isUpdating}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              -
                            </button>
                            <span className="mx-3 text-lg font-semibold">
                              1
                            </span>
                            <button
                              onClick={() => updateCart(product, "increase")}
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
        <aside
          className={`sideNav2 w-[20%] flex-shrink-0 bg-gray-900 text-white p-6 flex flex-col justify-between fixed z-10 transition-transform transform ${
            isMenuVisible ? "translate-x-0" : "-translate-x-full"
          } md:static md:transform-none md:translate-x-0`}
        >
          <div>
            <div className="text-xl font-semibold mb-6">Current Order</div>
            <div className="flex justify-between items-center mb-4">
              <span>Today</span>
              <span>🕒 {formattedDate}</span>
            </div>
            <div className="space-y-4 h-[30vh] overflow-y-auto no-scrollbar">
              {orderItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.productName}</span>
                  <span>₦{item.productPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 mt-6 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span>₦{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fee</span>
                <span>₦0.00</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₦{subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-red-700 py-2 rounded hover:bg-red-800">
                Cash
              </button>
              <button className="flex-1 bg-orange-400 rounded hover:bg-orange-500">
                Debit
              </button>
              <button className="flex-1 bg-green-600 py-2 rounded hover:bg-green-700">
                E-wallet
              </button>
            </div>
          </div>

          <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded">
            Place Order
          </button>
        </aside>

        {showMenu && (
          <aside
            className={`sideNav3 w-80 bg-gray-900 text-white p-6 flex flex-col justify-between fixed z-10 transition-transform transform ${
              isMenuVisible ? "translate-x-0" : "-translate-x-full"
            } md:static md:transform-none md:translate-x-0`}
          >
            <div>
              <div className="text-xl font-semibold mb-6 flex items-center justify-between">
                <p className="text-xl font-semibold">Current Order</p>
                <div onClick={toggleMenu} class="relative">
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m5.6 0L9 21m5-6H7m0 0l1.6-8m4.8 0h4.2"
                    ></path>
                  </svg>

                  <span class="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs text-center">
                    3
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span>Today</span>
                <span>🕒 {formattedDate}</span>
              </div>
              <div className="space-y-4 h-[30vh] overflow-y-auto no-scrollbar">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.productName}</span>
                    <span>₦{item.productPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 mt-6 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₦{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee</span>
                  <span>₦0.00</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₦{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button className="flex-1 bg-red-700 py-2 rounded hover:bg-red-800">
                  Cash
                </button>
                <button className="flex-1 bg-orange-400 rounded hover:bg-orange-500">
                  Debit
                </button>
                <button className="flex-1 bg-green-600 py-2 rounded hover:bg-green-700">
                  E-wallet
                </button>
              </div>
            </div>

            <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded">
              Place Order
            </button>
          </aside>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default UserDashboard;
