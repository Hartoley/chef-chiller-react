// src/Admin/AsideMobile.js
import React from "react";

const AsideMobile = ({
  isVisible,
  isSmallScreen,
  user,
  awaiting,
  filteredOrdersCount,
  setActiveSection3,
}) => (
  <div
    className={`sideNav4 mt-[85vh] ${isSmallScreen ? "flex" : "hidden"} ${
      isVisible ? "" : "hidden"
    } fixed w-full flex justify-center items-center`}
  >
    <nav className="flex items-center z-20 justify-evenly w-4/5 bg-transparent">
      <p
        onClick={() => setActiveSection3("mainMenu4")}
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
        onClick={() => setActiveSection3("mainMenu3")}
        className="flex items-center text-[14px] hover:text-gray-300"
      >
        <span className="text-2xl">⚙️</span>
      </p>
      <p
        onClick={() => setActiveSection3("mainMenu1")}
        className="flex items-center text-[14px] hover:text-gray-300"
      >
        <span className="text-4xl">🏠</span>
      </p>
      <p
        onClick={() => setActiveSection3("mainMenu2")}
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
);

export default AsideMobile;
