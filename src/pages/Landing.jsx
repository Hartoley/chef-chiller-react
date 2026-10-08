import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { Bowl } from "../components/ui";
import { showcase, deliveryAreas, partyPacks, BRAND } from "../data/showcase";
import { reviews } from "../data/reviews";
import { menu } from "../lib/api";
import { naira } from "../lib/format";
import { useSession } from "../lib/session";

function Hero() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const dish = showcase[i];

  return (
    <section className="relative overflow-hidden">
      <div className="wrap grid items-center gap-12 pb-16 pt-10 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:pb-24">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink-soft ring-1 ring-line">
            <MapPin size={15} className="text-ata" /> Delivering across {BRAND.city}
          </p>
          <h1 className="display-xl text-[2.9rem] leading-[0.95] sm:text-6xl lg:text-[5.2rem]">
            Home cooking, hot at your door.
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-soft">
            Jollof, efo riro, asun and more, cooked fresh every day and delivered across {BRAND.city}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#menu" className="btn-hot px-6 py-3 text-base">
              See today's menu
            </a>
            <Link to="/signup" className="btn-ghost px-6 py-3 text-base">
              Create account
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative grid place-items-center">
            {/* the tray the bowl sits on */}
            <div className="absolute h-[19rem] w-[19rem] translate-x-6 translate-y-6 rounded-full bg-palm sm:h-[26rem] sm:w-[26rem]" />
            <AnimatePresence mode="wait">
              <motion.div
                key={dish.name}
                initial={reduce ? false : { opacity: 0, rotate: -8, scale: 0.96 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, rotate: 8, scale: 0.96 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Bowl src={dish.image} alt={dish.name} size="h-[17rem] w-[17rem] sm:h-[23rem] sm:w-[23rem]" />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-12 w-full max-w-sm text-center" aria-live="polite">
            <h2 className="text-2xl font-extrabold">{dish.name}</h2>
            <p className="mt-2 text-ink-soft">{dish.note}</p>
          </div>

          <div className="mt-6 flex gap-3" role="tablist" aria-label="Signature dishes">
            {showcase.map((d, idx) => (
              <button
                key={d.name}
                role="tab"
                aria-selected={idx === i}
                aria-label={d.name}
                onClick={() => setI(idx)}
                className={`overflow-hidden rounded-full transition ${idx === i ? "ring-4 ring-cobalt ring-offset-2 ring-offset-enamel" : "opacity-70 hover:opacity-100"
                  }`}
              >
                <img src={d.image} alt="" className="h-12 w-12 object-cover sm:h-14 sm:w-14" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuPreview() {
  const [items, setItems] = useState(null);
  const [cat, setCat] = useState("All");
  const { session, isAdmin } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    menu.list().then(setItems).catch(() => setItems([]));
  }, []);

  const cats = useMemo(
    () => ["All", ...new Set((items || []).map((p) => p.category).filter(Boolean))],
    [items]
  );
  const shown = (items || []).filter((p) => cat === "All" || p.category === cat);

  const open = (p) => {
    if (!session) return navigate("/signin", { state: { next: `/app/dish/${p._id}` } });
    navigate(isAdmin ? "/admin/menu" : `/app/dish/${p._id}`);
  };

  return (
    <section id="menu" className="scroll-mt-20 border-y border-line bg-white py-16 sm:py-20">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-extrabold sm:text-5xl">Today's menu</h2>
            <p className="mt-3 max-w-md text-ink-soft">
              Everything is cooked the same day. Pick what you like, we'll handle the rest.
            </p>
          </div>
          {cats.length > 2 && (
            <div className="no-scrollbar -mx-4 flex max-w-full gap-2 overflow-x-auto px-4">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${cat === c ? "bg-ink text-white" : "bg-enamel text-ink-soft hover:text-ink"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {items === null ? (
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
            {[0, 1, 2, 3].map((k) => (
              <div key={k} className="flex flex-col items-center">
                <div className="h-36 w-36 animate-pulse rounded-full bg-enamel" />
                <div className="mt-5 h-4 w-28 animate-pulse rounded bg-enamel" />
              </div>
            ))}
          </div>
        ) : shown.length ? (
          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
            {shown.map((p) => (
              <li key={p._id}>
                <button onClick={() => open(p)} className="group flex w-full flex-col items-center text-center">
                  <Bowl src={p.image} alt={p.name} rim="thin" size="h-32 w-32 sm:h-40 sm:w-40" className="transition-transform group-hover:-rotate-6" />
                  <span className="mt-5 line-clamp-2 min-h-[2.6em] font-display text-lg font-bold leading-[1.3]">{p.name}</span>
                  <span className="mt-1 font-semibold text-ata">{naira(p.price)}</span>
                  {p.prepTime && <span className="mt-0.5 text-sm text-ink-faint">Ready in {p.prepTime}</span>}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
            {showcase.map((d) => (
              <li key={d.name} className="flex flex-col items-center text-center">
                <Bowl src={d.image} alt={d.name} rim="thin" size="h-32 w-32 sm:h-40 sm:w-40" />
                <span className="mt-5 line-clamp-2 min-h-[2.6em] font-display text-lg font-bold leading-[1.3]">{d.name}</span>
              </li>
            ))}
          </ul>
        )}

        {items !== null && !items.length && (
          <p className="mt-10 text-center text-ink-soft">
            The live menu will show here once the kitchen adds today's dishes.
          </p>
        )}
      </div>
    </section>
  );
}

const steps = [
  { title: "Pick your food", text: "Browse today's menu and add dishes to your basket." },
  { title: "Place your order", text: "Send your basket to the kitchen in one tap." },
  { title: "We confirm it", text: "The kitchen checks everything is available and accepts your order." },
  { title: "Pay and relax", text: "Pay by transfer, upload your receipt, and we deliver it hot." },
];

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 py-16 sm:py-24">
      <div className="wrap">
        <h2 className="max-w-lg text-4xl font-extrabold sm:text-5xl">How ordering works</h2>
        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, n) => (
            <li key={s.title} className="border-t-4 border-cobalt pt-5">
              <span className="display-xl text-5xl text-cobalt">{n + 1}</span>
              <h3 className="mt-3 font-sans text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PartyPacks() {
  return (
    <section className="bg-ink text-white">
      <div className="wrap grid items-center gap-10 py-16 md:grid-cols-2 md:py-20">
        <img src={partyPacks} alt="Packs of jollof, fried rice and peppered meat" className="w-full max-w-md justify-self-center rounded-[2rem] bg-white p-4" />
        <div>
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">Feeding a crowd?</h2>
          <p className="mt-4 max-w-md text-lg text-white/75">
            Birthdays, showers, office lunches. We pack jollof, fried rice, small chops and peppered meat by the
            tray. Tell us the headcount and the date.
          </p>
          <p className="mt-6 text-white/60">Delivering to {deliveryAreas.join(", ")}.</p>
          <Link to="/signup" className="btn-hot mt-8 px-6 py-3 text-base">
            Create an account to order
          </Link>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  if (!reviews.length) return null;
  return (
    <section className="py-16 sm:py-24">
      <div className="wrap">
        <h2 className="text-4xl font-extrabold sm:text-5xl">From our tables</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-line">
              <blockquote className="text-[17px] leading-relaxed">“{r.text}”</blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-cobalt-soft font-display font-bold text-cobalt">
                  {r.name[0]}
                </span>
                <span>
                  <span className="block font-semibold">{r.name}</span>
                  <span className="block text-sm text-ink-faint">{r.area}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <MenuPreview />
        <HowItWorks />
        <PartyPacks />
        <Reviews />
      </main>
      <SiteFooter />
    </>
  );
}