import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import "./user.css";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import FoodsDrinks from "./FoodsDrinks";
import Messages from "./Messages";
import Basket from "./Basket";
import MainMenu from "./MainMenu";
import Product from "./Product";
import Setting from "./Setting";

const UserDashboard = () => {
  const [activeSection2, setActiveSection2] = useState("mainMenu");
  const [activeSection3, setActiveSection3] = useState("mainMenu1");
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
          return total + order.productPrice * order.quantity;
        }, 0);

        setsubtotal(subtotal);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);
  // console.log(id);

  useEffect(() => {}, [isMenuVisible]);

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

  useEffect(() => {
    fetchData();
  }, [formik.values.category]);

  return (
    <>
      <div className="mainContainer flex h-screen font-sans text-gray-800 bg-gray-100">
        <div
          style={{ position: showMore ? "fixed" : "static" }}
          className="mother flex h-screen font-sans text-gray-800 bg-gray-100"
        >
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
                  <p
                    onClick={() => setActiveSection3("mainMenu1")}
                    className="flex items-center text-[14px] hover:text-gray-300"
                  >
                    <span className="mr-3">🏠</span> Dashboard
                  </p>
                  <p
                    onClick={() => setActiveSection3("mainMenu2")}
                    className="flex items-center text-[14px] hover:text-gray-300"
                  >
                    <span className="mr-3">🍲</span> Food & Drinks
                  </p>
                  <p
                    onClick={() => setActiveSection3("mainMenu3")}
                    className="flex items-center text-[14px] hover:text-gray-300"
                  >
                    <span className="mr-3">💬</span> Messages
                  </p>
                  <p
                    onClick={() => setActiveSection3("mainMenu4")}
                    className="flex items-center text-[14px] hover:text-gray-300"
                  >
                    <span className="mr-3">💸</span> Basket
                  </p>
                  <p
                    onClick={() => setActiveSection3("mainMenu6")}
                    className="flex items-center text-[14px] hover:text-gray-300"
                  >
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
                <p
                  onClick={() => setActiveSection3("mainMenu1")}
                  className="flex items-center text-[14px] hover:text-gray-300"
                >
                  <span className="mr-3">🏠</span> Dashboard
                </p>
                <p
                  onClick={() => setActiveSection3("mainMenu2")}
                  className="flex items-center text-[14px] hover:text-gray-300"
                >
                  <span className="mr-3">🍲</span> Food & Drinks
                </p>
                <p
                  onClick={() => setActiveSection3("mainMenu3")}
                  className="flex items-center text-[14px] hover:text-gray-300"
                >
                  <span className="mr-3">💬</span> Messages
                </p>
                <p
                  onClick={() => setActiveSection3("mainMenu4")}
                  className="flex items-center text-[14px] hover:text-gray-300"
                >
                  <span className="mr-3">💸</span> Basket
                </p>
                <p
                  onClick={() => setActiveSection3("mainMenu6")}
                  className="flex items-center text-[14px] hover:text-gray-300"
                >
                  <span className="mr-3">⚙️</span> Settings
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
              <div className="text-xl font-semibold mb-6">Current Order</div>
              <div className="flex justify-between items-center mb-4 p-2">
                <span>Today</span>
                <span>🕒 {formattedDate}</span>
              </div>
              <div className="space-y-4 h-[30vh] overflow-y-auto no-scrollbar">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex gap-1 justify-between">
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

            <button
              onClick={() => setActiveSection3("mainMenu4")}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded"
            >
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

              <button
                onClick={() => setActiveSection3("mainMenu4")}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded"
              >
                Place Order
              </button>
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
