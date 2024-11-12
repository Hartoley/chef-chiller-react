import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import "./user.css";

const UserDashboard = () => {
  const [activeSection2, setActiveSection2] = useState("mainMenu");
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([
    { name: "Ukrainian borscht", price: 5.0 },
    { name: "Poke with salmon", price: 6.0 },
  ]);

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

  return (
    <div className="flex h-screen font-sans text-gray-800 bg-gray-100">
      <aside className="w-[15vw] bg-gray-900 text-white flex flex-col justify-between py-4 px-2">
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
        <section className="flex items-center justify-between mb-6">
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
              Side dishes
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
            <section className="flex w-full flex-col">
              <h3 className="text-xl font-semibold mb-1">Top Menu</h3>
              <div className="py-4 h-[45vh] flex items-center overflow-y-auto gap-4 no-scrollbar">
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
                      className="w-[40%] h-full object-cover "
                    />
                    <div className="flex h-full  w-[60%] flex-col items-start ">
                      <h4 className="text-lg font-bold">{product.name}</h4>
                      <p className="text-gray-600 text-center">
                        ₦{product.price.toFixed(2)}
                      </p>
                      <div className="flex justify-center items-center mt-2">
                        <button className="px-2 py-1 bg-gray-300 rounded">
                          -
                        </button>
                        <span className="mx-3 text-lg font-semibold">1</span>
                        <button className="px-2 py-1 bg-gray-300 rounded">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="flex w-full flex-col">
              <h3 className="text-xl font-semibold mb-1">Main Course</h3>
              <div className="py-4 h-[45vh] flex items-center overflow-y-auto gap-4 no-scrollbar">
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
                      <div className="flex h-full w-[60%] flex-col items-start">
                        <h4 className="text-lg font-bold">{product.name}</h4>
                        <p className="text-gray-600 text-center">
                          ₦{product.price.toFixed(2)}
                        </p>
                        <div className="flex justify-center items-center mt-2">
                          <button className="px-2 py-1 bg-gray-300 rounded">
                            -
                          </button>
                          <span className="mx-3 text-lg font-semibold">1</span>
                          <button className="px-2 py-1 bg-gray-300 rounded">
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
            <section className="flex w-[60vw] flex-col">
              <h3 className="text-xl font-semibold mb-1">New Menu</h3>
              <div className="py-4 h-[45vh] flex items-center overflow-y-auto gap-4 no-scrollbar">
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
                      <div className="flex h-full w-[60%] flex-col items-start">
                        <h4 className="text-lg font-bold">{product.name}</h4>
                        <p className="text-gray-600 text-center">
                          ₦{product.price.toFixed(2)}
                        </p>
                        <div className="flex justify-center items-center mt-2">
                          <button className="px-2 py-1 bg-gray-300 rounded">
                            -
                          </button>
                          <span className="mx-3 text-lg font-semibold">1</span>
                          <button className="px-2 py-1 bg-gray-300 rounded">
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
            <section className="flex w-full h-full flex-col">
              <h3 className="text-xl font-semibold mb-1">New Menu</h3>
              <div className="py-4 h-[97%] w-full flex flex-wrap overflow-x-auto gap-4 no-scrollbar">
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
                        height: "70%",
                        gap: "2vw",
                        width: "47%",
                      }}
                      className="flex-shrink-0 py-4 px-2 w-[60vw] rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
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
                          <button className="px-2 py-1 bg-gray-300 rounded">
                            -
                          </button>
                          <span className="mx-3 text-lg font-semibold">1</span>
                          <button className="px-2 py-1 bg-gray-300 rounded">
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
              <h3 className="text-xl font-semibold mb-1">New Menu</h3>
              <div className="py-4 h-[97%] w-full flex flex-wrap overflow-x-auto gap-4 no-scrollbar">
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
                        height: "70%",
                        gap: "2vw",
                        width: "47%",
                      }}
                      className="lex-shrink-0 py-4 px-2 w-[60vw] rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
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
                          <button className="px-2 py-1 bg-gray-300 rounded">
                            -
                          </button>
                          <span className="mx-3 text-lg font-semibold">1</span>
                          <button className="px-2 py-1 bg-gray-300 rounded">
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
              <h3 className="text-xl font-semibold mb-1">New Menu</h3>
              <div className="py-4 h-[97%] w-full flex flex-wrap overflow-x-auto gap-4 no-scrollbar">
                {products
                  .filter(
                    (product) => product.category.toLowerCase() === "beverages"
                  ) // Filter for 'Main Course' category
                  .map((product, index) => (
                    <div
                      key={index}
                      style={{
                        // backgroundColor: "rgb(204, 15, 49)",
                        height: "70%",
                        gap: "2vw",
                        width: "47%",
                      }}
                      className="foodBox flex-shrink-0 py-4 px-2 w-[60vw] rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
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
                          <button className="px-2 py-1 bg-gray-300 rounded">
                            -
                          </button>
                          <span className="mx-3 text-lg font-semibold">1</span>
                          <button className="px-2 py-1 bg-gray-300 rounded">
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
              <h3 className="text-xl font-semibold mb-1">New Menu</h3>
              <div className="py-4 h-[97%] w-full flex flex-wrap overflow-x-auto gap-4 no-scrollbar">
                {products
                  .filter(
                    (product) => product.category.toLowerCase() === "snacks"
                  ) // Filter for 'Main Course' category
                  .map((product, index) => (
                    <div
                      key={index}
                      style={{
                        // backgroundColor: "rgb(204, 15, 49)",
                        height: "70%",
                        gap: "2vw",
                        width: "47%",
                      }}
                      className=" flex-shrink-0 py-4 px-2 w-[60vw] rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
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
                          <button className="px-2 py-1 bg-gray-300 rounded">
                            -
                          </button>
                          <span className="mx-3 text-lg font-semibold">1</span>
                          <button className="px-2 py-1 bg-gray-300 rounded">
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

      {/* Order Sidebar */}
      <aside className="w-80 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <div className="text-xl font-semibold mb-6">Current Order</div>
          <div className="flex justify-between items-center mb-4">
            <span>Table 5</span>
            <span>🕒 10.30.2022</span>
          </div>
          <div className="space-y-4">
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 mt-6 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span>$10.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tax</span>
              <span>$1.00</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>$11.00</span>
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
    </div>
  );
};

export default UserDashboard;
