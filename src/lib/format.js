export const naira = (value = 0) =>
  "₦" +
  Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

export const shortDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    : "";

export const dateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-NG", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

export const basketTotal = (items = []) =>
  items.reduce((sum, item) => sum + (item.productPrice || 0) * (item.quantity || 0), 0);

export const orderTotal = (order) =>
  order?.Total ??
  (order?.products || []).reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 0), 0);

export const shortId = (id = "") => `#${String(id).slice(-6).toUpperCase()}`;
