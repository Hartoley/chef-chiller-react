import axios from "axios";

// One place for every backend call. Change VITE_API_URL in .env to point at your server.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5010";

export const http = axios.create({ baseURL: API_URL });

const data = (p) => p.then((res) => res.data);

/** Pull a readable message out of an axios error. */
export const errorMessage = (err, fallback = "Something went wrong. Try again.") =>
  err?.response?.data?.message || err?.response?.data?.error || fallback;

export const auth = {
  login: (values) => data(http.post("/user/login", values)),
  register: (values) => data(http.post("/user/register", values)),
  getUser: (id) => data(http.get(`/user/getuser/${id}`)).then((r) => r.data),
};

export const menu = {
  list: () =>
    data(http.get("/kitchen/products")).then((r) => (Array.isArray(r) ? r : [])),
  get: (productId) => data(http.get(`/kitchen/product/${productId}`)),
  create: (formData) => data(http.post("/kitchen/upload", formData)),
  update: (productId, formData) => data(http.post(`/kitchen/edit/${productId}`, formData)),
  remove: (productId) => data(http.delete(`/kitchen/delete/${productId}`)),
};

export const basket = {
  /** action: "add" | "increase" | "decrease" | "delete" */
  update: ({ userId, product, action }) =>
    data(
      http.post("/kitchen/updatecart", {
        userId,
        productId: product.productId || product._id,
        productName: product.productName || product.name,
        productPrice: product.productPrice ?? product.price,
        image: product.image,
        action,
      })
    ),
  placeOrder: (userId) => data(http.post("/kitchen/makeOrder", { userId })),
};

export const orders = {
  mine: (userId, page = 1, limit = 10) =>
    data(http.get(`/kitchen/getmyorders/${userId}`, { params: { page, limit } })),
  all: () => data(http.get("/kitchen/admingetorders")).then((r) => r.orders || []),
  uploadPaymentProof: (orderId, file) => {
    const fd = new FormData();
    fd.append("image", file);
    return data(http.post(`/kitchen/approveDelivery/${orderId}`, fd));
  },
  cancel: (orderId) => data(http.post(`/kitchen/deleteOrder/${orderId}`)),
  // Kitchen side
  acceptDelivery: (orderId) => data(http.post(`/kitchen/approvedeliveryadmin/${orderId}`)),
  declineDelivery: (orderId) => data(http.post(`/kitchen/declinedeliveryadmin/${orderId}`)),
  confirmPayment: (orderId) => data(http.post(`/kitchen/approveorders/${orderId}`)),
  rejectPayment: (orderId) => data(http.post(`/kitchen/declineorders/${orderId}`)),
};

export const projects = {
  list: () => data(http.get("/getallproject")),
  get: (id) => data(http.get(`/fetchproject/${id}`)),
  create: (formData) => data(http.post("/uploadmyproject", formData)),
  update: (id, body) => data(http.put(`/updateproject/${id}`, body)),
  remove: (id) => data(http.delete(`/deleteproject/${id}`)),
};
