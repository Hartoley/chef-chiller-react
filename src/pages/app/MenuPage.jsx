import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Bowl, Empty, PageTitle, Spinner } from "../../components/ui";
import { menu } from "../../lib/api";
import { naira } from "../../lib/format";
import { useCustomer } from "./CustomerContext";

export default function MenuPage() {
  const [items, setItems] = useState(null);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const { user, update, busyId, quantityOf } = useCustomer();

  useEffect(() => {
    menu.list().then(setItems).catch(() => setItems([]));
  }, []);

  const cats = useMemo(() => ["All", ...new Set((items || []).map((p) => p.category).filter(Boolean))], [items]);
  const shown = (items || []).filter(
    (p) => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(q.trim().toLowerCase())
  );

  const firstName = user?.username ? `, ${user.username}` : "";

  return (
    <>
      <PageTitle title={`What are you eating today${firstName}?`}>Tap a dish to see more, or add it straight to your basket.</PageTitle>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="relative w-full sm:max-w-xs">
          <span className="sr-only">Search the menu</span>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jollof, asun…" className="field pl-11" />
        </label>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                cat === c ? "bg-ink text-white" : "bg-white text-ink-soft ring-1 ring-line hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {items === null ? (
        <Spinner label="Loading the menu" />
      ) : !shown.length ? (
        <Empty title={items.length ? "No dishes match that" : "The kitchen hasn't added today's menu yet"}>
          {items.length ? "Try another category or search." : "Check back soon. New dishes show up here as soon as they're added."}
        </Empty>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 2xl:grid-cols-4">
          {shown.map((p) => {
            const inBasket = quantityOf(p._id);
            return (
              <li key={p._id} className="flex flex-col items-center text-center">
                <Link to={`/app/dish/${p._id}`} className="group flex flex-col items-center">
                  <Bowl src={p.image} alt={p.name} rim="thin" size="h-32 w-32 sm:h-36 sm:w-36" className="transition-transform group-hover:-rotate-6" />
                  <span className="mt-4 font-display text-lg font-bold leading-tight">{p.name}</span>
                </Link>
                <span className="mt-1 font-semibold text-ata">{naira(p.price)}</span>
                <button
                  onClick={() => update(p, "add")}
                  disabled={busyId === p._id}
                  className="btn-ghost mt-3 px-4 py-2 text-sm"
                >
                  <Plus size={16} /> {inBasket ? `Add another (${inBasket})` : "Add to basket"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
