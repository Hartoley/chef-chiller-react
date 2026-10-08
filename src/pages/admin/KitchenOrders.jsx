import { useState } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { Empty, PageTitle, Spinner, StatusBadge } from "../../components/ui";
import { errorMessage, orders as ordersApi } from "../../lib/api";
import { dateTime, naira, orderTotal, shortId } from "../../lib/format";
import { useKitchen } from "./AdminLayout";

const FILTERS = [
  { key: "new", label: "New", match: (o) => o.status === "Pending" },
  { key: "payment", label: "Check payment", match: (o) => o.status === "Payment Pending" },
  { key: "awaiting", label: "Waiting for payment", match: (o) => o.status === "Delivery Approved" },
  { key: "confirmed", label: "Confirmed", match: (o) => o.status === "Payment Approved" },
  { key: "declined", label: "Declined", match: (o) => ["Delivery declined", "Payment Declined"].includes(o.status) },
  { key: "all", label: "All", match: () => true },
];

function OrderRow({ order, onAction, onReceipt }) {
  const [busy, setBusy] = useState(false);
  const act = async (fn, done) => {
    setBusy(true);
    try {
      await fn(order._id);
      toast.success(done);
      onAction();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="rounded-3xl bg-white p-5 ring-1 ring-line sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-xl font-bold">Order {shortId(order._id)}</p>
          <p className="text-sm text-ink-faint">{dateTime(order.orderedDate)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <ul className="mt-4 space-y-1.5">
        {order.products.map((p) => (
          <li key={p.productId} className="flex justify-between gap-4">
            <span>
              {p.quantity} × {p.productName}
            </span>
            <span className="text-ink-soft">{naira(p.price * p.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-between border-t border-dashed border-line pt-3 font-bold">
        <span>Total</span>
        <span>{naira(orderTotal(order))}</span>
      </div>

      {order.status === "Pending" && (
        <div className="mt-5 flex flex-wrap gap-3">
          <button disabled={busy} onClick={() => act(ordersApi.acceptDelivery, "Order accepted. The customer can now pay.")} className="btn-primary">
            Accept order
          </button>
          <button disabled={busy} onClick={() => act(ordersApi.declineDelivery, "Order declined")} className="btn-ghost">
            Decline
          </button>
        </div>
      )}

      {order.status === "Payment Pending" && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {order.paymentImage && (
            <button onClick={() => onReceipt(order.paymentImage)} className="overflow-hidden rounded-xl ring-1 ring-line" aria-label="View payment receipt">
              <img src={order.paymentImage} alt="Payment receipt" className="h-16 w-16 object-cover" />
            </button>
          )}
          <button disabled={busy} onClick={() => act(ordersApi.confirmPayment, "Payment confirmed")} className="btn-primary">
            Confirm payment
          </button>
          <button disabled={busy} onClick={() => act(ordersApi.rejectPayment, "Payment rejected")} className="btn-ghost">
            Reject
          </button>
        </div>
      )}
    </li>
  );
}

export default function KitchenOrders() {
  const { orders, reload } = useKitchen();
  const [filter, setFilter] = useState("new");
  const [receipt, setReceipt] = useState(null);

  if (orders === null) return <Spinner label="Loading orders" />;
  const current = FILTERS.find((f) => f.key === filter);
  const shown = orders.filter(current.match);

  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle title="Orders">Accept new orders, then confirm payments as receipts come in.</PageTitle>

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => {
          const n = orders.filter(f.match).length;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                filter === f.key ? "bg-ink text-white" : "bg-white text-ink-soft ring-1 ring-line hover:text-ink"
              }`}
            >
              {f.label} <span className="opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      {shown.length ? (
        <ul className="space-y-4">
          {shown.map((o) => (
            <OrderRow key={o._id} order={o} onAction={reload} onReceipt={setReceipt} />
          ))}
        </ul>
      ) : (
        <Empty title={filter === "new" ? "No new orders" : "Nothing here"}>
          {filter === "new" ? "New orders appear here the moment customers place them." : "Orders with this status will show up here."}
        </Empty>
      )}

      {receipt && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4" onClick={() => setReceipt(null)} role="dialog" aria-modal="true" aria-label="Payment receipt">
          <button className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white" aria-label="Close">
            <X size={20} />
          </button>
          <img src={receipt} alt="Payment receipt" className="max-h-[85vh] max-w-full rounded-2xl bg-white object-contain" />
        </div>
      )}
    </div>
  );
}
