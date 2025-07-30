import React, { useState, useEffect } from "react";
import axios from "axios";
import "./footer.css";
import Admin from "./Admin";

// import imgPlaceholder from "../Images/placeholder.png"; // Fallback image for any missing images

const AllProduct = () => {
  const [specialProducts, setSpecialProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  const handleNavigation = () => {
    Admin.goToDash();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://chef-chiller-node.onrender.com/chefchiller/user/getproducts"
        );
        const allProducts = res.data;
        const now = new Date();

        // Filter products for new and special categories
        const special = allProducts;
        const newProds = allProducts.filter((product) => {
          const createdAt = new Date(product.createdAt);
          const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
          return hoursDiff < 48;
        });

        setSpecialProducts(special);
        setNewProducts(newProds);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchData();
  }, []);

  const ProductCard = ({ product }) => (
    <div className="min-w-[250px] sm:min-w-[280px] md:min-w-[300px] bg-[rgb(8,22,33)] rounded-lg shadow-md p-4 flex flex-col justify-between h-[360px]">
      <div className="relative" onClick={handleNavigation}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover rounded"
        />
      </div>

      <div className="flex-1 mt-3">
        <h3 className="font-semibold text-base sm:text-lg text-[#E0E0E0] leading-tight line-clamp-2">
          {product.name}
        </h3>
      </div>

      <div className="mt-4">
        <span className="text-lg sm:text-xl font-bold text-[#f65553]">
          ₦
          {product.price.toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );

  return (
    <div
      className="bg-[rgb(4,14,25)] py-12 px-4 sm:px-8 lg:px-16"
      id="AllProduct"
    >
      {/* Specials Section */}
      <section className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#E0E0E0] mb-6 sm:mb-10 text-center sm:text-left">
          Specials
        </h2>
        <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
          {specialProducts.map((product, index) => (
            <div className="min-w-[250px] sm:min-w-[280px] md:min-w-[300px]">
              <ProductCard key={index} product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* New Products Section */}
      {newProducts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#E0E0E0] mb-6 sm:mb-10 text-center sm:text-left">
            New Products
          </h2>
          <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
            {newProducts.map((product, index) => (
              <div className="min-w-[250px] sm:min-w-[280px] md:min-w-[300px]">
                <ProductCard key={index} product={product} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AllProduct;
