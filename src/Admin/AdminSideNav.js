import React, { useState, useEffect } from "react";
import logo from "../Images/logo_chef_chiller-removebg-preview.png";
import "../Admin/adminsidenav.css";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import "./admin.css";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("https://chef-chiller-node.onrender.com");

const AdminSideNav = () => {
  const [activeSection, setActiveSection] = useState("product");
  const [activeSection3, setActiveSection3] = useState("mainMenu");
  const [editingId, seteditingId] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isEditing, setisEditing] = useState(false);
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Customer 1",
      messages: [
        { sender: "customer", text: "Hello, I need help with my order." },
        { sender: "admin", text: "Sure, how can I assist you?" },
      ],
    },
    {
      id: 2,
      name: "Customer 2",
      messages: [
        { sender: "customer", text: "Can I change my reservation?" },
        {
          sender: "admin",
          text: "Of product, when would you like to reschedule?",
        },
      ],
    },
  ]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  const handleBackClick = () => {
    setSelectedChat(null);
  };

  const handleDecline = async (orderId) => {
    console.log(`Approving order with ID: ${orderId}`);

    try {
      const response = await axios.post(
        `https://chef-chiller-node.onrender.com/chefchiller/declineorders/${orderId}`
      );

      console.log("Order approved successfully:", response.data.order);
      alert("Order approved successfully!");
    } catch (error) {
      console.error(
        "Error approving order:",
        error.response ? error.response.data.message : error.message
      );
      alert("An error occurred while approving the order.");
    }
  };

  const handleApprove = async (orderId) => {
    console.log(`Approving order with ID: ${orderId}`);

    try {
      const response = await axios.post(
        `https://chef-chiller-node.onrender.com/chefchiller/approveorders/${orderId}`
      );

      console.log("Order approved successfully:", response.data.order);
      alert("Order approved successfully!");
    } catch (error) {
      console.error(
        "Error approving order:",
        error.response ? error.response.data.message : error.message
      );
      alert("An error occurred while approving the order.");
    }
  };

  const handleDeclineDelivery = async (orderId) => {
    console.log(`Approving order with ID: ${orderId}`);

    try {
      const response = await axios.post(
        `https://chef-chiller-node.onrender.com/chefchiller/declinedeliveryadmin/${orderId}`
      );

      console.log("Order approved successfully:", response.data.order);
      alert("Order approved successfully!");
    } catch (error) {
      console.error(
        "Error approving order:",
        error.response ? error.response.data.message : error.message
      );
      alert("An error occurred while approving the order.");
    }
  };

  const handleApproveDelivery = async (orderId) => {
    console.log(`Approving order with ID: ${orderId}`);

    try {
      const response = await axios.post(
        `https://chef-chiller-node.onrender.com/chefchiller/approvedeliveryadmin/${orderId}`
      );

      console.log("Order approved successfully:", response.data.order);
      alert("Order approved successfully!");
    } catch (error) {
      console.error(
        "Error approving order:",
        error.response ? error.response.data.message : error.message
      );
      alert("An error occurred while approving the order.");
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeImageOverlay = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    if (activeSection3 === "mainMenu") {
      formik.resetForm();
      console.log("Formik Values:", formik.values);
      console.log("Formik Errors:", formik.errors);
      console.log("Formik Touched:", formik.touched);
    }
  }, [activeSection3]);

  useEffect(() => {
    fetchData();

    socket.on("orderApproved", (data) => {
      console.log("Order approved:", data);
    });

    socket.on("orderApprovedByAdmin", (data) => {
      console.log("Order approved:", data);
    });

    socket.on("orderDeclinedByAdmin", (data) => {
      console.log("Order approved:", data);
    });

    return () => {
      socket.off("ordersUpdated");
      socket.off("ordersUpdatedByAdmin");
    };
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://chef-chiller-node.onrender.com/chefchiller/user/getproducts"
      );
      console.log("Product data from API:", res.data);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `https://chef-chiller-node.onrender.com/chefchiller/admingetorders`
        );
        console.log("API response:", res.data);
        setOrders(res.data.orders);
      } catch (err) {
        toast.error("Failed to fetch orders");
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: "",

      category: "",

      prepTime: "",

      description: "",

      price: "",

      image: null,
    },

    validationSchema: yup.object({
      name: yup.string().required("Product name is required"),

      category: yup.string().required("Category is required"),

      prepTime: yup.string().required("Preparation time is required"),

      description: yup.string().required("Description is required"),

      price: yup.number().required("Price is required").positive().integer(),

      image: yup.mixed().required("Image is required"),
    }),

    onSubmit: async (values) => {
      console.log("Form submitted with values:", values);

      if (!values.image) {
        toast.error("Please upload an image.");
        return;
      }

      if (
        !values.name ||
        !values.category ||
        !values.prepTime ||
        !values.description ||
        !values.price ||
        !values.image
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      const loadingToast = toast.loading("Uploading product...");
      try {
        const response = await axios.post(
          "https://chef-chiller-node.onrender.com/chefchiller/upload",
          formData
        );
        const result = response.data;

        if (response.status === 200) {
          toast.dismiss(loadingToast);
          toast.success(result.message);
          setisEditing(false);
          formik.resetForm();
        } else {
          toast.dismiss(loadingToast);
          toast.error(
            result.data.error || "Unexpected error uploading product."
          );
        }
      } catch (error) {
        console.error("Error uploading product:", error);
        toast.dismiss(loadingToast);
        toast.error(error.response.data.error);
      }
    },
  });

  const onEdit = async (productId, values) => {
    console.log(productId);

    if (!values.image) {
      toast.error("Please upload an image.");
      return;
    }

    if (
      !values.name ||
      !values.category ||
      !values.prepTime ||
      !values.description ||
      !values.price ||
      !values.image
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    const loadingToast = toast.loading("Updating product...");
    try {
      const response = await axios.post(
        `https://chef-chiller-node.onrender.com/chefchiller/edit/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = response.data;

      if (response.status === 200) {
        toast.dismiss(loadingToast);
        toast.success(result.message);
        setisEditing(false);
        formik.resetForm();
      } else {
        toast.dismiss(loadingToast);
        toast.error(result.data.error || "Unexpected error updating product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.dismiss(loadingToast);
      toast.error(error.response.data.error);
    }
  };

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
  };

  const Edit = async (productId) => {
    setActiveSection3("mainMenu");
    setisEditing(true);
    seteditingId(productId);

    axios
      .get(
        `https://chef-chiller-node.onrender.com/chefchiller/product/${productId}`
      )
      .then((res) => {
        const productData = res.data;
        formik.setValues({
          name: productData.name || "",
          category: productData.category || "",
          prepTime: productData.prepTime || "",
          description: productData.description || "",
          price: productData.price || "",
          image: productData.image,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const Delete = async (productId) => {
    toast.loading("Deleting product...");
    try {
      const response = await axios.delete(
        `https://chef-chiller-node.onrender.com/chefchiller/delete/${productId}`
      );

      if (response.status === 200) {
        console.log();
        toast.dismiss();
        toast.success(response.data.message);
        fetchData();
      } else {
        toast.dismiss();
        toast.message(response.data.message);
        fetchData();

        console.log(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error deleting the product:", error.message);
      fetchData();
    }
  };

  return (
    <>
      <div className="mainBody w-full">
        <div className="buttonBox2">
          <span onClick={toggleMenu} className="material-symbols-outlined">
            menu
          </span>
        </div>
        <nav
          id="sidenav"
          className={`bg-[#040e19] z-10 rounded-tr-3xl flex flex-col px-1 py-3 items-center rounded-br-3xl w-[15%] ${
            isMenuVisible ? "visibleNav" : ""
          }`}
        >
          <div className="flex gap-3 mb-3 items-center w-[90%] h-[10vh]">
            <div className="buttonBox2">
              <span onClick={toggleMenu} className="material-symbols-outlined">
                menu
              </span>
            </div>
            <div className="h-[80%] w-[30%] flex items-center rounded-full justify-center">
              <img src={logo} id="logoBg" className="h-[80%]" alt="Logo" />
            </div>
            <div className="chef h-[80%] flex items-center justify-center">
              <p className="text-[12px] mb-0 w-full flex items-center p-0 text-white font-medium">
                Chef Keena
              </p>
            </div>
          </div>

          <div className="otherContents w-full h-[80%]">
            <div
              className={`w-full h-8 rounded-3xl flex justify-center items-center text-white cursor-pointer ${
                activeSection === "product" ? "bg-[#cc0f31]" : "bg-[#239551]"
              }`}
              onClick={() => setActiveSection("product")}
            >
              <p className="mb-0">Products</p>
            </div>
            <div
              className={`mt-4 w-full h-7 rounded-lg flex justify-center items-center text-white cursor-pointer ${
                activeSection === "order" ? "bg-[#cc0f31]" : "bg-[#239551]"
              }`}
              onClick={() => setActiveSection("order")}
            >
              <p className="mb-0">Orders</p>
            </div>
            <div
              className={`mt-4 w-full h-7 rounded-lg flex justify-center items-center text-white cursor-pointer ${
                activeSection === "notification"
                  ? "bg-[#cc0f31]"
                  : "bg-[#239551]"
              }`}
              onClick={() => setActiveSection("notification")}
            >
              <p className="mb-0">Notifications</p>
            </div>
            <div
              className={`mt-4 w-full h-7 rounded-lg flex justify-center items-center text-white cursor-pointer ${
                activeSection === "chat" ? "bg-[#cc0f31]" : "bg-[#239551]"
              }`}
              onClick={() => setActiveSection("chat")}
            >
              <p className="mb-0">Chats</p>
            </div>
          </div>

          <div className="w-1/2 h-7 rounded-lg bg-[#fc9e34] flex justify-center items-center text-white mt-6 cursor-pointer">
            <p className="mb-0">Log out</p>
          </div>
        </nav>

        <div className="contentArea w-[87%] h-[100vh] relative left-[13%] bg-[#040e19] pl-7 ">
          {activeSection === "product" && (
            <div className="product w-full h-full p-[10px] gap-4 bg-[#50606C] rounded-lg flex flex-col items-center text-white">
              <div className="w-full  flex gap-2 p-[10px] rounded-lg bg-[#040e19]   h-[15vh]">
                <div
                  onClick={() => setActiveSection3("mainMenu")}
                  className="uploadMenus w-1/6 h-full bg-[#50606C] rounded-lg p-2 flex flex-col gap-1"
                >
                  <span class="material-symbols-outlined">flatware</span>

                  <p className="p-0 m-0">Upload menu</p>
                </div>
                <div
                  onClick={() => setActiveSection3("allMenu")}
                  className="uploadMenus w-1/6 h-full bg-[#50606C] rounded-lg p-2 flex flex-col gap-1"
                >
                  <span class="material-symbols-outlined">select_all</span>

                  <p className="p-0 m-0">All Products</p>
                </div>
                <div
                  onClick={() => setActiveSection3("uploadMenu1")}
                  className="uploadMenus w-1/6 h-full bg-[#50606C] rounded-lg p-2 flex flex-col gap-1"
                >
                  <span class="material-symbols-outlined">star_rate</span>

                  <p className="p-0 m-0">Specials</p>
                </div>
                <div
                  onClick={() => setActiveSection3("uploadMenu2")}
                  className="uploadMenus w-1/6 h-full bg-[#50606C] rounded-lg p-2 flex flex-col gap-1"
                >
                  <span class="material-symbols-outlined">new_releases</span>

                  <p className="p-0 m-0">New menu</p>
                </div>
              </div>
              <div className="w-full p-1 h-[75vh] bg-[#040e19]  rounded-lg">
                <div className="w-full h-full  flex items-center justify-center text-white bg-gray-900">
                  {activeSection3 === "mainMenu" && (
                    <div className="uploadProductContainer h-full flex flex-col w-full bg-gray-800 rounded-lg shadow-lg">
                      <h2 className="h2 text-center text-lg md:text-2xl font-semibold mb-6 text-white">
                        Upload Product
                      </h2>

                      <form
                        onSubmit={(event) => {
                          if (!isEditing) {
                            event.preventDefault();
                            formik.handleSubmit();
                          }
                        }}
                        encType="multipart/form-data"
                        className="boxForm w-full h-[95%]  p-3 flex items-center gap-2 flex-wrap"
                      >
                        {/* Product Image */}
                        <div className="formGroup flex flex-col">
                          <label
                            htmlFor="productImage"
                            className="text-sm md:text-base font-medium"
                          >
                            Product Image
                          </label>
                          <input
                            type="file"
                            id="productImage"
                            name="image"
                            onChange={(event) => {
                              formik.setFieldValue(
                                "image",
                                event.currentTarget.files[0]
                              );
                            }}
                            className="text-sm md:text-base mt-1 p-2 border border-gray-700 rounded bg-gray-900 text-gray-200"
                          />
                          {formik.touched.image && formik.errors.image ? (
                            <div className="text-red-500 text-sm">
                              {formik.errors.image}
                            </div>
                          ) : null}
                        </div>

                        {/* Product Name */}
                        <div className="formGroup flex flex-col">
                          <label
                            htmlFor="productName"
                            className="text-sm md:text-base font-medium"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="productName"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter product name"
                            className="text-sm md:text-base mt-1 p-2 border border-gray-700 rounded bg-gray-900 text-gray-200"
                          />
                          {formik.touched.name && formik.errors.name ? (
                            <div className="text-red-500 text-sm">
                              {formik.errors.name}
                            </div>
                          ) : null}
                        </div>

                        <div className="formGroup flex flex-col">
                          <label
                            htmlFor="productCategory"
                            className="text-sm md:text-base font-medium"
                          >
                            Category
                          </label>
                          <select
                            id="productCategory"
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="text-sm md:text-base mt-1 p-2 border border-gray-700 rounded bg-gray-900 text-gray-200"
                          >
                            <option value="" label="Select category" />
                            <option value="Main course" label="Main course" />
                            <option value="Beverages" label="Beverages" />
                            <option value="Appetizers" label="Appetizers" />
                            <option value="Snacks" label="Snacks" />
                            <option value="Specials" label="Specials" />
                            <option value="Extras" label="Extras" />
                            {/* Add more categories as needed */}
                          </select>
                          {formik.touched.category && formik.errors.category ? (
                            <div className="text-red-500 text-sm">
                              {formik.errors.category}
                            </div>
                          ) : null}
                        </div>

                        <div className="formGroup flex flex-col">
                          <label
                            htmlFor="productPrice"
                            className="text-sm md:text-base font-medium"
                          >
                            Price (₦)
                          </label>
                          <input
                            type="number"
                            id="productPrice"
                            name="price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter price"
                            className="text-sm md:text-base mt-1 p-2 border border-gray-700 rounded bg-gray-900 text-gray-200"
                          />
                          {formik.touched.price && formik.errors.price ? (
                            <div className="text-red-500 text-sm">
                              {formik.errors.price}
                            </div>
                          ) : null}
                        </div>

                        {/* Prep/Wait Time */}
                        <div className="formGroup flex flex-col">
                          <label
                            htmlFor="prepTime"
                            className="text-sm md:text-base font-medium"
                          >
                            Preparation Time
                          </label>
                          <input
                            type="text"
                            id="prepTime"
                            name="prepTime"
                            value={formik.values.prepTime}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="e.g., 15 mins"
                            className="text-sm md:text-base mt-1 p-2 border border-gray-700 rounded bg-gray-900 text-gray-200"
                          />
                          {formik.touched.prepTime && formik.errors.prepTime ? (
                            <div className="text-red-500 text-sm">
                              {formik.errors.prepTime}
                            </div>
                          ) : null}
                        </div>
                        <div className="formGroup flex flex-col">
                          <label
                            htmlFor="description"
                            className="text-sm md:text-base font-medium"
                          >
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows="3"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter product description"
                            className="text-sm md:text-base mt-1 p-2 border border-gray-700 rounded bg-gray-900 text-gray-200"
                          ></textarea>
                          {formik.touched.description &&
                          formik.errors.description ? (
                            <div className="text-red-500 text-sm">
                              {formik.errors.description}
                            </div>
                          ) : null}
                        </div>

                        <div className="uploadButton flex justify-center mt-4">
                          {!isEditing ? (
                            <button
                              type="submit"
                              className="text-sm md:text-base px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all shadow-md"
                            >
                              Upload
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onEdit(editingId, formik.values)}
                              className="text-sm md:text-base px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-all shadow-md"
                            >
                              Update
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  )}

                  {activeSection3 === "allMenu" && (
                    <div className="chat w-full h-full rounded-lg p-3 flex flex-col text-white overflow-y-auto">
                      <h2 className="text-lg font-semibold mb-2 text-center">
                        Our Menu
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-y-auto">
                        {products.map((product) => (
                          <div
                            key={product._id}
                            className="bg-[#0f263d] p-2 rounded-md shadow-md flex flex-col items-center text-sm"
                            // style={{ maxWidth: "100px" }}
                          >
                            {/* Product Image */}
                            <div className="w-full h-40 overflow-hidden rounded-md mb-2">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <h3 className="text-sm h-20 font-semibold mb-1 text-center">
                              {product.name}
                            </h3>
                            <p className="text-xs h-5 text-gray-300 mb-2 text-center truncate w-full">
                              {product.description}
                            </p>
                            <p className="text-sm h-5 font-bold text-[#f65553]">
                              ₦{product.price}
                            </p>

                            <div className="flex mt-2 space-x-1 w-full">
                              <button
                                onClick={() => Edit(product._id)}
                                className="flex-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded py-1 text-xs"
                              >
                                <FiEdit className="mr-1" /> Edit
                              </button>
                              <button
                                onClick={() => Delete(product._id)}
                                className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded py-1 text-xs"
                              >
                                <FiTrash2 className="mr-1" /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeSection3 === "uploadMenu1" && (
                    <div className="chat w-full h-full rounded-lg p-3 flex flex-col text-white overflow-y-auto">
                      <h2 className="text-lg font-semibold mb-2 text-center">
                        Our Specials Menu
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-y-auto">
                        {/* Filter products that include "Specials" in their category array */}
                        {products.filter((product) =>
                          product.category.includes("Specials")
                        ).length === 0 ? (
                          <p className="text-center text-gray-400 w-full col-span-4">
                            No specials at the moment
                          </p>
                        ) : (
                          products
                            .filter((product) =>
                              product.category.includes("Specials")
                            )
                            .map((product) => (
                              <div
                                key={product._id}
                                className="bg-[#0f263d] p-2 rounded-md shadow-md flex flex-col items-center text-sm"
                              >
                                {/* Product Image */}
                                <div className="w-full h-40 overflow-hidden rounded-md mb-2">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                {/* Product Details */}
                                <h3 className="text-sm h-20 font-semibold mb-1 text-center">
                                  {product.name}
                                </h3>
                                <p className="text-xs h-5 text-gray-300 mb-2 text-center truncate w-full">
                                  {product.description}
                                </p>
                                <p className="text-sm h-5 font-bold text-[#f65553]">
                                  ₦{product.price}
                                </p>
                                {/* Edit and Delete Buttons */}
                                <div className="flex mt-2 space-x-1 w-full">
                                  <button
                                    onClick={() => Edit(product._id)}
                                    className="flex-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded py-1 text-xs"
                                  >
                                    <FiEdit className="mr-1" /> Edit
                                  </button>
                                  <button
                                    onClick={() => Delete(product._id)}
                                    className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded py-1 text-xs"
                                  >
                                    <FiTrash2 className="mr-1" /> Delete
                                  </button>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                  {activeSection3 === "uploadMenu2" && (
                    <div className="chat w-full h-full rounded-lg p-3 flex flex-col text-white overflow-y-auto">
                      <h2 className="text-lg font-semibold mb-2 text-center">
                        Our Menu
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-y-auto">
                        {products.filter((product) => {
                          const productDate = new Date(product.createdAt);
                          const currentDate = new Date();
                          const hoursDifference =
                            (currentDate - productDate) / (1000 * 60 * 60);
                          return hoursDifference <= 48;
                        }).length === 0 ? (
                          <p className="text-center text-gray-400 w-full col-span-4">
                            No specials at the moment
                          </p>
                        ) : (
                          products
                            .filter((product) => {
                              const productDate = new Date(product.createdAt);
                              const currentDate = new Date();
                              const hoursDifference =
                                (currentDate - productDate) / (1000 * 60 * 60);
                              return hoursDifference <= 48;
                            })
                            .map((product) => (
                              <div
                                key={product._id}
                                className="bg-[#0f263d] p-2 rounded-md shadow-md flex flex-col items-center text-sm"
                              >
                                {/* Product Image */}
                                <div className="w-full h-40 overflow-hidden rounded-md mb-2">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                {/* Product Details */}
                                <h3 className="text-sm h-20 font-semibold mb-1 text-center">
                                  {product.name}
                                </h3>
                                <p className="text-xs h-5 text-gray-300 mb-2 text-center truncate w-full">
                                  {product.description}
                                </p>
                                <p className="text-sm h-5 font-bold text-[#f65553]">
                                  ₦{product.price}
                                </p>
                                {/* Edit and Delete Buttons */}
                                <div className="flex mt-2 space-x-1 w-full">
                                  <button
                                    onClick={() => Edit(product._id)}
                                    className="flex-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded py-1 text-xs"
                                  >
                                    <FiEdit className="mr-1" /> Edit
                                  </button>
                                  <button
                                    onClick={() => Delete(product._id)}
                                    className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded py-1 text-xs"
                                  >
                                    <FiTrash2 className="mr-1" /> Delete
                                  </button>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === "order" && (
            <div className="order w-full h-full rounded-lg ml-auto mr-auto h-full flex flex-col bg-[#50606C]  rounded-lg p-4 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order List
              </h2>

              <div className="w-full h-[60%] gap-4 flex flex-col overflow-y-auto">
                <div className="w-full h-full flex flex-col gap-4 overflow-y-scroll no-scrollbar relative">
                  {Array.isArray(orders) &&
                  orders.filter((order) => order.status === "Pending").length >
                    0 ? (
                    orders
                      .filter((order) => order.status === "Pending")
                      .map((order) => (
                        <div
                          key={order._id}
                          className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center gap-4"
                        >
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">
                              Order ID: {order._id}
                            </p>
                            <p className="text-sm text-gray-700">
                              Status: {order.status}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeclineDelivery(order._id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full md:w-auto"
                            >
                              Decline Order
                            </button>
                            <button
                              onClick={() => handleApproveDelivery(order._id)}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full md:w-auto"
                            >
                              Approve Order
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <p className="text-gray-500">No pending orders</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeSection === "notification" && (
            <div className="notifications w-full h-full rounded-lg bg-[#50606C] p-4 flex flex-col items-center justify-center text-gray-800 ">
              <h2 className="text-lg font-medium mb-4 text-center">
                Notifications
              </h2>
              <div className="w-full h-full flex flex-col gap-4 overflow-y-scroll no-scrollbar relative">
                {Array.isArray(orders) &&
                orders.filter((order) => order.status === "Payment Pending")
                  .length > 0 ? (
                  orders
                    .filter((order) => order.status === "Payment Pending")
                    .map((order) => (
                      <div
                        key={order._id}
                        className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4"
                      >
                        <div className="w-16 h-16 cursor-pointer">
                          {order.paymentImage ? (
                            <img
                              src={order.paymentImage}
                              alt="Payment"
                              className="w-full h-full object-cover rounded"
                              onClick={() =>
                                handleImageClick(order.paymentImage)
                              }
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">
                            Order ID: {order._id}
                          </p>
                          <p className="text-sm text-gray-700">
                            Status: {order.status}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDecline(order._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleApprove(order._id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Approve
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                    <p className="text-gray-500">No pending Notification</p>
                  </div>
                )}

                {/* Image Overlay */}
                {selectedImage && (
                  <div
                    className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={closeImageOverlay}
                  >
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                      <img
                        src={selectedImage}
                        alt="Large View"
                        className="max-w-full max-h-[80vh] object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === "chat" && (
            <div className="chat w-full h-full rounded-lg bg-[#50606C] p-4 flex flex-col">
              {selectedChat === null ? (
                // Chat List
                <>
                  <h2 className="text-lg font-semibold text-center mb-4">
                    Customer Support Chat
                  </h2>
                  <div className="chat-container flex flex-col gap-4 overflow-y-auto p-2 bg-white rounded-lg shadow-sm max-h-[400px]">
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        className="chat-item bg-[#0f263d] p-3 rounded-lg shadow-md flex items-center justify-between cursor-pointer hover:bg-[#4185b5] transition"
                        onClick={() => handleChatClick(chat)}
                      >
                        <div className="chat-name text-sm text-white">
                          {chat.name}
                        </div>
                        <div className="chat-preview text-xs text-white">
                          {chat.messages[chat.messages.length - 1].text}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                // Individual Chat Box
                <>
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={handleBackClick}
                      className="bg-[#4185b5] text-white px-4 py-2 rounded-md hover:bg-[#35658e]"
                    >
                      Back
                    </button>
                    <h2 className="text-lg font-semibold text-center flex-grow">
                      Chat with {selectedChat.name}
                    </h2>
                  </div>
                  <div className="chat-box bg-white p-4 rounded-lg shadow-md flex flex-col gap-4 overflow-y-auto max-h-[400px]">
                    {selectedChat.messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`message flex items-start gap-2 ${
                          msg.sender === "customer"
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        <div
                          className={`avatar w-8 h-8 rounded-full ${
                            msg.sender === "customer"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          } flex items-center justify-center text-white`}
                        >
                          {msg.sender === "customer" ? "C" : "A"}
                        </div>
                        <div
                          className={`message-content p-3 rounded-md max-w-[70%] ${
                            msg.sender === "customer"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-[#4185b5] text-white"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="chat-input mt-4 flex items-center gap-2">
                    <input
                      type="text"
                      className="w-full p-2 rounded-lg text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4185b5]"
                      placeholder="Type your message..."
                    />
                    <button className="bg-[#4185b5] text-white p-2 rounded-lg hover:bg-[#35658e] focus:outline-none">
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminSideNav;
