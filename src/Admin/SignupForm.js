import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Admin from "./Admin";
import "../Admin/login.css";
import logo from "../Images/logo_chef_chiller-removebg-preview.png";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div className="w-full h-screen bg-black relative">
        <img
          className="absolute w-full h-full inset-0"
          src="https://i.pinimg.com/474x/d9/a7/67/d9a7674a942f55c1f76705d4406cac3b.jpg"
          alt=""
        />
        <div className="absolute inset-0 bg-[rgb(4,14,25)] bg-opacity-30 z-10 flex items-center justify-center ">
          <div
            className="w-full bg-black lg:w-[70%] flex items-center h-[80%] bg-[rgb(4,14,25)] bg-opacity-50"
            id="loginContainer"
          >
            <div className="w-[60%] h-full p-5 flex flex-col gap-1 " id="main2">
              <h6
                style={{
                  fontFamily: "Roboto Condensed, sans-serif",
                  fontWeight: "200",
                }}
                className="text-[#f65553]"
              >
                Your Path To A Happy Eating
              </h6>
              <div className="w-3/4 text-white text-sm " id="inputs">
                <p>Your Name</p>
                <input
                  type="text"
                  className="w-full h-[3vw] px-3 text-gray-900"
                  placeholder="Your full name"
                />
              </div>
              <div className="w-3/4 text-white text-sm" id="inputs">
                <p>Email</p>
                <input
                  type="text"
                  className="w-full h-[3vw] px-3 text-gray-900"
                  placeholder="email@gmail.com"
                />
              </div>
              <div className="w-3/4 text-white text-sm" id="inputs">
                <p>Phone Number</p>
                <input
                  type="text"
                  className="w-full h-[3vw] px-3 text-gray-900"
                  placeholder="Phone Number"
                />
              </div>
              <div className="w-3/4 text-white text-sm relative" id="inputs">
                <p>Password</p>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full h-[3vw] px-3 text-gray-900"
                  placeholder="*****"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1 text-[#f65553] hover:text-white focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <button
                className="w-3/4 h-10 border-2 border-[#f65553] text-white mt-2"
                id="inputs1"
              >
                Sign up
              </button>
            </div>
            <div
              id="images1"
              className="lg:flex w-[40%] relative inset-0 h-full"
            >
              <img
                src="https://i.pinimg.com/474x/88/f7/19/88f719e00706ba3d59c6aa1052fa96ba.jpg"
                className="w-full z-1 h-full absolute"
                alt=""
              />
              <div className="w-full absolute inset-0 flex flex-col items-center h-full text-[#f65553] justify-center z-10 bg-[rgb(4,14,25)] bg-opacity-30">
                <div className="w-full items-center justify-center flex">
                  <img
                    class="logo"
                    src="https://i.pinimg.com/236x/72/e2/84/72e284c245a1ba8817265f69ff8d65d7.jpg"
                    alt=""
                  />
                </div>
                <h5>Log in? </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupForm;
