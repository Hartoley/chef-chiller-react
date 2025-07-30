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
    <div className="min-w-[250px] sm:min-w-[280px] md:min-w-[300px] bg-[#0a1a2f] rounded-lg shadow-md p-4 flex flex-col justify-between h-[360px]">
      <div className="relative" onClick={handleNavigation}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover rounded"
        />
      </div>

      <div className="flex-1 mt-3">
        <h3 className="font-semibold text-base sm:text-lg text-[#e6ecf3] leading-tight line-clamp-2">
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
    <div className="bg-[#14263f] py-8 px-4 sm:px-2 lg:px-6" id="AllProduct">
      {/* Specials Section */}
      <section className="mb-6 lg:mb-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#e6ecf3] mb-8 sm:mb-4 text-center sm:text-left">
          Specials
        </h2>
        <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
          {specialProducts.map((product, index) => (
            <div
              key={index}
              className="min-w-[250px] sm:min-w-[280px] md:min-w-[300px] 
            transition-all duration-300 ease-in-out 
            motion-safe:hover:scale-[1.05] motion-safe:hover:-translate-y-1 
            motion-safe:hover:brightness-125 motion-safe:hover:shadow-lg 
            active:scale-90 active:brightness-90 active:shadow-inner rounded-lg"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* New Products Section */}
      {newProducts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#e6ecf3] mb-6 sm:mb-10 text-center sm:text-left">
            New Products
          </h2>
          <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
            {newProducts.map((product, index) => (
              <div
                key={index}
                className="min-w-[250px] sm:min-w-[280px] md:min-w-[300px] 
              transition-all duration-300 ease-in-out 
              motion-safe:hover:scale-[1.05] motion-safe:hover:-translate-y-1 
              motion-safe:hover:brightness-125 motion-safe:hover:shadow-lg 
              active:scale-90 active:brightness-90 active:shadow-inner rounded-lg"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AllProduct;
