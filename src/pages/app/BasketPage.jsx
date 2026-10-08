import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Empty, PageTitle, Spinner } from "../../components/ui";
import { basket, errorMessage } from "../../lib/api";
import { naira } from "../../lib/format";
import { useCustomer } from "./CustomerContext";

export default function BasketPage() {
  const { items, subtotal, loading, update, busyId, userId, user, refresh } = useCustomer();
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const place = async () => {
    setPlacing(true);
    try {
      await basket.placeOrder(userId);
      toast.success("Order placed. We'll confirm it shortly.");
      await refresh();
      navigate("/app/orders");
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't place your order. Try again."));
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <Spinner label="Loading your basket" />;
  if (!items.length)
    return (
      <Empty title="Your basket is empty" action={<Link to="/app" className="btn-primary">Browse the menu</Link>}>
        Add a few dishes and they'll wait for you here.
      </Empty>
    );

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title="Your basket">Check your order, then send it to the kitchen.</PageTitle>

      <ul className="divide-y divide-line rounded-3xl bg-white ring-1 ring-line">
        {items.map((i) => {
          const busy = busyId === i.productId;
          return (
            <li key={i.productId} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap sm:p-5">
              <img src={i.image} alt="" className="h-16 w-16 rounded-full object-cover ring-[3px] ring-cobalt" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold leading-tight">{i.productName}</p>
                <p className="text-ink-faint">{naira(i.productPrice)} each</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-enamel p-1">
                <button onClick={() => update(i, "decrease")} disabled={busy} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white" aria-label={`Remove one ${i.productName}`}>
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-bold">{i.quantity}</span>
                <button onClick={() => update(i, "increase")} disabled={busy} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white" aria-label={`Add one ${i.productName}`}>
                  <Plus size={16} />
                </button>
              </div>
              <span className="w-24 text-right font-bold">{naira(i.productPrice * i.quantity)}</span>
              <button onClick={() => update(i, "delete")} disabled={busy} className="grid h-9 w-9 place-items-center rounded-full text-ink-faint hover:bg-ata-soft hover:text-ata" aria-label={`Remove ${i.productName}`}>
                <Trash2 size={17} />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-line sm:p-6">
        {user && (
          <div className="mb-4 flex flex-wrap justify-between gap-2 text-ink-soft">
            <span>Delivering to {user.username}</span>
            <span>{user.phoneNumber}</span>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-line pt-4">
          <span className="text-lg font-semibold">Subtotal</span>
          <span className="font-display text-3xl font-extrabold">{naira(subtotal)}</span>
        </div>
        <p className="mt-2 text-sm text-ink-faint">You'll pay by transfer after the kitchen accepts your order.</p>
        <button onClick={place} disabled={placing} className="btn-hot mt-6 w-full py-3.5 text-base">
          {placing ? "Placing order…" : "Place order"}
        </button>
      </div>
    </div>
  );
}
