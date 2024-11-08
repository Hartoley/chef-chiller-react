import React, { useState } from "react";
import logo from "../Images/logo_chef_chiller-removebg-preview.png";
import "../Admin/adminsidenav.css";

const AdminSideNav = () => {
  const [activeSection, setActiveSection] = useState("product");
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
  };

  return (
    <>
      <div className="mainBody w-full">
        <div className="buttonBox2">
          <span onClick={toggleMenu} className="material-symbols-outlined">
            menu
          </span>
        </div>
        <nav
          id="sidenav"
          className={`bg-[#040e19] z-10 rounded-tr-3xl flex flex-col px-1 py-3 items-center rounded-br-3xl w-[15%] ${
            isMenuVisible ? "visibleNav" : ""
          }`}
        >
          <div className="flex gap-3 mb-3 items-center w-[90%] h-[10vh]">
            <div className="buttonBox2">
              <span onClick={toggleMenu} className="material-symbols-outlined">
                menu
              </span>
            </div>
            <div className="h-[80%] w-[30%] flex items-center rounded-full justify-center">
              <img src={logo} id="logoBg" className="h-[80%]" alt="Logo" />
            </div>
            <div className="chef h-[80%] flex items-center justify-center">
              <p className="text-[12px] mb-0 w-full flex items-center p-0 text-white font-medium">
                Chef Chiller
              </p>
            </div>
          </div>

          <div className="otherContents w-full h-[80%]">
            <div
              className={`w-full h-8 rounded-3xl flex justify-center items-center text-white cursor-pointer ${
                activeSection === "product" ? "bg-[#cc0f31]" : "bg-[#239551]"
              }`}
              onClick={() => setActiveSection("product")}
            >
              <p className="mb-0">Products</p>
            </div>
            <div
              className={`mt-4 w-full h-7 rounded-lg flex justify-center items-center text-white cursor-pointer ${
                activeSection === "order" ? "bg-[#cc0f31]" : "bg-[#239551]"
              }`}
              onClick={() => setActiveSection("order")}
            >
              <p className="mb-0">Orders</p>
            </div>
            <div
              className={`mt-4 w-full h-7 rounded-lg flex justify-center items-center text-white cursor-pointer ${
                activeSection === "notification"
                  ? "bg-[#cc0f31]"
                  : "bg-[#239551]"
              }`}
              onClick={() => setActiveSection("notification")}
            >
              <p className="mb-0">Notifications</p>
            </div>
            <div
              className={`mt-4 w-full h-7 rounded-lg flex justify-center items-center text-white cursor-pointer ${
                activeSection === "chat" ? "bg-[#cc0f31]" : "bg-[#239551]"
              }`}
              onClick={() => setActiveSection("chat")}
            >
              <p className="mb-0">Chats</p>
            </div>
          </div>

          <div className="w-1/2 h-7 rounded-lg bg-[#fc9e34] flex justify-center items-center text-white mt-6 cursor-pointer">
            <p className="mb-0">Log out</p>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="contentArea w-[87%] h-[100vh] relative left-[13%] bg-[#040e19] pl-7 p-4 ">
          {activeSection === "product" && (
            <div className="product w-full h-full bg-[#50606C] rounded-lg flex items-center justify-center text-white text-2xl">
              Product Content
            </div>
          )}
          {activeSection === "order" && (
            <div className="order w-full h-full rounded-lg ml-auto mr-auto h-full flex flex-col bg-[#F7F9FA] rounded-lg p-4 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order List
              </h2>

              <div className="w-full h-[60%] gap-4 flex flex-col overflow-y-auto">
                {/* Example Task Item */}
                <div className="task-item w-full bg-white p-4 mb-4 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Task #00350</p>
                    <p className="text-lg font-semibold text-gray-800">
                      €120.21
                    </p>
                  </div>
                  <button className="text-white bg-[#ff7a00] py-1 px-3 rounded-full">
                    Accept Order
                  </button>
                </div>

                {/* Repeat Task Item */}
                <div className="task-item w-full bg-white p-4 mb-4 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Task #00349</p>
                    <p className="text-lg font-semibold text-gray-800">
                      €99.60
                    </p>
                  </div>
                  <button className="text-white bg-[#ff7a00] py-1 px-3 rounded-full">
                    Accept Order
                  </button>
                </div>

                {/* Additional Task Items */}
                {/* Repeat Task Item */}
                <div className="task-item w-full bg-white p-4 mb-4 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Task #00349</p>
                    <p className="text-lg font-semibold text-gray-800">
                      €99.60
                    </p>
                  </div>
                  <button className="text-white bg-[#ff7a00] py-1 px-3 rounded-full">
                    Accept Order
                  </button>
                </div>
              </div>

              {/* Additional Content */}
              <div className="flex justify-between mt-8">
                <div className="bg-[#ccedf4] p-3 rounded-lg w-1/2 mr-4 text-center">
                  <h3 className="font-bold text-gray-800">Preparing Info</h3>
                  <p className="text-gray-700">Order starts in: 00:25:30</p>
                </div>
                <div className="bg-[#ccedf4] p-3 rounded-lg w-1/2 text-center">
                  <h3 className="font-bold text-gray-800">Delivery Address</h3>
                  <p className="text-gray-700">Lincoln Street 45</p>
                </div>
              </div>
            </div>
          )}
          {activeSection === "notification" && (
            <div className="notifications w-full h-full rounded-lg bg-[#A0ADB8] flex items-center justify-center text-white text-2xl">
              Notification Content
            </div>
          )}
          {activeSection === "chat" && (
            <div className="chat w-full h-full rounded-lg bg-[#C2CDD5] flex items-center justify-center text-white text-2xl">
              Chat Content
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSideNav;
