import React, { useState } from "react";
import { motion } from "framer-motion";
import "./footer.css";
import img1 from "../Images/spag1-removebg-preview.png";
import img2 from "../Images/rice-removebg-preview.png";

const specialProducts = [
  { name: "Ribeye Supreme", price: 12.89, oldPrice: 14.99, image: img1 },
  { name: "Herbed Pasta", price: 12.89, image: img1 },
  { name: "Salmon Delight", price: 13.89, image: img1 },
  { name: "Loaded Fries", price: 14.89, image: img1 },
  { name: "Loaded Fries", price: 14.89, image: img1 },
  { name: "Loaded Fries", price: 14.89, image: img1 },
  { name: "Loaded Fries", price: 14.89, image: img1 },
];

const newProducts = [
  { name: "Cheesy Burger", price: 12.89, image: img2 },
  { name: "Chicken Wrap", price: 12.89, image: img2 },
  { name: "Grilled Chicken", price: 12.89, image: img2 },
  { name: "Pasta Primavera", price: 12.89, image: img2 },
  { name: "Veggie Bowl", price: 11.89, image: img2 },
  { name: "Spicy Tacos", price: 10.99, image: img2 },
];

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const AllProduct = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideWidth = 270;

  const handlePrev = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentSlide((prev) => Math.min(prev + 1, specialProducts.length - 3));

  const [currentNewSlide, setCurrentNewSlide] = useState(0);

  const handlePrevNew = () =>
    setCurrentNewSlide((prev) => Math.max(prev - 1, 0));
  const handleNextNew = () =>
    setCurrentNewSlide((prev) => Math.min(prev + 1, newProducts.length - 3));

  return (
    <div className="bg-[rgb(4,14,25)] p-10" id="AllProduct">
      {/* Specials Section */}
      <div className="custom-scrollbar max-w-6xl mx-auto mb-12 ">
        <h2 className="text-4xl font-bold mb-6 text-[#E0E0E0]">Specials</h2>
        <div className="relative">
          <div className="flex space-x-4">
            {specialProducts.map((product, index) => (
              <div
                key={index}
                className="min-w-[250px] bg-[rgb(8,22,33)] rounded-lg shadow-md p-4"
              >
                <div className="relative">
                  <span className="absolute top-2 left-2 bg-[#f65553] text-white text-sm px-2 py-1 rounded">
                    Special
                  </span>
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
                  {product.oldPrice && (
                    <span className="text-sm line-through text-gray-400">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Products Section */}
      <div className="custom-scrollbar max-w-6xl mx-auto mb-12 ">
        <h2 className="text-4xl font-bold mb-6 text-[#E0E0E0]">New Products</h2>
        <div className="relative">
          <div className="flex space-x-4 ">
            {newProducts.map((product, index) => (
              <div
                key={index}
                className="min-w-[250px] bg-[rgb(8,22,33)] rounded-lg shadow-md p-4"
              >
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProduct;
