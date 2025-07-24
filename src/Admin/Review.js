import React from "react";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Amaka Johnson",
    text: "The food was delicious and arrived hot. Great service!",
    image:
      "https://i.pinimg.com/236x/76/bf/c2/76bfc2b0105c43202c1e673f3387af01.jpg",
  },
  {
    name: "Emeka Obi",
    text: "Best jollof rice I've had in a while. Highly recommend.",
    image:
      "https://i.pinimg.com/236x/e5/7d/af/e57daf4d597191157b979965a4125728.jpg",
  },
  {
    name: "Aisha Bello",
    text: "Quick delivery and very friendly delivery guy.",
    image:
      "https://i.pinimg.com/236x/fe/f9/94/fef9943fc227ee4fd0a78ad76e35dcbd.jpg",
  },
  {
    name: "Chinedu Nwachukwu",
    text: "Loved the spicy asun meat. Will order again soon!",
    image:
      "https://i.pinimg.com/236x/f1/aa/8d/f1aa8d7bfe4bf9957e4a16b400b3259c.jpg",
  },
  {
    name: "Ngozi Okafor",
    text: "Their swallow and efo riro combo is divine.",
    image:
      "https://i.pinimg.com/236x/13/f7/ab/13f7ab894c39396151c52b4b354b1aad.jpg",
  },
  {
    name: "Kehinde Ade",
    text: "Affordable and tasty meals. My kids loved it too.",
    image:
      "https://i.pinimg.com/236x/6e/23/a6/6e23a6fccd6e331bb36d361b6179fbfa.jpg",
  },
  {
    name: "Seyi Daniel",
    text: "Customer service was prompt and helpful.",
    image:
      "https://i.pinimg.com/236x/76/bf/c2/76bfc2b0105c43202c1e673f3387af01.jpg",
  },
  {
    name: "Fatima Musa",
    text: "The packaging was neat and classy.",
    image:
      "https://i.pinimg.com/236x/e5/7d/af/e57daf4d597191157b979965a4125728.jpg",
  },
  {
    name: "Ifeanyi Okechukwu",
    text: "I always order their spaghetti magic. So good!",
    image:
      "https://i.pinimg.com/236x/fe/f9/94/fef9943fc227ee4fd0a78ad76e35dcbd.jpg",
  },
  {
    name: "Bukola George",
    text: "Loved the variety on the menu and the taste was amazing.",
    image:
      "https://i.pinimg.com/236x/f1/aa/8d/f1aa8d7bfe4bf9957e4a16b400b3259c.jpg",
  },
];

const ReviewSection = () => {
  return (
    <div className="min-h-screen bg-[rgb(8,21,33)] py-12 px-4 md:px-12 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
        What Our Customers Say
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            className="bg-[rgb(5,17,31)] rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={review.image}
              alt={review.name}
              className="w-20 h-20 rounded-full border-2 border-[#FC9E34] object-cover mb-4"
            />
            <h3 className="text-lg font-semibold text-[#FC9E34] mb-2">
              {review.name}
            </h3>
            <p className="text-white text-sm">{review.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
