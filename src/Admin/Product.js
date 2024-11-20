import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import "./user.css";

const Product = () => {
  const [showMore, setshowMore] = useState(false);

  const showMoreDetail = () => {
    setshowMore((prev) => !prev);
  };

  return (
    <>
      <main className="child flex-1 p-6 bg-gray-600 w-[60vw]">
        <section className="section1 flex items-center justify-between mb-6">
          <h1 onClick={showMoreDetail}>Close</h1>
        </section>
      </main>
    </>
  );
};

export default Product;
