// src/Admin/AsideBasket.js
import React from "react";

const AsideBasket = ({
  formattedDate,
  orderItems,
  subtotal,
  setActiveSection3,
  isMenuVisible,
}) => (
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
        {orderItems.map((item, index) => (
          <div key={index} className="flex font-white gap-1 justify-between">
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

      <button
        onClick={() => setActiveSection3("mainMenu4")}
        className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded"
      >
        Place Order
      </button>
    </div>
  </aside>
);

export default AsideBasket;
