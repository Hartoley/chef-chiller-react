import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Minus, Plus } from "lucide-react";
import { Bowl, Empty, Spinner } from "../../components/ui";
import { menu } from "../../lib/api";
import { naira } from "../../lib/format";
import { useCustomer } from "./CustomerContext";

export default function DishPage() {
  const { productId } = useParams();
  const [dish, setDish] = useState(undefined);
  const { update, busyId, quantityOf } = useCustomer();

  useEffect(() => {
    setDish(undefined);
    menu
      .get(productId)
      .then((d) => setDish(d || null))
      .catch(() => setDish(null));
  }, [productId]);

  if (dish === undefined) return <Spinner label="Loading dish" />;
  if (!dish)
    return (
      <Empty title="We couldn't find that dish" action={<Link to="/app" className="btn-primary">Back to the menu</Link>}>
        It may have been taken off today's menu.
      </Empty>
    );

  const qty = quantityOf(dish._id);
  const busy = busyId === dish._id;

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app" className="btn-quiet -ml-3 mb-6">
        <ArrowLeft size={18} /> Back to menu
      </Link>
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="flex justify-center py-6">
          <Bowl src={dish.image} alt={dish.name} size="h-64 w-64 sm:h-80 sm:w-80" />
        </div>
        <div>
          {dish.category && <p className="font-semibold text-cobalt">{dish.category}</p>}
          <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{dish.name}</h1>
          <p className="mt-4 text-3xl font-bold text-ata">{naira(dish.price)}</p>
          {dish.prepTime && (
            <p className="mt-3 inline-flex items-center gap-2 text-ink-soft">
              <Clock size={17} /> Ready in about {dish.prepTime}
            </p>
          )}
          {dish.description && <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-soft">{dish.description}</p>}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {qty > 0 ? (
              <div className="flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-line">
                <button
                  onClick={() => update(dish, "decrease")}
                  disabled={busy}
                  className="grid h-11 w-11 place-items-center rounded-full hover:bg-enamel"
                  aria-label="Remove one"
                >
                  <Minus size={18} />
                </button>
                <span className="w-10 text-center text-lg font-bold" aria-live="polite">{qty}</span>
                <button
                  onClick={() => update(dish, "increase")}
                  disabled={busy}
                  className="grid h-11 w-11 place-items-center rounded-full hover:bg-enamel"
                  aria-label="Add one more"
                >
                  <Plus size={18} />
                </button>
              </div>
            ) : (
              <button onClick={() => update(dish, "add")} disabled={busy} className="btn-hot px-6 py-3 text-base">
                <Plus size={18} /> Add to basket
              </button>
            )}
            {qty > 0 && (
              <Link to="/app/basket" className="btn-primary px-6 py-3 text-base">
                Go to basket
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
