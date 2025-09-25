import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import "./user.css";
import { useParams } from "react-router-dom";
import Footer from "../Admin/Footer";
import FoodsDrinks from "./FoodsDrinks";
import Messages from "./Messages";
import Notifications from "../Admin/Notifications";
import Basket from "../Admin/Basket";
import MainMenu from "./MainMenu";
import Product from "./Product";
import Setting from "./Setting";
import io from "socket.io-client";
import AsideSidebar from "../Admin/AsideSidebar";
import AsideBasket from "../Admin/AsideBsaket";
import AsideMobile from "../Admin/AsideMobile";

const socket = io("https://chef-chiller-node.onrender.com");

function CustomAlert({ message, type, onClose, isLoading = false }) {
  const alertStyles = {
    success: "bg-gray-900 text-white",
    error: "bg-red-500 text-white",
    info: "bg-gray-900 text-white",
    loading: "bg-gray-900 text-white",
  };

  return (
    <div
      role="alert"
      aria-live={isLoading ? "polite" : "assertive"}
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-4 w-full max-w-sm rounded-lg shadow-lg ${alertStyles[type]}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {isLoading && <span className="loader mr-2"></span>}
          <span>{message}</span>
        </div>
        {!isLoading && (
          <button
            onClick={onClose}
            className="text-lg font-semibold hover:text-red-500 transition-colors"
          >
            &times;
          </button>
        )}
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
  const [orders, setOrders] = useState([]);
  const [subtotal, setsubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 10;
  const [awaiting, setAwaiting] = useState(0);

  const { id } = useParams();
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
  const [filteredOrdersCount, setfilteredOrdersCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const logout = () => {
    localStorage.removeItem("id");
    window.location.href = "/user/signin";
  };

  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth <= 777;
      setIsSmallScreen(smallScreen);

      if (smallScreen) {
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setisFetching(true);

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
        console.error(err);
      } finally {
        setisFetching(false);
      }
    };

    fetchData();

    // socket listeners
    socket.on("ordersUpdated", (data) => {
      if (data.userId === id) {
        setOrderItems(data.orders);
        setuser(data.user);

        const subtotal = data.orders.reduce((total, order) => {
          return total + order.productPrice * order.quantity;
        }, 0);
        setsubtotal(subtotal);
      }
    });

    socket.on("orderApproved", (data) => {
      setuser(data.user);
      setOrders(data.order);
    });

    return () => {
      socket.off("ordersUpdated");
      socket.off("orderApproved");
    };
  }, [id]);

  const Mylist = async (page = 1) => {
    try {
      showCustomAlert("Fetching Awaiting, please wait...", "info", true);

      const response = await axios.get(
        `https://chef-chiller-node.onrender.com/chefchiller/getmyorders/${id}?page=${page}&limit=${ordersPerPage}`
      );

      const data = response.data;

      if (Array.isArray(data.orders)) {
        setOrders(data.orders);
        setTotalOrders(data.totalOrders || 0);
        setAwaiting(data.orders.length);
        setCurrentPage(data.currentPage || 1);
        setTotalPages(data.totalPages || 1);

        localStorage.setItem("awaitingOrders", data.orders.length.toString());
      } else {
        // In case orders is not an array, reset everything
        setOrders([]);
        setTotalOrders(0);
        setAwaiting(0);
        setCurrentPage(1);
        setTotalPages(1);
        localStorage.setItem("awaitingOrders", "0");
      }

      showCustomAlert("Awaiting fetched successfully!", "success", false);
    } catch (error) {
      console.error("Error fetching Awaiting:", error);

      showCustomAlert(
        "Failed to fetch Awaiting. Please check your connection and try again.",
        "error",
        false
      );
    }
  };

  useEffect(() => {
    Mylist();
  }, [id]);

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

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://chef-chiller-node.onrender.com/chefchiller/user/getproducts"
      );
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: { category: "" },
  });

  useEffect(() => {
    fetchData();
  }, [formik.values.category]);

  let isLoadingFlag = false;

  const showCustomAlert = (message, type, isLoading = false) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    isLoadingFlag = isLoading;

    // Auto-hide non-loading alerts
    if (!isLoading) {
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const hideAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      <div className="relative flex h-screen font-sans text-gray-800 bg-gray-900">
        <div
          style={{ position: showMore ? "fixed" : "static" }}
          className="mother relative flex h-screen font-sans text-gray-800 bg-gray-100"
        >
          <div class=" flex w-full items-center justify-between p-4 bg-gray-900 text-white lg:hidden">
            <div className="image1 flex items-center justify-center rounded-full">
              <img
                class="logo"
                className="rounded-full flex-shrink-0 h-10 w-10"
                src="https://i.pinimg.com/236x/72/e2/84/72e284c245a1ba8817265f69ff8d65d7.jpg"
                alt=""
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={logout}
                title="Log out"
                className="text-white hover:text-red-500 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="28"
                  height="28"
                  fill="currentColor"
                >
                  <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-9H5c-1.1 0-2 .9-2 2v4h2V6h14v12H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                </svg>
              </button>
            </div>
          </div>
          <div
            className={`sideNav4 mt-[85vh] ${isSmallScreen ? "flex" : "hidden"
              } ${isVisible ? "" : "hidden"
              } fixed w-full flex justify-center items-center`}
          >
            <nav className="flex items-center z-20 justify-evenly w-4/5 bg-transparent">
              <p
                onClick={() => {
                  setActiveSection3("mainMenu4");
                  setshowMenu2(false);
                }}
                className="flex items-center text-[14px] hover:text-gray-300"
              >
                <span className="text-2xl">🍲</span>
                {user?.orders?.length > 0 && (
                  <span className="absolute top-5 left-15 block h-5 w-5 rounded-full bg-red-500 text-white text-xs text-center">
                    {user.orders.length > 5 ? "5+" : user.orders.length}
                  </span>
                )}
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
                {awaiting > 0 && (
                  <span className="absolute top-5 left-15 block h-5 w-5 rounded-full bg-red-500 text-white text-xs text-center">
                    {awaiting > 5 ? "5+" : awaiting}
                  </span>
                )}
              </p>

              <p
                onClick={() => setActiveSection3("mainMenu6")}
                className="flex items-center text-[14px] hover:text-gray-300"
              >
                <span className="text-2xl">📜</span>
                {filteredOrdersCount > 0 && (
                  <span className="absolute top-5 left-15 block h-5 w-5 rounded-full bg-red-500 text-white text-xs text-center">
                    {filteredOrdersCount > 5 ? "5+" : filteredOrdersCount}
                  </span>
                )}
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
          <AsideSidebar user={user} setActiveSection3={setActiveSection3} />
          <>
            {activeSection3 === "mainMenu1" && (
              <MainMenu
                activeSection2={activeSection2}
                setActiveSection2={setActiveSection2}
                activeSection3={activeSection3}
                setActiveSection3={setActiveSection3}
                showCustomAlert={showCustomAlert}
              />
            )}
            {activeSection3 === "mainMenu2" && (
              <FoodsDrinks showCustomAlert={showCustomAlert} />
            )}
            {activeSection3 === "mainMenu3" && (
              <Messages showCustomAlert={showCustomAlert} />
            )}
            {activeSection3 === "mainMenu4" && (
              <Basket showCustomAlert={showCustomAlert} />
            )}
            {activeSection3 === "mainMenu5" && (
              <Product
                activeSection2={activeSection2}
                setActiveSection2={setActiveSection2}
                activeSection3={activeSection3}
                setActiveSection3={setActiveSection3}
                showCustomAlert={showCustomAlert}
              />
            )}
            {activeSection3 === "mainMenu6" && (
              <Setting showCustomAlert={showCustomAlert} />
            )}
          </>

          <AsideBasket
            formattedDate={formattedDate}
            orderItems={orderItems}
            subtotal={subtotal}
            setActiveSection3={setActiveSection3}
            isMenuVisible={isMenuVisible}
          />

          <AsideMobile
            isVisible={isVisible}
            isSmallScreen={isSmallScreen}
            user={user}
            awaiting={awaiting}
            filteredOrdersCount={filteredOrdersCount}
            setActiveSection3={setActiveSection3}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserDashboard;
