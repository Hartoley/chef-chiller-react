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
        console.log("students data from API:", res.data);
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
      <div className="body w-full h-screen bg-black relative">
        <img
          className="absolute w-full h-full inset-0"
          src="https://i.pinimg.com/474x/d9/a7/67/d9a7674a942f55c1f76705d4406cac3b.jpg"
          alt=""
        />
        <div className="absolute inset-0 bg-[rgb(4,14,25)] bg-opacity-30 z-10 flex items-center justify-center">
          <div
            className="w-full bg-black lg:w-[70%] flex items-center h-[80%] bg-[rgb(4,14,25)] bg-opacity-50"
            id="loginContainer2"
          >
            <form
              className="w-[60%] h-full px-5 py-3 flex flex-col gap-1"
              id="main2"
              onSubmit={formik.handleSubmit}
            >
              <h6
                className="text-[#f65553]"
                style={{
                  fontFamily: "Roboto Condensed, sans-serif",
                  fontWeight: "200",
                }}
              >
                Your Path To A Happy Eating
              </h6>
              <div className="w-3/4 text-white text-sm" id="inputs">
                <p>Your Name</p>
                <input
                  type="text"
                  name="username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  className="w-full h-[3vw] px-3 text-gray-900"
                  placeholder="Your full name"
                />
                {formik.touched.username && formik.errors.username ? (
                  <div className="text-red-500">{formik.errors.username}</div>
                ) : null}
              </div>
              <div className="w-3/4 text-white text-sm" id="inputs">
                <p>Email</p>
                <input
                  type="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="w-full h-[3vw] px-3 text-gray-900"
                  placeholder="email@gmail.com"
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500">{formik.errors.email}</div>
                ) : null}
              </div>
              <div className="w-3/4 text-white text-sm" id="inputs">
                <p>Phone Number</p>
                <input
                  type="text"
                  name="phoneNumber"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phoneNumber}
                  className="w-full h-[3vw] px-3 text-gray-900"
                  placeholder="Phone Number"
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                  <div className="text-red-500">
                    {formik.errors.phoneNumber}
                  </div>
                ) : null}
              </div>
              <div className="w-3/4 text-white text-sm relative" id="inputs">
                <p>Password</p>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="w-full h-[3vw] px-3 text-gray-900"
                  placeholder="*****"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1 text-[#f65553] hover:text-white focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500">{formik.errors.password}</div>
                ) : null}
              </div>
              <button
                type="submit"
                className="w-3/4 h-10 border-2 border-[#f65553] text-white mt-2"
                id="inputs1"
                disabled={loading || isRegistered}
              >
                {loading ? (
                  <span>
                    <div
                      className="spinner-border spinner-border-sm text-primary"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Signing up...
                  </span>
                ) : (
                  "Sign up"
                )}
              </button>
            </form>
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
                    className="logo rounded-full relative"
                    src="https://i.pinimg.com/236x/72/e2/84/72e284c245a1ba8817265f69ff8d65d7.jpg"
                    alt=""
                  />
                  {isRegistered ? (
                    <div className="redirect absolute !top-60 !w-[80%] h-20 flex items-center justify-center !p-5 gap-3 m-auto !bg-white ">
                      <p>Registration successful! Redirecting...</p>
                    </div>
                  ) : (
                    loading && <div></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

export default SignupForm;
