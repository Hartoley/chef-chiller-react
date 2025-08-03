import React from "react";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Chidera Okeke",
    role: "University Student",
    text: "Chef Keena's meals are my lifesaver. Between classes, I barely have time to cook, but her jollof rice and grilled chicken always taste like homemade food. I feel nourished and the delivery is always fast, even during exam weeks!",
    image:
      "https://i.pinimg.com/736x/d2/20/82/d22082224e5442d247b98f8273f7d58f.jpg",
  },
  {
    name: "Adeola Adebayo",
    role: "Working Mom",
    text: "As a busy mom, I struggle with cooking after work. Chef Keena makes it easy for my family to enjoy healthy, fresh meals without stress. My kids especially love the spaghetti magic. Thank you for making dinner times peaceful again.",
    image:
      "https://i.pinimg.com/1200x/c2/08/85/c208855ba6c5f61109859c8ae31c3494.jpg",
  },
  {
    name: "Ibrahim Musa",
    role: "Software Developer",
    text: "Ordering lunch from Chef Keena has become part of my daily routine. The packaging is neat, and I love how the meals still arrive hot. Her swallow dishes with efo riro are my personal favourite after long coding sessions.",
    image:
      "https://i.pinimg.com/1200x/61/45/9f/61459f4690a8f6d6e58ee2bdc60e8948.jpg",
  },
  {
    name: "Ngozi Chukwu",
    role: "Interior Designer",
    text: "The attention to detail in her meals is just like her designs! Everything tastes fresh, spicy in the best way, and beautifully presented. Chef Keena truly brings restaurant quality to your doorstep.",
    image:
      "https://i.pinimg.com/736x/39/98/d1/3998d1186c5106dd97c2a23d9f262c85.jpg",
  },
  {
    name: "Samuel Eze",
    role: "Banker",
    text: "After a long day in the bank, Chef Keena’s spicy asun meat with jollof rice is my comfort meal. Her team delivers exactly on time every time. Great service and unbeatable taste!",
    image:
      "https://i.pinimg.com/736x/9c/13/35/9c1335f62704625a72ab1df142c13f7d.jpg",
  },
  {
    name: "Fatima Bello",
    role: "Event Planner",
    text: "I ordered from Chef Keena for a small bridal shower and everyone raved about the meals. The swallow, rice dishes, and especially the peppered fish were crowd favourites. Thank you for making the day special with your food.",
    image:
      "https://i.pinimg.com/736x/87/75/11/877511f85b46a2a5c66f302d4fa74fbf.jpg",
  },
  {
    name: "Kehinde Alabi",
    role: "Fitness Trainer",
    text: "I recommend Chef Keena’s meals to my clients who want healthy but tasty Nigerian meals. Her grilled fish with steamed vegetables is perfectly balanced and always fresh.",
    image:
      "https://img.fantaskycdn.com/dacc83e02048530c297280fdee12c5a9_1024x.webp",
  },
  {
    name: "Blessing Ojo",
    role: "Customer",
    text: "I’ve tried different food delivery services but none compare to Chef Keena’s unique flavours. The spices taste authentic, and I love the little touches like fresh basil sprinkled on the spaghetti.",
    image:
      "https://i.pinimg.com/736x/c4/ef/5b/c4ef5bcb212a729c202fc44756173e6c.jpg",
  },
  {
    name: "Emeka Nwosu",
    role: "Entrepreneur",
    text: "Sometimes I work till midnight, and knowing Chef Keena can still deliver hot, delicious food is a blessing. Her goat meat pepper soup is my go-to on cold nights.",
    image:
      "https://i.pinimg.com/1200x/71/7e/ff/717eff53da253ebc7d303c9dba6d50f0.jpg",
  },
  {
    name: "Grace Akinyemi",
    role: "Teacher",
    text: "Her food reminds me of my grandmother's cooking back home. Fresh, well spiced, and comforting after a tiring day with my students. Chef Keena, thank you for keeping my evenings warm.",
    image:
      "https://i.pinimg.com/736x/aa/5e/75/aa5e75ecb0d0afd79e1181d1722f005a.jpg",
  },
];

const ReviewSection = () => {
  return (
    <div className="min-h-screen bg-[#30445f] py-16 px-4 md:px-12 flex flex-col items-center">
      <h2 className="text-3xl text-center font-bold text-white mb-4">
        What Our Customers Say
      </h2>
      <p className="text-yellow-500 mb-12 max-w-2xl text-center">
        Real experiences from customers who trust Chef Keena for their daily
        meals, special occasions, and family dinners.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            className="bg-[#20344f] rounded-lg p-6 flex flex-col items-center text-center shadow-lg border border-[rgba(255,255,255,0.05)] hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={review.image}
              alt={review.name}
              className="w-20 h-20 rounded-full border-4 border-white object-cover mb-4"
            />
            <h3 className="text-lg font-semibold text-red-500">
              {review.name}
            </h3>
            <span className="text-sm text-gray-400 mb-3">{review.role}</span>
            <p className="text-gray-300 text-sm italic">“{review.text}”</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
