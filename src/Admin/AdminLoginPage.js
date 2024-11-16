import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "../Admin/login.css";
import Admin from "./Admin";
import Footer from "./Footer";
import { useParams } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const signin = () => {
    navigate("/user/signin");
  };

  const endpoint = "https://chef-chiller-node.onrender.com";

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      password: yup
        .string()
        .min(5, "Password must be at least 5 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      axios
        .post(`${endpoint}/user/login`, values)
        .then((res) => {
          toast.success("Successfully signed in!");

          const { role, id } = res.data;

          setLoginSuccess(true);
          setTimeout(() => {
            if (role === "Admin") {
              navigate(`/admin/dashboard/${id}`);
            } else if (role === "User") {
              navigate(`/user/dashboard/${id}`);
            }
          }, 5000);
        })
        .catch((err) => {
          toast.error(
            "Error: " + (err.response?.data?.message || "Login failed")
          );
        })
        .finally(() => setLoading(false));
    },
  });

  const signup = () => {
    navigate("/user/signup");
  };

  return (
    <>
      <Admin signin={signin} signup={signup} />
      <div className="body w-full h-screen bg-black relative">
        <img
          className="absolute w-full h-full inset-0"
          src="https://i.pinimg.com/474x/88/50/ea/8850ea685cf18e8ad48758a6164269a1.jpg"
          alt=""
        />
        <div className="absolute inset-0 bg-[rgb(4,14,25)] bg-opacity-30 z-10 flex items-center justify-center">
          <div
            className="w-full bg-black lg:w-[60%] flex items-center h-[60%] rounded-lg bg-[rgb(4,14,25)] bg-opacity-50"
            id="loginContainer"
          >
            <div
              id="images1"
              className="lg:flex w-[55%] relative inset-0 h-full rounded-l-lg"
            >
              <img
                src="https://i.pinimg.com/474x/20/0e/12/200e124b9116fff354ec08cc2b5317b0.jpg"
                className="w-full z-1 h-full absolute rounded-l-lg"
                alt=""
              />
              <div className="w-full absolute inset-0 flex flex-col items-center h-full text-[#f65553] justify-center z-10 bg-[rgb(4,14,25)] bg-opacity-30">
                <div className="w-full items-center justify-center flex">
                  <img
                    className="logo"
                    src="https://i.pinimg.com/236x/72/e2/84/72e284c245a1ba8817265f69ff8d65d7.jpg"
                    alt=""
                  />
                </div>

                <h5 className="cursor-pointer mt-5 text-white" onClick={signup}>
                  Sign up?{" "}
                </h5>
              </div>
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="w-[45%] h-full p-5 flex flex-col gap-1"
              id="main2"
            >
              <h6
                style={{
                  fontFamily: "Roboto Condensed, sans-serif",
                  fontWeight: "200",
                }}
                className="text-[#f65553]"
              >
                Your Path To A Happy Eating
              </h6>

              <div className="w-8/9 text-white text-sm" id="inputs">
                <p>Email</p>
                <input
                  type="text"
                  className="w-full h-[3vw] px-3 text-gray-900"
                  placeholder="email@gmail.com"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs">{formik.errors.email}</p>
                )}
              </div>

              <div className="w-8/9 text-white text-sm relative" id="inputs">
                <p>Password</p>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full h-[3vw] px-3 text-gray-900"
                  placeholder="*****"
                  {...formik.getFieldProps("password")}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1 text-[#f65553] hover:text-white focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-8/9 h-10 border-2 border-[#f65553] text-white mt-2"
                id="inputs1"
                disabled={loading}
              >
                {loading ? (
                  loginSuccess ? (
                    <div className="text-green-500">Login Successful!</div>
                  ) : (
                    <span>
                      <div
                        className="spinner-border spinner-border-sm text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Signing in...
                    </span>
                  )
                ) : (
                  "Sign In"
                )}
              </button>
              {/* <img
                className="logoSm"
                src="https://i.pinimg.com/236x/72/e2/84/72e284c245a1ba8817265f69ff8d65d7.jpg"
                alt=""
              /> */}
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </>
  );
};

export default LoginForm;
