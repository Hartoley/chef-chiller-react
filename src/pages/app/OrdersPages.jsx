import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ImageUp, X } from "lucide-react";
import { Empty, PageTitle, Spinner, StatusBadge } from "../../components/ui";
import { errorMessage, orders as ordersApi } from "../../lib/api";
import { dateTime, naira, orderTotal, shortId } from "../../lib/format";
import { isActive, isDone, statusInfo } from "../../lib/status";
import { useSocket } from "../../lib/socket";
import { useCustomer } from "./CustomerContext";

const PER_PAGE = 20;

function useMyOrders() {
  const { userId } = useCustomer();
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ orders: null, totalPages: 1 });

  const load = useCallback(async () => {
    try {
      const r = await ordersApi.mine(userId, page, PER_PAGE);
      setState({ orders: r.orders || [], totalPages: r.totalPages || 1 });
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't load your orders."));
      setState((s) => ({ ...s, orders: s.orders || [] }));
    }
  }, [userId, page]);

  useEffect(() => {
    load();
  }, [load]);

  useSocket({ orderApproved: load, orderApprovedByAdmin: load, orderDeclinedByAdmin: load }, [load]);

  return { ...state, page, setPage, reload: load };
}

function Pager({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-8 flex items-center justify-between">
      <button className="btn-ghost" disabled={page === 1} onClick={() => setPage(page - 1)}>
        Newer
      </button>
      <span className="text-sm text-ink-faint">
        Page {page} of {totalPages}
      </span>
      <button className="btn-ghost" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
        Older
      </button>
    </div>
  );
}

function Items({ order }) {
  return (
    <ul className="space-y-2">
      {order.products.map((p) => (
        <li key={p.productId} className="flex items-center gap-3">
          <img src={p.image} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-cobalt" />
          <span className="flex-1">
            {p.productName} <span className="text-ink-faint">× {p.quantity}</span>
          </span>
          <span className="font-semibold">{naira(p.price * p.quantity)}</span>
        </li>
      ))}
    </ul>
  );
}

function PaymentUpload({ order, onDone }) {
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const input = useRef(null);

  const send = async () => {
    if (!file) return input.current?.click();
    setSending(true);
    try {
      await ordersApi.uploadPaymentProof(order._id, file);
      toast.success("Receipt sent. We'll confirm your payment shortly.");
      onDone();
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't upload your receipt. Try again."));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-2xl bg-cobalt-soft p-4">
      <p className="font-semibold text-cobalt-deep">Pay {naira(orderTotal(order))} by transfer, then upload the receipt.</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button type="button" onClick={() => input.current?.click()} className="btn-ghost">
          <ImageUp size={17} /> {file ? "Change screenshot" : "Choose screenshot"}
        </button>
        {file && <span className="max-w-[12rem] truncate text-sm text-ink-soft">{file.name}</span>}
        <button type="button" onClick={send} disabled={!file || sending} className="btn-primary">
          {sending ? "Uploading…" : "Send receipt"}
        </button>
      </div>
    </div>
  );
}

function ActiveOrder({ order, reload }) {
  const info = statusInfo(order.status);
  const canPay = order.status === "Delivery Approved" && !order.paid;
  const canCancel = !order.paid && ["Pending", "Delivery declined"].includes(order.status);

  const cancel = async () => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await ordersApi.cancel(order._id);
      toast.success("Order cancelled");
      reload();
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't cancel this order."));
    }
  };

  return (
    <li className="rounded-3xl bg-white p-5 ring-1 ring-line sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-xl font-bold">Order {shortId(order._id)}</p>
          <p className="text-sm text-ink-faint">Placed {dateTime(order.orderedDate)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      {info.customerHint && <p className="mt-3 text-ink-soft">{info.customerHint}</p>}
      <div className="mt-5 border-t border-line pt-5">
        <Items order={order} />
        <div className="mt-4 flex justify-between border-t border-dashed border-line pt-4 text-lg font-bold">
          <span>Total</span>
          <span>{naira(orderTotal(order))}</span>
        </div>
      </div>
      {(canPay || canCancel) && (
        <div className="mt-5 space-y-3">
          {canPay && <PaymentUpload order={order} onDone={reload} />}
          {canCancel && (
            <button onClick={cancel} className="btn-quiet text-ata hover:bg-ata-soft hover:text-ata-deep">
              Cancel order
            </button>
          )}
        </div>
      )}
    </li>
  );
}

export function OrdersPage() {
  const { orders, totalPages, page, setPage, reload } = useMyOrders();
  if (orders === null) return <Spinner label="Loading your orders" />;
  const active = orders.filter(isActive);

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title="Orders">Track what's cooking. This page updates on its own.</PageTitle>
      {active.length ? (
        <ul className="space-y-5">
          {active.map((o) => (
            <ActiveOrder key={o._id} order={o} reload={reload} />
          ))}
        </ul>
      ) : (
        <Empty title="No orders in progress" action={<Link to="/app" className="btn-primary">Order something</Link>}>
          Orders you place show up here until they're delivered.
        </Empty>
      )}
      <Pager page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}

export function HistoryPage() {
  const { orders, totalPages, page, setPage } = useMyOrders();
  const [open, setOpen] = useState(null);
  if (orders === null) return <Spinner label="Loading your history" />;
  const done = orders.filter(isDone);

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title="History">Every order we've confirmed for you.</PageTitle>
      {done.length ? (
        <ul className="divide-y divide-line rounded-3xl bg-white ring-1 ring-line">
          {done.map((o) => (
            <li key={o._id}>
              <button onClick={() => setOpen(o)} className="flex w-full items-center gap-4 p-5 text-left hover:bg-enamel/60">
                <div className="flex -space-x-3">
                  {o.products.slice(0, 3).map((p) => (
                    <img key={p.productId} src={p.image} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-white" />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Order {shortId(o._id)}</p>
                  <p className="truncate text-sm text-ink-soft">{o.products.map((p) => p.productName).join(", ")}</p>
                  <p className="text-sm text-ink-faint">{dateTime(o.orderedDate)}</p>
                </div>
                <span className="font-bold">{naira(orderTotal(o))}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <Empty title="No past orders yet">Once an order is confirmed, you'll find it here.</Empty>
      )}
      <Pager page={page} totalPages={totalPages} setPage={setPage} />

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-ink/50 p-0 sm:place-items-center sm:p-4" onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label="Order details">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-6 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-extrabold">Order {shortId(open._id)}</h2>
                <p className="text-sm text-ink-faint">Placed {dateTime(open.orderedDate)}</p>
              </div>
              <button onClick={() => setOpen(null)} className="btn-quiet px-2" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <StatusBadge status={open.status} />
            <div className="mt-5">
              <Items order={open} />
            </div>
            <div className="mt-4 flex justify-between border-t border-line pt-4 text-lg font-bold">
              <span>Total</span>
              <span>{naira(orderTotal(open))}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
