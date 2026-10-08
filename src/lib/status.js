// The backend stores these exact strings. This maps them to words a customer understands.
export const ORDER_STATUS = {
  Pending: {
    label: "Waiting for the kitchen",
    tone: "palm",
    customerHint: "We'll confirm we can cook this shortly.",
  },
  "Delivery Approved": {
    label: "Accepted, ready for payment",
    tone: "cobalt",
    customerHint: "Pay by transfer, then upload a screenshot of your payment.",
  },
  "Delivery declined": {
    label: "Declined",
    tone: "ata",
    customerHint: "Something on this order is sold out. You can cancel it and order again.",
  },
  "Payment Pending": {
    label: "Checking your payment",
    tone: "palm",
    customerHint: "We've got your proof of payment and are confirming it.",
  },
  "Payment Approved": {
    label: "Confirmed, on its way",
    tone: "ugu",
    customerHint: "Payment confirmed. Your food is being prepared for delivery.",
  },
  "Payment Declined": {
    label: "Payment not received",
    tone: "ata",
    customerHint: "We couldn't match your payment. Message us so we can sort it out.",
  },
};

export const statusInfo = (status) =>
  ORDER_STATUS[status] || { label: status || "Unknown", tone: "ink", customerHint: "" };

/** Orders still in motion (shown under "Orders"). */
export const isActive = (order) => order.status !== "Payment Approved";
/** Orders that are finished (shown under "History"). */
export const isDone = (order) => order.status === "Payment Approved";
