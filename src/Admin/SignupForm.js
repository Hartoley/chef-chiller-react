import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "../Admin/login.css";
import logo from "../Images/logo_chef_chiller-removebg-preview.png";
import Admin from "./Admin";
import emailjs from "emailjs-com";
import Footer from "./Footer";

const SignupForm = () => {
  const endpoint = "https://chef-chiller-node.onrender.com";
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // New state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${endpoint}/user/getdata`);
        setStudents(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const signin = () => {
    navigate("/user/signin");
  };

  const signup = () => {
    navigate("/user/signup");
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      phoneNumber: Yup.string().required("Required"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      console.log("Form submitted:", values);
      setLoading(true);

      const existingStudent = students.find(
        (exist) =>
          exist.email === values.email || exist.password === values.password
      );

      if (existingStudent) {
        setLoading(false);
        toast.error("User already exists");
      } else {
        try {
          await axios.post(`${endpoint}/user/register`, values);
          // emailjs
          //   .send(
          //     "service_ajs5z5i",
          //     "template_odtyl1i",
          //     {
          //       username: values.username,
          //       email: values.email,
          //     },
          //     "X1hB4dMgGEMc9dG8x"
          //   )
          //   .then(
          //     (result) => {
          //       console.log("Email sent successfully:", result.text);
          //       toast.success("Email sent successfully");
          //     },
          //     (error) => {
          //       console.error("Email sending failed:", error.text);
          //       toast.error("Failed to send email");
          //     }
          //   );
          toast.success("User signed up successfully");
          setIsRegistered(true);
          setTimeout(() => {
            navigate("/user/signin");
          }, 3000);
        } catch (error) {
          console.log(error);
          toast.error(error?.response?.data?.message);
        } finally {
          setLoading(false);
        }
      }

      formik.resetForm();
    },
  });

  return (
    <>
      <Admin signin={signin} signup={signup} />
      <div className="md:mt-16 mt-20 min-h-screen bg-gradient-to-b from-[#040e19] to-[#121a2c] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl flex flex-col lg:flex-row overflow-hidden">
          {/* Left Side - Astro Image Card */}
          <div
            className="relative lg:w-1/2 h-[300px] lg:h-auto bg-cover bg-center"
            style={{
              backgroundImage: `url('https://i.pinimg.com/1200x/8f/e5/9a/8fe59aaf4e99f4d69e7f602e5e948333.jpg')`,
            }}
          >
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] flex flex-col items-start justify-end p-8 text-white">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug">
                Exploring new dishes, one step at a Time.
              </h2>
              <p className="mt-2 text-sm">Beyond Earth’s grasp</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <form
            onSubmit={formik.handleSubmit}
            className="lg:w-1/2 w-full px-6 py-10 flex flex-col gap-5 justify-center"
          >
            <div className="flex justify-between text-sm text-gray-500">
              <span>Already a member?</span>
              <span className="text-[#cc0f31] cursor-pointer" onClick={signin}>
                Sign in →
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>

            {/* Social Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                className="w-full bg-[#cc0f31] text-white py-2 rounded-lg text-sm shadow"
              >
                Sign up with Google
              </button>
              <button
                type="button"
                className="w-full bg-[#111827] text-white py-2 rounded-lg text-sm shadow"
              >
                Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="text-center text-gray-400 text-xs">
              or using email and password
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#f65553]"
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="text-red-500 text-xs">
                    {formik.errors.username}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700">
                  Email or Phone no.
                </label>
                <input
                  type="text"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#f65553]"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-[#cc0f31] text-xs">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  name="phoneNumber"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phoneNumber}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#f65553]"
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <p className="text-[#cc0f31] text-xs">
                    {formik.errors.phoneNumber}
                  </p>
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

            <label className="text-sm flex items-start gap-2">
              <input type="checkbox" required />I agree to the{" "}
              <span className="underline">terms and privacy policy</span>
            </label>

            <button
              type="submit"
              disabled={loading || isRegistered}
              className="bg-[#cc0f31] text-white py-2 rounded-lg hover:bg-opacity-90 text-sm"
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>

            {isRegistered && (
              <p className="text-green-600 text-center text-sm">
                Registration successful! Redirecting...
              </p>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignupForm;
