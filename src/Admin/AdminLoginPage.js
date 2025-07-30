import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Admin from "./Admin";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const endpoint = "https://chef-chiller-node.onrender.com";

  const signup = () => {
    navigate("/user/signup");
  };

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
          localStorage.setItem("id", JSON.stringify(id));
          setTimeout(() => {
            if (role === "Admin") {
              navigate(`/admin/dashboard/${id}`);
            } else if (role === "User") {
              navigate(`/user/dashboard/${id}`);
            }
          }, 3000);
        })
        .catch((err) => {
          toast.error(
            "Error: " + (err.response?.data?.message || "Login failed")
          );
        })
        .finally(() => setLoading(false));
    },
  });

  return (
    <>
      <Admin />
      <div className="mt-16 min-h-screen bg-gradient-to-b from-[#040e19] to-[#121a2c] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl flex flex-col lg:flex-row overflow-hidden">
          {/* Left Side - Image Section */}
          <div
            className="relative lg:w-1/2 h-[300px] lg:h-auto bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/1200x/8f/e5/9a/8fe59aaf4e99f4d69e7f602e5e948333.jpg')",
            }}
          >
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] flex flex-col items-start justify-end p-8 text-white">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug">
                Exploring new dishes, one step at a Time.
              </h2>
              <p className="mt-2 text-sm">Beyond Earth’s grasp</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <form
            onSubmit={formik.handleSubmit}
            className="lg:w-1/2 w-full px-6 py-10 flex flex-col gap-5 justify-center"
          >
            <div className="flex justify-between text-sm text-gray-500">
              <span>Don't have an account?</span>
              <span
                className="text-[#cc0f31] cursor-pointer"
                onClick={() => navigate("/user/signup")}
              >
                Sign up →
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#f65553]"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs">{formik.errors.email}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-gray-700">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#f65553]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-xs text-[#f65553]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs">
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#cc0f31] text-white py-2 rounded-lg hover:bg-opacity-90 text-sm"
            >
              {loading ? (
                loginSuccess ? (
                  <span className="text-green-500">Login Successful!</span>
                ) : (
                  "Signing in..."
                )
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginForm;
