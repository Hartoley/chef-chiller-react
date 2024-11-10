import React, { useState, useEffect } from "react";
import axios from "axios";
import "./footer.css";
// import imgPlaceholder from "../Images/placeholder.png"; // Fallback image for any missing images

const AllProduct = () => {
  const [specialProducts, setSpecialProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

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
      <div className="relative">
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
          ${product.price.toFixed(2)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-[rgb(4,14,25)] p-10" id="AllProduct">
      {/* Specials Section */}
      <div className="custom-scrollbar max-w-6xl mx-auto mb-12">
        <h2 className="text-4xl font-bold mb-6 text-[#E0E0E0]">Specials</h2>
        <div className="flex space-x-4">
          {specialProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>

      {/* New Products Section - only displayed if newProducts array is not empty */}
      {newProducts.length > 0 && (
        <div className="custom-scrollbar max-w-6xl mx-auto mb-12">
          <h2 className="text-4xl font-bold mb-6 text-[#E0E0E0]">
            New Products
          </h2>
          <div className="flex space-x-4">
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
