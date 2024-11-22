import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import "./user.css";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";

const Setting = () => {
  return (
    <>
      <main className="child flex-1 p-6 bg-gray-400 w-[63.65vw]">
        <section className="section1 flex items-center justify-between mb-6"></section>
      </main>
    </>
  );
};

export default Setting;
