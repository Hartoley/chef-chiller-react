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
    <div className="min-w-[250px] bg-[rgb(8,22,33)] rounded-lg shadow-md p-4">
      <div className="relative" onClick={handleNavigation}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover"
        />
      </div>
      <h3 className="font-semibold text-lg mt-2 text-[#E0E0E0]">
        {product.name}
      </h3>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xl font-bold text-[#f65553]">
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
    <div className="bg-[rgb(4,14,25)] dflex items-center p-10" id="AllProduct">
      {/* Specials Section */}
      <div className="products mx-auto mb-12">
        <div className=" bg-[rgb(4,14,25)] p-0 z-10">
          <h2 className="text-4xl font-bold mb-10 text-[#E0E0E0]">Specials</h2>
        </div>
        <div className="flex space-x-4 custom-scrollbar ">
          {specialProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>

      {newProducts.length > 0 && (
        <div className=" max-w-6xl mx-auto mb-12">
          <div className=" bg-[rgb(4,14,25)] p-0 z-10">
            <h2 className="text-4xl font-bold mb-10 text-[#E0E0E0]">
              New Products
            </h2>
          </div>
          <div className="flex space-x-4 custom-scrollbar">
            {newProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProduct;
