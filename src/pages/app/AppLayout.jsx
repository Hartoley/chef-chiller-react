import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { History, LogOut, MapPin, ReceiptText, ShoppingBasket, UtensilsCrossed } from "lucide-react";
import { Logo } from "../../components/ui";
import { NavItem } from "../../components/SiteChrome";
import { useSession } from "../../lib/session";
import { naira } from "../../lib/format";
import { CustomerProvider, useCustomer } from "./CustomerContext";

const nav = [
  { to: "/app", label: "Menu", icon: UtensilsCrossed, end: true },
  { to: "/app/basket", label: "Basket", icon: ShoppingBasket, badge: "count" },
  { to: "/app/orders", label: "Orders", icon: ReceiptText },
  { to: "/app/history", label: "History", icon: History },
  { to: "/app/delivery", label: "Delivery details", icon: MapPin },
];

function BasketRail() {
  const { items, subtotal, count } = useCustomer();
  return (
    <div className="hidden w-80 shrink-0 border-l border-line bg-white xl:block">
    <aside className="sticky top-0 flex h-screen flex-col p-6">
      <h2 className="text-2xl font-extrabold">Your basket</h2>
      <p className="mt-1 text-sm text-ink-faint">{count ? `${count} item${count > 1 ? "s" : ""}` : "Nothing here yet"}</p>
      <ul className="no-scrollbar mt-6 flex-1 space-y-4 overflow-y-auto">
        {items.map((i) => (
          <li key={i.productId} className="flex items-center gap-3">
            <img src={i.image} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-cobalt" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{i.productName}</p>
              <p className="text-sm text-ink-faint">× {i.quantity}</p>
            </div>
            <span className="font-semibold">{naira(i.productPrice * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="border-t border-line pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Subtotal</span>
          <span>{naira(subtotal)}</span>
        </div>
        <Link to="/app/basket" className={`btn-hot mt-4 w-full py-3 ${count ? "" : "pointer-events-none opacity-50"}`}>
          Review and order
        </Link>
      </div>
    </aside>
    </div>
  );
}

function Shell() {
  const { signOut } = useSession();
  const { count } = useCustomer();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const out = () => {
    signOut();
    navigate("/");
  };
  const showRail = pathname !== "/app/basket";

  return (
    <div className="flex min-h-screen">
      {/* desktop sidebar */}
      <div className="hidden w-64 shrink-0 border-r border-line lg:block">
      <aside className="sticky top-0 flex h-screen flex-col p-5">
        <Logo className="h-9" to="/" />
        <nav className="mt-10 flex flex-1 flex-col gap-1" aria-label="Account">
          {nav.map((n) => (
            <NavItem key={n.to} to={n.to} icon={n.icon} end={n.end} badge={n.badge ? count : 0}>
              {n.label}
            </NavItem>
          ))}
        </nav>
        <button onClick={out} className="btn-quiet justify-start">
          <LogOut size={18} /> Sign out
        </button>
      </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* mobile top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-enamel/95 px-4 backdrop-blur lg:hidden">
          <Logo className="h-7" to="/" />
          <button onClick={out} className="btn-quiet px-2" aria-label="Sign out">
            <LogOut size={20} />
          </button>
        </header>
        <main className="flex-1 px-4 pb-28 pt-6 sm:px-8 lg:pb-12 lg:pt-10">
          <Outlet />
        </main>
      </div>

      {showRail && <BasketRail />}

      {/* mobile tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Account">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${isActive ? "text-cobalt" : "text-ink-faint"}`
            }
          >
            <n.icon size={21} />
            {n.label.split(" ")[0]}
            {n.badge && count > 0 && (
              <span className="absolute right-[22%] top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ata px-1 text-[10px] text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default function AppLayout() {
  return (
    <CustomerProvider>
      <Shell />
    </CustomerProvider>
  );
}
