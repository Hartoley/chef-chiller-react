import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import io from "socket.io-client";

const socket = io("https://chef-chiller-node.onrender.com");

// Central category list
const categories = [
  { label: "All", value: "" },
  { label: "Top Menu", value: "specials" },
  { label: "Main Course", value: "main course" },
  { label: "Appetizers", value: "appetizers" },
  { label: "Snacks", value: "snacks" },
  { label: "Beverages", value: "beverages" },
  { label: "Desserts", value: "desserts" },
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch Combos", value: "lunch combos" },
  { label: "Dinner Specials", value: "dinner specials" },
  { label: "Vegan Options", value: "vegan options" },
  { label: "Extras & Add-ons", value: "extras & add-ons" },
];
const ProductCard = ({ product, setActiveSection3 }) => {
  return (
    <div className="w-full sm:w-[48%] lg:w-[30%] bg-white rounded-xl shadow-md hover:shadow-lg border p-4 flex flex-col justify-between transition-all">
      {/* Wishlist Checkbox Placeholder */}
      <div className="flex justify-between items-center mb-2">
        <span className="inline-block w-4 h-4 rounded-sm border border-[rgb(17,24,39)] bg-[rgb(17,24,39)] "></span>
      </div>

      <img
        src={product.image}
        alt={product.name}
        className="h-40 object-contain mb-4 mx-auto rounded-md"
      />

      <h3 className="text-lg font-semibold mb-1 text-center">{product.name}</h3>

      <div className="flex items-center justify-center mb-3">
        <span className="text-[rgb(17,24,39)] font-bold text-lg">
          ₦{product.price.toLocaleString("en-NG")}
        </span>
        <span className="text-gray-400 line-through ml-2">₦28.30</span>
      </div>

      <div className="flex justify-between text-sm text-gray-500 items-center mb-4">
        <span>★ 2.5k+</span>
      </div>

      <div className="flex justify-between items-center gap-2">
        <button className="w-full py-2 border border-[rgb(17,24,39)] text-[rgb(17,24,39)] rounded-md hover:bg-[rgb(17,24,39)]/10 transition">
          Wishlist
        </button>
        <button
          onClick={() => {
            localStorage.setItem("productId", JSON.stringify(product._id));
            setActiveSection3("mainMenu5");
          }}
          className="w-full py-2 bg-[rgb(17,24,39)] text-white rounded-md hover:opacity-90 transition"
        >
          Order Now
        </button>
      </div>
    </div>
  );
};

const ProductSection = ({
  title,
  products,
  filterFn,
  setActiveSection3,
  isUpdating,
}) => {
  const filtered = filterFn ? products.filter(filterFn) : products;

  return (
    <section className="flex w-full h-full flex-col">
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      {filtered.length === 0 ? (
        <div className="h-[70vh] flex justify-center items-center text-gray-500 text-lg">
          No products available in this category.
        </div>
      ) : (
        <div className="section6 py-4 h-[97%] w-full flex flex-wrap overflow-x-auto gap-4 no-scrollbar">
          {filtered.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              setActiveSection3={setActiveSection3}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const LoadingSection = () => (
  <section className="section2 flex w-[60vw] h-full flex-col">
    <h3 className="text-xl font-semibold mb-1">Loading...</h3>
    <div className="section3 w-full py-4 h-[45vh] flex items-center overflow-y-auto gap-4 no-scrollbar">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="foodBox flex-shrink-0 py-4 px-2 w-[60vw] rounded-lg shadow-md bg-gray-300 animate-pulse"
        >
          <div className="w-[40%] h-full bg-gray-400"></div>
          <div className="section4 flex h-full w-[60%] flex-col items-start">
            <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-400 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const MainMenu = ({ activeSection3, setActiveSection3 }) => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(""); // value

  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `https://chef-chiller-node.onrender.com/user/getuser/${id}`
        );
        setUser(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://chef-chiller-node.onrender.com/chefchiller/user/getproducts"
        );
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const updateCart = async (product, action) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const toastId = toast.loading("Updating cart...");

    try {
      const response = await axios.post(
        "https://chef-chiller-node.onrender.com/chefchiller/updatecart",
        {
          userId: user._id,
          productId: product._id,
          productName: product.name,
          productPrice: product.price,
          image: product.image,
          action,
        }
      );
      toast.update(toastId, {
        render: response.data.message || "Cart updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Error updating the cart. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const selectedLabel = categories.find(
    (cat) => cat.value === selectedCategory
  )?.label;

  return (
    <main className="child h-[100h] flex-1 p-6 bg-gray-100 w-[63.65vw]">
      <section className="section1 flex gap-3 items-center justify-between mb-6">
        <h3 className="text-2xl flex-shrink-0 font-[12px]">Food & Drinks</h3>
        <div className="list overflow-x-scroll no-scrollbar flex space-x-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1 rounded-full flex-shrink-0 ${
                selectedCategory === cat.value
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="w-full flex flex-col min-h-[80vh] overflow-y-auto no-scrollbar">
          <LoadingSection />
        </div>
      ) : (
        <div className="w-[60vw] flex flex-col h-[80vh]">
          <ProductSection
            title={selectedLabel || "All Categories"}
            products={products}
            filterFn={(p) =>
              !selectedCategory
                ? true
                : p.category?.toLowerCase() === selectedCategory.toLowerCase()
            }
            setActiveSection3={setActiveSection3}
            isUpdating={isUpdating}
          />
        </div>
      )}
    </main>
  );
};

export default MainMenu;
