import React, { useState } from "react";
import logo from "../Images/logo_chef_chiller-removebg-preview.png";
import "../Admin/adminsidenav.css";

const AdminSideNav = () => {
  // Define states to control which section is visible
  const [activeSection, setActiveSection] = useState("product");

  return (
    <>
      <div className="mainBody w-full ">
        {/* Sidebar */}
        <nav
          id="sidenav"
          className="bg-[#040e19] z-10 rounded-tr-3xl flex flex-col px-1 py-3 items-center rounded-br-3xl w-[15%]"
        >
          {/* Logo and Name */}
          <div className="flex gap-3 mb-3 items-center justify-center w-[90%] h-[10vh]">
            <div className="h-[80%] w-[30%] flex items-center rounded-[100%] justify-center">
              <img src={logo} id="logoBg" className="h-[80%]" alt="Logo" />
            </div>
            <div className="h-[80%] flex items-center justify-center">
              <p className="text-[12px] mb-0 p-0 text-white font-medium">
                Chef Chiller
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="otherContents w-[80%] h-[80%]">
            {/* Products Button */}
            <div
              className={`w-full h-8 rounded-3xl flex justify-center items-center text-white cursor-pointer ${
                activeSection === "product" ? "bg-[#cc0f31]" : "bg-[#239551]"
              }`}
              onClick={() => setActiveSection("product")}
            >
              <p className="mb-0">Products</p>
            </div>

            {/* Orders Button */}
            <div
              className={`mt-4 w-full h-7 rounded-lg flex justify-center items-center text-white cursor-pointer ${
                activeSection === "order" ? "bg-[#cc0f31]" : "bg-[#239551]"
              }`}
              onClick={() => setActiveSection("order")}
            >
              <p className="mb-0">Orders</p>
            </div>

            {/* Notifications Button */}
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

            {/* Chats Button */}
            <div
              className={`mt-4 w-full h-7 rounded-lg flex justify-center items-center text-white cursor-pointer ${
                activeSection === "chat" ? "bg-[#cc0f31]" : "bg-[#239551]"
              }`}
              onClick={() => setActiveSection("chat")}
            >
              <p className="mb-0">Chats</p>
            </div>
          </div>

          {/* Log Out Button */}
          <div className="w-1/2 h-7 rounded-lg bg-[#fc9e34] flex justify-center items-center text-white mt-6 cursor-pointer">
            <p className="mb-0">Log out</p>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="w-[87%] h-[100vh] relative left-[13%] bg-[#A0ADB8]">
          {activeSection === "product" && (
            <div className="product w-full h-full bg-[#50606C] flex items-center justify-center text-white text-2xl">
              Product Content
            </div>
          )}
          {activeSection === "order" && (
            <div className="order w-full h-full bg-[#78828C] flex items-center justify-center text-white text-2xl">
              Order Content
            </div>
          )}
          {activeSection === "notification" && (
            <div className="notifications w-full h-full [#A0ADB8]flex items-center justify-center text-white text-2xl">
              Notification Content
            </div>
          )}
          {activeSection === "chat" && (
            <div className="chat w-full h-full bg-[#C2CDD5] flex items-center justify-center text-white text-2xl">
              Chat Content
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSideNav;
