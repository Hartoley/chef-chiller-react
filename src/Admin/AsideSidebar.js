// src/Admin/AsideSidebar.js
import React from "react";

const AsideSidebar = ({ user, setActiveSection3 }) => (
  <aside className="sideNav w-[15vw] bg-gray-900 text-white flex flex-col justify-between py-4 px-2 h-screen">
    <h1 className="text-2xl font-bold mb-8 text-center">FoodWish!</h1>

    <div className="w-full h-[80%] p-0">
      <nav className="flex w-full h-full bg-gray-900 items-start gap-2 flex-col p-1">
        <p
          onClick={() => setActiveSection3("mainMenu1")}
          className="flex items-center text-[14px] cursor-pointer hover:text-gray-300"
        >
          <span className="mr-3">🏠</span> Dashboard
        </p>
        <p
          onClick={() => setActiveSection3("mainMenu4")}
          className="flex items-center text-[14px] cursor-pointer hover:text-gray-300"
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
          className="flex items-center text-[14px] cursor-pointer hover:text-gray-300"
        >
          <span className="mr-3">⚙️</span> Messages
        </p>
        <p
          onClick={() => setActiveSection3("mainMenu2")}
          className="flex items-center text-[14px] cursor-pointer hover:text-gray-300"
        >
          <span className="mr-3">⌛</span> Awaiting
        </p>
        <p
          onClick={() => setActiveSection3("mainMenu6")}
          className="flex items-center text-[14px] cursor-pointer hover:text-gray-300"
        >
          <span className="mr-3">📜</span> History
        </p>
      </nav>
    </div>
    <footer className="text-sm h-[15%] text-gray-500 mt-8">
      <p>© 2024 FoodWish! POS</p>
      <p>Terms • Privacy</p>
    </footer>
  </aside>
);

export default AsideSidebar;
