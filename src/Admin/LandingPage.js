import React, { useEffect, useState } from "react";
import "../Admin/landing.css";
import Admin from "./Admin";
import { motion, AnimatePresence } from "framer-motion";
import img1 from "../Images/spag1-removebg-preview.png";
import img2 from "../Images/rice-removebg-preview.png";
import img3 from "../Images/swallow-removebg-preview.png";
import img4 from "../Images/asun-removebg-preview.png";
import img5 from "../Images/jollofSpecial.jpg";
import img6 from "../Images/spaghettiNew.png";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import AllProduct from "./Allproduct";
import ReviewSection from "./Review";

const slides = [
  {
    title: "Classic Spaghetti Delight",
    description:
      "Enjoy our Classic Spaghetti Delight with al dente spaghetti in rich marinara sauce made from fresh tomatoes, garlic, and basil. Topped with Parmesan cheese and olive oil.",
    image: img1,
  },
  {
    title: "Jollof Rice Extravaganza",
    description:
      "Savor our Jollof Rice Extravaganza, a West African favorite with fluffy rice in a rich tomato sauce. Served with grilled chicken, beef, or fish, it's a vibrant taste of Nigeria!",
    image: img2,
  },
  {
    title: "Efo Riro with Pounded Yam",
    description:
      "Delight in Efo Riro with Pounded Yam, featuring rich vegetable soup made with fresh spinach and spices, paired with smooth, stretchy yam.",
    image: img3,
  },
  {
    title: "Spicy Asun Meat",
    description:
      "Savor our Spicy Asun Meat, grilled goat meat with a smoky, spicy kick. Perfect as a snack or appetizer, it's best enjoyed with chilled palm wine for an authentic street food experience!",
    image: img4,
  },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

const LandingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const signin = () => {
    navigate("/user/signin");
  };

  const signup = () => {
    navigate("/user/signup");
  };

  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Admin signin={signin} signup={signup} />

      <div className="mt-[12vh]">
        <div className="relative w-full h-[62vh] lg:h-[88vh] overflow-hidden">
          {/* Background Image */}
          <img
            src="https://i.pinimg.com/736x/a6/a8/2c/a6a82cf20d2fb7cae922836a9ad79ff6.jpg"
            alt="background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(4,14,25,0.95)]"></div>

          {/* Slides */}
          <div className="relative z-10 flex items-center justify-center h-full w-full overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 1.2 }}
                className="flex flex-col md:flex-row items-center justify-center gap-10 px-4 w-full max-w-6xl absolute"
              >
                <div className="flex-shrink-0 w-60 h-60 md:w-80 md:h-80 rounded-full overflow-hidden shadow-lg border-4 border-white bg-white flex items-center justify-center">
                  <img
                    src={slides[currentIndex].image}
                    alt={slides[currentIndex].title}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="text-center md:text-left text-white max-w-lg">
                  <h1 className="text-2xl md:text-4xl font-bold mb-4">
                    {slides[currentIndex].title}
                  </h1>
                  <p className="text-sm md:text-base mb-6">
                    {slides[currentIndex].description}
                  </p>
                  <button className="bg-[#FC9E34] text-white px-4 py-2 rounded hover:bg-orange-500 transition">
                    SHOP NOW
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 z-20"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 z-20"
          >
            ❯
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 w-full flex justify-center gap-2 z-20">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? "bg-[#FC9E34]" : "bg-gray-400"
                }`}
              ></div>
            ))}
          </div>
        </div>
        {/* Bottom thumbnail images */}
        <div
          id="listFood"
          className="bg-[rgb(8,21,33)] w-full flex justify-center items-center h-[12vh]"
        >
          <div className=" overflow-x-scroll no-scrollbar lg:w-[60%] w-[95%] flex justify-center items-center gap-6 h-full px-4">
            {[img1, img2, img3, img4, img1, img2, img3, img4].map((src, i) => (
              <motion.img
                key={i}
                src={src}
                alt={`thumb-${i}`}
                className="w-10 h-10 md:w-12 md:h-12 border border-white rounded-full bg-white flex-shrink-0 hover:scale-110 transition-all duration-300"
              />
            ))}
          </div>
        </div>

        {/* Products & Footer */}
        <AllProduct />
        <ReviewSection />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
