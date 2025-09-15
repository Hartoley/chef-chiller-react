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
    className={`sideNav2 sm:[22vw] w-[19.69vw]  bg-gray-900 text-white py-6 px-2 flex flex-col justify-between fixed z-10 transition-transform transform ${isMenuVisible ? "translate-x-0" : "-translate-x-full"
      } md:static md:transform-none md:translate-x-0`}
  >
    <div className="w-full h-full ">
      <div className="text-xl font-semibold mb-6 px-3">Basket</div>
      <div className="flex text-[14px] justify-between items-center flex-col sm:flex-row mb-4 p-2">
        <span>Today</span>
        <span>🕒 {formattedDate}</span>
      </div>
      <div className="space-y-4 text-[14px] h-[30vh] overflow-y-auto no-scrollbar px-3">
        {orderItems.map((item, index) => (
          <div key={index} className="flex font-white gap-1 justify-between">
            <span>{item.productName}</span>
            <span>₦{item.productPrice.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 space-y-2 px-3">
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
        className="w-[98%] mt-4 self-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
      >
        Place Order
      </button>
    </div>
  </aside>
);

export default AsideBasket;
