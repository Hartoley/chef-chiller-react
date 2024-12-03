import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import "./user.css";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import FoodsDrinks from "./FoodsDrinks";
import Messages from "./Messages";
import Notifications from "./Notifications";
import Basket from "./Basket";
import MainMenu from "./MainMenu";
import Product from "./Product";
import Setting from "./Setting";
import io from "socket.io-client";

const socket = io("https://chef-chiller-node.onrender.com");

function CustomAlert({ message, type, onClose }) {
  // Default alert styles based on the type (success, error, info)
  const alertStyles = {
    success: "bg-gray-900 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-4 w-80 rounded-lg shadow-lg ${alertStyles[type]}`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="text-lg font-semibold">
          &times;
        </button>
      </div>
    </div>
  );
}

const UserDashboard = () => {
  const [activeSection2, setActiveSection2] = useState("mainMenu");
  const [activeSection3, setActiveSection3] = useState("mainMenu1");
  const [products, setProducts] = useState([]);
  const [user, setuser] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showMenu, setshowMenu] = useState(false);
  const [showMore, setshowMore] = useState(false);
  const [isFetching, setisFetching] = useState(false);
  const [showMenu2, setshowMenu2] = useState(false);
  const [cart, setCart] = useState([]);
  const endpoint = "https://chef-chiller-node.onrender.com";
  const [orderItems, setOrderItems] = useState([]);
  const [subtotal, setsubtotal] = useState(0);
  // const { id } = useParams();
  const id = JSON.parse(localStorage.getItem("id"));
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [isVisible, setIsVisible] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");

  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth <= 767;
      setIsSmallScreen(smallScreen);

      // Trigger an alert when the screen is small
      if (smallScreen) {
        // alert("Screen size is 767px or smaller!");
      }
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Check if .mother is 90% or more in view
        setIsVisible(entry.intersectionRatio >= 0.9);
      },
      {
        root: null, // Using the viewport as the root
        threshold: 0.9, // Trigger when 90% of .mother is in view
      }
    );

    const motherElement = document.querySelector(".mother");
    if (motherElement) {
      observer.observe(motherElement);
    }

    // Cleanup the observer
    return () => {
      if (motherElement) {
        observer.unobserve(motherElement);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setisFetching(true);
      // toast.loading("Fetching items");
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
        setisFetching(false);
        showCustomAlert("Items fetched successfully!", "success");

        // toast.dismiss(); // Dismiss loading toast
      } catch (err) {
        console.log(err);
        setisFetching(false);
        toast.error("Failed to fetch data");
      }
    };

    fetchData();

    socket.on("ordersUpdated", (data) => {
      if (data.userId === id) {
        setOrderItems(data.orders);
        console.log(data);
        setuser(data.user);
        const subtotal = data.orders.reduce((total, order) => {
          return total + order.productPrice * order.quantity;
        }, 0);
        setsubtotal(subtotal);
        // toast.success("Orders updated successfully!");
      }
    });

    return () => {
      socket.off("ordersUpdated");
    };
  }, [id, socket]);

  // console.log(id);

  useEffect(() => {}, [isMenuVisible]);

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
    setshowMenu((prev) => !prev);
    // console.log(isMenuVisible);
  };

  const toggleMenu2 = () => {
    setIsMenuVisible((prev) => !prev);
    setshowMenu2((prev) => !prev);
    // console.log(isMenuVisible);
  };

  // console.log(user.orders.length);

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

  useEffect(() => {
    fetchData();
  }, [formik.values.category]);

  const showCustomAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      <div className="mainContainer relative flex h-screen font-sans text-gray-800 bg-gray-100">
        <div
          style={{ position: showMore ? "fixed" : "static" }}
          className="mother relative flex h-screen font-sans text-gray-800 bg-gray-100"
        >
          <div class="flex items-center justify-between p-4 bg-gray-900 text-white md:hidden">
            <div class="text-lg font-semibold">Logo</div>

            <div class="flex items-center space-x-4">
              {/* <div onClick={toggleMenu} class="">
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
                    d="M3 3h2l3 8h10l3-8H6M3 3v2m14 14a2 2 0 100-4 2 2 0 000 4zM5 17a2 2 0 100-4 2 2 0 000 4z"
                  ></path>
                </svg>

                {user?.orders?.length > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs text-center">
                    {user.orders.length > 5 ? "5+" : user.orders.length}
                  </span>
                )}
              </div> */}

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
          <div
            className={`sideNav4 mt-[85vh] ${
              isSmallScreen ? "flex" : "hidden"
            } ${
              isVisible ? "" : "hidden"
            } fixed w-full flex justify-center items-center`}
          >
            <nav className="flex items-center justify-evenly w-4/5 bg-transparent">
              <p
                onClick={() => {
                  setActiveSection3("mainMenu4");
                  setshowMenu2(false);
                }}
                className="flex items-center text-[14px] hover:text-gray-300"
              >
                <span className="text-2xl">🍲</span>
              </p>
              <p
                onClick={() => {
                  setActiveSection3("mainMenu3");
                  setshowMenu2(false);
                }}
                className="flex items-center text-[14px] hover:text-gray-300"
              >
                <span className="text-2xl">⚙️</span>
              </p>
              <p
                onClick={() => {
                  setActiveSection3("mainMenu1");
                  setshowMenu2(false);
                }}
                className="flex items-center text-[14px] hover:text-gray-300"
              >
                <span className="text-4xl">🏠</span>
              </p>
              <p
                onClick={() => {
                  setActiveSection3("mainMenu2");
                  setshowMenu2(false);
                }}
                className="flex items-center text-[14px] hover:text-gray-300"
              >
                <span className="text-2xl">⌛</span>
              </p>
              <p
                onClick={() => setActiveSection3("mainMenu6")}
                className="flex items-center text-[14px] hover:text-gray-300"
              >
                <span className="text-2xl">📜</span>
              </p>
            </nav>
          </div>
          {showAlert && (
            <CustomAlert
              message={alertMessage}
              type={alertType}
              onClose={hideAlert}
            />
          )}
          <aside className="sideNav w-[15vw] bg-gray-900 text-white flex flex-col justify-between py-4 px-2">
            <div>
              <h1 className="text-2xl font-bold mb-8 text-center">FoodWish!</h1>
              <nav className="flex bg-gray-900 items-start gap-2 flex-col">
                <p
                  onClick={() => setActiveSection3("mainMenu1")}
                  className="flex items-center text-[14px] hover:text-gray-300"
                >
                  <span className="mr-3">🏠</span> Dashboard
                </p>
                <p
                  onClick={() => setActiveSection3("mainMenu4")}
                  className="flex items-center text-[14px] hover:text-gray-300"
                >
                  <span className="mr-3">🍲</span> Basket
                  {user?.orders?.length > 0 && (
                    <span className="mb-2 ml-2 block h-5 w-5 rounded-full bg-red-500 text-white text-xs text-center">
                      {user.orders.length > 5 ? "5+" : user.orders.length}
                    </span>
                  )}
                </p>
                <p
                  onClick={() => setActiveSection3("mainMenu3")}
                  className="flex items-center text-[14px] hover:text-gray-300"
                >
                  <span className="mr-3">⚙️</span> Messages
                </p>
                <p
                  onClick={() => setActiveSection3("mainMenu2")}
                  className="flex items-center text-[14px] hover:text-gray-300"
                >
                  <span className="mr-3">⌛</span> Awaiting
                </p>
                <p
                  onClick={() => setActiveSection3("mainMenu6")}
                  className="flex items-center text-[14px] hover:text-gray-300"
                >
                  <span className="mr-3">📜</span> History
                </p>
              </nav>
            </div>
            <footer className="text-sm text-gray-500 mt-8">
              <p>© 2024 FoodWish! POS</p>
              <p>Terms • Privacy</p>
            </footer>
          </aside>
          <>
            {activeSection3 === "mainMenu1" && (
              <MainMenu
                activeSection2={activeSection2}
                setActiveSection2={setActiveSection2}
                activeSection3={activeSection3}
                setActiveSection3={setActiveSection3}
              />
            )}
            {activeSection3 === "mainMenu2" && <FoodsDrinks />}
            {activeSection3 === "mainMenu3" && <Messages />}
            {activeSection3 === "mainMenu4" && <Basket />}
            {activeSection3 === "mainMenu5" && (
              <Product
                activeSection2={activeSection2}
                setActiveSection2={setActiveSection2}
                activeSection3={activeSection3}
                setActiveSection3={setActiveSection3}
              />
            )}
            {activeSection3 === "mainMenu6" && <Setting />}
          </>

          <aside
            className={`sideNav2 w-[20vw] flex-shrink-0 bg-gray-900 text-white p-6 flex flex-col justify-between fixed z-10 transition-transform transform ${
              isMenuVisible ? "translate-x-0" : "-translate-x-full"
            } md:static md:transform-none md:translate-x-0`}
          >
            <div>
              <div className="text-xl font-semibold mb-6">Basket</div>
              <div className="flex justify-between items-center mb-4 p-2">
                <span>Today</span>
                <span>🕒 {formattedDate}</span>
              </div>
              <div className="space-y-4 h-[30vh] overflow-y-auto no-scrollbar">
                {orderItems
                  // .filter((order) => order.approved)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex font-white gap-1 justify-between"
                    >
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

              {/* <div className="flex space-x-2 mt-4">
                <button className="flex-1 bg-red-700 py-2 rounded hover:bg-red-800">
                  Cash
                </button>
                <button className="flex-1 bg-orange-400 rounded hover:bg-orange-500">
                  Debit
                </button>
                <button className="flex-1 bg-green-600 py-2 rounded hover:bg-green-700">
                  E-wallet
                </button>
              </div> */}
              <button
                onClick={() => setActiveSection3("mainMenu4")}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded"
              >
                Place Order
              </button>
            </div>
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
                        d="M3 3h2l3 8h10l3-8H6M3 3v2m14 14a2 2 0 100-4 2 2 0 000 4zM5 17a2 2 0 100-4 2 2 0 000 4z"
                      ></path>
                    </svg>

                    {user?.orders?.length > 0 && (
                      <span className="relative top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs text-center">
                        {user.orders.length > 5 ? "5+" : user.orders.length}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span>Today</span>
                  <span>🕒 {formattedDate}</span>
                </div>
                <div className="space-y-4 h-[30vh] overflow-y-auto no-scrollbar">
                  {orderItems
                    // .filter((order) => order.approved)
                    .map((item, index) => (
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

                {/* <div className="flex space-x-2 mt-4">
                  <button className="flex-1 bg-red-700 py-2 rounded hover:bg-red-800">
                    Cash
                  </button>
                  <button className="flex-1 bg-orange-400 rounded hover:bg-orange-500">
                    Debit
                  </button>
                  <button className="flex-1 bg-green-600 py-2 rounded hover:bg-green-700">
                    E-wallet
                  </button>
                </div> */}

                <button
                  onClick={() => setActiveSection3("mainMenu4")}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded"
                >
                  Place Order
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default UserDashboard;
