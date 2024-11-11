import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";

const UserDashboard = () => {
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
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold mb-8 text-center">FoodWish!</h1>
          <nav className="space-y-4 flex flex-col items-center">
            <a
              href="#"
              className="flex items-center text-lg hover:text-gray-300"
            >
              <span className="mr-3">🏠</span> Dashboard
            </a>
            <a
              href="#"
              className="flex items-center text-lg hover:text-gray-300"
            >
              <span className="mr-3">🍲</span> Food & Drinks
            </a>
            <a
              href="#"
              className="flex items-center text-lg hover:text-gray-300"
            >
              <span className="mr-3">💬</span> Messages
            </a>
            <a
              href="#"
              className="flex items-center text-lg hover:text-gray-300"
            >
              <span className="mr-3">💸</span> Bills
            </a>
            <a
              href="#"
              className="flex items-center text-lg hover:text-gray-300"
            >
              <span className="mr-3">⚙️</span> Settings
            </a>
            <a
              href="#"
              className="flex items-center text-lg hover:text-gray-300"
            >
              <span className="mr-3">🔔</span> Notifications
            </a>
          </nav>
        </div>
        <footer className="text-sm text-gray-500 mt-8">
          <p>© 2024 FoodWish! POS</p>
          <p>Terms • Privacy</p>
        </footer>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {/* Category Selection */}
        <section className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Food & Drinks</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-800 text-white rounded-full">
              All
            </button>
            <button className="px-4 py-2 bg-gray-200 rounded-full">
              Soups
            </button>
            <button className="px-4 py-2 bg-gray-200 rounded-full">
              Salads
            </button>
            <button className="px-4 py-2 bg-gray-200 rounded-full">
              Pasta
            </button>
            <button className="px-4 py-2 bg-gray-200 rounded-full">
              Bakery Products
            </button>
          </div>
        </section>

        {/* Product Items */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Soups</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-24 w-24 object-cover rounded-full mb-2"
                />
                <h4 className="text-lg font-bold text-center">
                  {product.name}
                </h4>
                <p className="text-gray-600 text-center">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex justify-center items-center mt-2">
                  <button className="px-2 py-1 bg-gray-300 rounded">-</button>
                  <span className="mx-3 text-lg font-semibold">1</span>
                  <button className="px-2 py-1 bg-gray-300 rounded">+</button>
                </div>
              </div>
            ))}
          </div>
        </section>
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
            <button className="flex-1 bg-green-500 py-2 rounded">Cash</button>
            <button className="flex-1 bg-blue-500 py-2 rounded">Debit</button>
            <button className="flex-1 bg-purple-500 py-2 rounded">
              E-wallet
            </button>
          </div>
        </div>

        <button className="w-full mt-4 bg-primary text-white py-3 rounded">
          Place Order
        </button>
      </aside>
    </div>
  );
};

export default UserDashboard;
