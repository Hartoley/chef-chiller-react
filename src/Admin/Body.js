import React, { useEffect, useState } from "react";
import "../Admin/landing.css";
import Admin from "./Admin";
import { motion, AnimatePresence } from "framer-motion";
import img1 from "../Images/spag1-removebg-preview.png";
import img2 from "../Images/rice-removebg-preview.png";
import img3 from "../Images/swallow-removebg-preview.png";
import img4 from "../Images/asun-removebg-preview.png";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import AllProduct from "./Allproduct";

const slides = [
  {
    content: (
      <div
        className="w-[50%] h-full flex items-center flex-col justify-center text-white p-6"
        id="textComponent"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center w-3/4">
          Classic Spaghetti Delight
        </h1>
        <p className="text-sm md:text-base text-center leading-relaxed w-3/4">
          Enjoy our Classic Spaghetti Delight with al dente spaghetti in rich
          marinara sauce made from fresh tomatoes, garlic, and basil. Topped
          with Parmesan cheese and olive oil, it’s perfect with garlic bread and
          a side salad!
        </p>
        <div className="buttonLogin1">SHOP NOW</div>
      </div>
    ),
    image: img1,
  },
  {
    content: (
      <div
        className="w-[50%] h-full flex items-center flex-col justify-center text-white p-6"
        id="textComponent"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center w-3/4">
          Jollof Rice Extravaganza
        </h1>
        <p className="text-sm md:text-base text-center leading-relaxed w-3/4">
          Savor our Jollof Rice Extravaganza, a West African favorite with
          fluffy rice in a rich tomato sauce. Served with grilled chicken, beef,
          or fish, it's a vibrant taste of Nigeria!
        </p>
        <div className="buttonLogin1">SHOP NOW</div>
      </div>
    ),
    image: img2,
  },
  {
    content: (
      <div
        className="w-[50%] h-full flex items-center flex-col justify-center text-white p-6"
        id="textComponent"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center w-3/4">
          Efo Riro with Pounded Yam
        </h1>
        <p className="text-sm md:text-base text-center leading-relaxed w-3/4">
          Delight in Efo Riro with Pounded Yam, featuring rich vegetable soup
          made with fresh spinach and spices, paired with smooth, stretchy yam.
          A true celebration of Nigerian cuisine!
        </p>
        <div className="buttonLogin1">SHOP NOW</div>
      </div>
    ),
    image: img3,
  },
  {
    content: (
      <div
        className="w-[50%] h-full flex items-center flex-col justify-center text-white p-6"
        id="textComponent"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center w-3/4">
          Spicy Asun Meat
        </h1>
        <p className="text-sm md:text-base text-center leading-relaxed w-3/4">
          Savor our Spicy Asun Meat, grilled goat meat with a smoky, spicy kick.
          Perfect as a snack or appetizer, it's best enjoyed with chilled palm
          wine for an authentic street food experience!
        </p>
        <div className="buttonLogin1">SHOP NOW</div>
      </div>
    ),
    image: img4,
  },
];
const Body = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [direction, setDirection] = useState(1);

  const signin = () => {
    navigate("/user/signin");
  };

  const signup = () => {
    navigate("/user/signup");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const products = [
    { name: "Steak Deluxe", price: 12.89, oldPrice: 14.99, image: "steak.jpg" },
    { name: "Pasta Primavera", price: 12.89, image: "pasta.jpg" },
    { name: "Grilled Chicken", price: 12.89, image: "chicken.jpg" },
    { name: "Cheesy Burger", price: 12.89, image: "burger.jpg" },
    { name: "Crunchy Tenders", price: 12.89, image: "tenders.jpg" },
  ];

  const slideVariants = {
    enter: (direction) => ({
      x: direction === 1 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction === 1 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <>
      <div>
        <div id="bigBox" className="relative h-[70vh] w-full">
          <img
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="https://i.pinimg.com/236x/13/f7/ab/13f7ab894c39396151c52b4b354b1aad.jpg"
            alt="Background"
          />

          <div className="absolute inset-0 bg-[rgb(4,14,25)] bg-opacity-95 z-10 flex items-center justify-center">
            <div className="relative w-4/5 h-full rounded-lg overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  id="motion-div"
                  key={currentIndex}
                  className="absolute inset-0 w-full h-full flex"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                >
                  {slides[currentIndex].content}

                  <div
                    className="w-[50%] h-full  flex items-center justify-center"
                    id="imageBox"
                  >
                    <img
                      id="imageComponent"
                      src={slides[currentIndex].image}
                      alt={`Slide ${currentIndex + 1}`}
                      className="w-[65%] h-[90%] object-cover rounded-full shadow-md bg-white"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentIndex ? "bg-[#235126]" : "bg-gray-400"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div
            id="listFood"
            className=" top-[70vh]  overflow-hidden absolute bg-[rgb(8,21,33)] w-full flex justify-center items-center gap-10 h-[12vh]"
          >
            <motion.img
              className="w-10 transition-all duration-300 hover:scale-110 h-10"
              src={img1}
              alt=""
            />
            <motion.img
              className="w-10 transition-all duration-300 hover:scale-110 h-10"
              src={img2}
              alt=""
            />
            <motion.img
              className="w-10 transition-all duration-300 hover:scale-110 h-10"
              src={img3}
              alt=""
            />
            <motion.img
              className="w-10 transition-all duration-300 hover:scale-110 h-10"
              src={img4}
              alt=""
            />
            <motion.img
              className="w-10 transition-all duration-300 hover:scale-110 h-10"
              src={img1}
              alt=""
            />
            <motion.img
              className="w-10 transition-all duration-300 hover:scale-110 h-10"
              src={img2}
              alt=""
            />
            <motion.img
              className="w-10 transition-all duration-300 hover:scale-110 h-10"
              src={img3}
              alt=""
            />
            <motion.img
              className="w-10 transition-all duration-300 hover:scale-110 h-10"
              src={img4}
              alt=""
            />
            <motion.img
              className="w-10 transition-all duration-300 hover:scale-110 h-10"
              src={img1}
              alt=""
            />
            <motion.img
              className="w-10 transition-all duration-300 hover:scale-110 h-10"
              src={img2}
              alt=""
            />
            <motion.img
              className="w-10 transition-all duration-300 hover:scale-110 h-10"
              src={img3}
              alt=""
            />
            <motion.img
              className="w-10 transition-all duration-300 hover:scale-110 h-10"
              src={img4}
              alt=""
            />
          </div>
        </div>
        <div
          className="absolute top-[93vh] bg-[rgb(1,15,28)] w-full h-[85vh] flex items-center justify-center"
          id="miniBox"
        >
          <div className="w-full h-full relative">
            <img
              className="w-full h-full"
              src="https://i.pinimg.com/736x/6e/23/a6/6e23a6fccd6e331bb36d361b6179fbfa.jpg"
              alt=""
            />
            <div className="absolute bg-[rgb(1,15,28)] z-10 inset-0 opacity-95 flex items-center flex-col justify-center gap-10">
              <div
                id="miniBox1"
                className="bg-[rgb(5,17,31)] flex items-center gap-3 rounded-tl-[50px] rounded-br-[50px] w-[60%] h-[55%]"
              >
                <div className="w-[30%] h-full flex flex-col items-center justify-between">
                  <motion.img
                    className="w-full h-[48%] rounded-lg transition-all duration-300 hover:scale-110"
                    src="https://i.pinimg.com/236x/76/bf/c2/76bfc2b0105c43202c1e673f3387af01.jpg"
                    alt=""
                  />
                  <motion.img
                    className="w-full h-[48%] rounded-lg transition-all duration-300 hover:scale-110"
                    src="https://i.pinimg.com/236x/e5/7d/af/e57daf4d597191157b979965a4125728.jpg"
                    alt=""
                  />
                </div>
                <motion.div className="w-[25%] h-full flex flex-col items-center justify-between transition-all duration-300 ">
                  <motion.img
                    className="w-full h-[40%] rounded-lg transition-all duration-300 hover:scale-110"
                    src="https://i.pinimg.com/236x/fe/f9/94/fef9943fc227ee4fd0a78ad76e35dcbd.jpg"
                    alt=""
                  />

                  <motion.img
                    className="w-full h-[40%] rounded-lg transition-all duration-300 hover:scale-110"
                    src="https://i.pinimg.com/236x/f1/aa/8d/f1aa8d7bfe4bf9957e4a16b400b3259c.jpg"
                    alt=""
                  />
                  <div
                    className="w-full h-[15%] flex items-center gap-2"
                    id="menuIntro1"
                  >
                    <h1 className="text-[rgb(175,16,60)] font-700 text-[24px] cursor-pointer hover:text-white">
                      100%
                    </h1>
                    <p className="text-white font-400 text-[14px] cursor-pointer hover:text-[rgb(175,16,60">
                      Quality Assured
                    </p>
                  </div>
                </motion.div>
                <div
                  id="menuIntro"
                  className="w-[45%] h-full flex flex-col items-start text-white gap-0.5"
                >
                  <h1 className="text-[1.5rem] w-4/5 cursor-pointer hover:text-[rgb(175,16,60)]">
                    We always provide quality fast food for you
                  </h1>
                  <p className="text-[0.8rem] w-[90%] cursor-pointer hover:text-[rgb(175,16,60)] ">
                    Our restaurant offers exceptional service with friendly
                    staff who go above and beyond to make every visit memorable.
                    We take pride in creating a warm, welcoming atmosphere where
                    guests feel truly cared for.
                  </p>
                  <div className="w-full flex gap-3 cursor-pointer">
                    <p className="text-[rgb(175,16,60)] flex flex-col ">
                      <span class="material-symbols-outlined">flatware</span>
                      <p className="text-white text-[0.8rem]">Deli Combo</p>
                    </p>
                    <p className="text-[rgb(175,16,60)] flex flex-col ">
                      <span class="material-symbols-outlined">nutrition</span>
                      <p className="text-white text-[0.8rem]">Fresh Daily</p>
                    </p>
                    <p className="text-[rgb(175,16,60)] flex flex-col ">
                      <span class="material-symbols-outlined">
                        credit_card_heart
                      </span>
                      <p className="text-white text-[0.8rem]">Best price</p>
                    </p>
                  </div>
                </div>
              </div>
              <div
                id="coloredBox"
                className="bg-[rgb(5,17,31)] rounded-tl-[50px] flex items-center justify-evenly rounded-br-[50px] w-[60%] h-[30%]"
              >
                <div
                  className="w-[32%] rounded-lg bg-[rgb(234,1,41)] h-[90%] flex items-center p-3"
                  id="miniBox3"
                >
                  <div className="w-[50%] h-full">
                    <h1 className="text-[0.8rem] w-4/5 text-white cursor-pointer hover:text-[rgb(175,16,60)]">
                      Nigerian Jollof Special
                    </h1>
                    <p className="text-[0.8rem] text-white w-[90%] cursor-pointer hover:text-[rgb(175,16,60)] ">
                      A flavorful and spicy rice dish that’s a Nigerian
                      favorite.
                    </p>
                  </div>
                  <img className="w-[50%] h-[75%]" src={img1} alt="" />
                </div>
                <div
                  className="w-[32%] rounded-lg bg-[rgb(248,159,54)] h-[90%] flex items-center  p-3"
                  id="miniBox3"
                >
                  <div className="w-[50%] h-full">
                    <h1 className="text-[0.8rem] w-4/5 text-white cursor-pointer hover:text-[rgb(175,16,60)]">
                      Swallow Delight
                    </h1>
                    <p className="text-[0.8rem] text-white w-[95%] cursor-pointer hover:text-[rgb(175,16,60)] ">
                      Soft and satisfying, perfect for pairing with rich soups.
                    </p>
                  </div>
                  <img className="w-[50%] h-[75%]" src={img3} alt="" />
                </div>
                <div
                  id="miniBox3"
                  className="w-[32%] rounded-lg bg-[rgb(33,148,80)] h-[90%] flex items-center  p-3"
                >
                  <div className="w-[50%] h-full">
                    <h1 className="text-[0.8rem] w-4/5 text-white cursor-pointer hover:text-[rgb(175,16,60)]">
                      Spaghetti Magic
                    </h1>
                    <p className="text-[0.8rem] text-white w-[90%] cursor-pointer hover:text-[rgb(175,16,60)] ">
                      Twirls of pasta coated in savory goodness.
                    </p>
                  </div>
                  <img className="w-[50%] h-[75%]" src={img4} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Body;
