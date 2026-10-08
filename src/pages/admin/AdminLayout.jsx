import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ChefHat, LogOut, MessageCircle, ReceiptText, Store } from "lucide-react";
import { toast } from "react-toastify";
import { Logo } from "../../components/ui";
import { NavItem } from "../../components/SiteChrome";
import { useSession } from "../../lib/session";
import { errorMessage, orders as ordersApi } from "../../lib/api";
import { useSocket } from "../../lib/socket";

const KitchenCtx = createContext(null);
export const useKitchen = () => useContext(KitchenCtx);

const NEEDS_ACTION = ["Pending", "Payment Pending"];

function KitchenProvider({ children }) {
  const [orders, setOrders] = useState(null);

  const reload = useCallback(async () => {
    try {
      setOrders(await ordersApi.all());
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't load orders."));
      setOrders((o) => o || []);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useSocket(
    { orderApproved: reload, orderApprovedByAdmin: reload, orderDeclinedByAdmin: reload, paymentUploaded: reload },
    [reload]
  );

  const value = useMemo(
    () => ({ orders, reload, needsAction: (orders || []).filter((o) => NEEDS_ACTION.includes(o.status)).length }),
    [orders, reload]
  );
  return <KitchenCtx.Provider value={value}>{children}</KitchenCtx.Provider>;
}

const nav = [
  { to: "/admin", label: "Orders", icon: ReceiptText, end: true, badge: true },
  { to: "/admin/menu", label: "Menu", icon: ChefHat },
  { to: "/admin/messages", label: "Messages", icon: MessageCircle },
];

function Shell() {
  const { signOut } = useSession();
  const { needsAction } = useKitchen();
  const navigate = useNavigate();
  const out = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-64 shrink-0 bg-ink lg:block">
      <aside className="sticky top-0 flex h-screen flex-col p-5 text-white">
        <Logo white className="h-9" to="/" />
        <p className="mt-2 pl-1 text-sm font-semibold text-white/50">Kitchen</p>
        <nav className="mt-10 flex flex-1 flex-col gap-1 [&_a:not([aria-current])]:text-white/70 [&_a:not([aria-current]):hover]:bg-white/10 [&_a:not([aria-current]):hover]:text-white" aria-label="Kitchen">
          {nav.map((n) => (
            <NavItem key={n.to} to={n.to} icon={n.icon} end={n.end} badge={n.badge ? needsAction : 0}>
              {n.label}
            </NavItem>
          ))}
        </nav>
        <a href="/" className="btn-quiet justify-start text-white/70 hover:bg-white/10 hover:text-white">
          <Store size={18} /> View site
        </a>
        <button onClick={out} className="btn-quiet justify-start text-white/70 hover:bg-white/10 hover:text-white">
          <LogOut size={18} /> Sign out
        </button>
      </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between bg-ink px-4 lg:hidden">
          <Logo white className="h-7" to="/" />
          <button onClick={out} className="btn-quiet px-2 text-white/80 hover:bg-white/10 hover:text-white" aria-label="Sign out">
            <LogOut size={20} />
          </button>
        </header>
        <main className="flex-1 px-4 pb-28 pt-6 sm:px-8 lg:pb-12 lg:pt-10">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Kitchen">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 py-2.5 text-xs font-semibold ${isActive ? "text-cobalt" : "text-ink-faint"}`
            }
          >
            <n.icon size={21} />
            {n.label}
            {n.badge && needsAction > 0 && (
              <span className="absolute right-[30%] top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ata px-1 text-[10px] text-white">
                {needsAction}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <KitchenProvider>
      <Shell />
    </KitchenProvider>
  );
}
