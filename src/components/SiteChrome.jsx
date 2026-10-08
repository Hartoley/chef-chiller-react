import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./ui";
import { useSession } from "../lib/session";
import { BRAND, deliveryAreas } from "../data/showcase";

const links = [
  { to: "/#menu", label: "Menu" },
  { to: "/#how", label: "How ordering works" },
  { to: "/journal", label: "Journal" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { session, isAdmin, signOut } = useSession();
  const navigate = useNavigate();
  const home = isAdmin ? "/admin" : "/app";

  const out = () => {
    signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-enamel/90 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between sm:h-[72px]">
        <Logo className="h-8 sm:h-9" />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="btn-quiet">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <>
              <button onClick={out} className="btn-quiet">
                Sign out
              </button>
              <Link to={home} className="btn-primary">
                {isAdmin ? "Open kitchen" : "Order food"}
              </Link>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn-quiet">
                Sign in
              </Link>
              <Link to="/signup" className="btn-primary">
                Create account
              </Link>
            </>
          )}
        </div>

        <button
          className="btn-quiet md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white md:hidden">
          <nav className="wrap flex flex-col py-3" aria-label="Mobile">
            {links.map((l) => (
              <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="py-3 text-lg font-semibold">
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex gap-2 border-t border-line pt-4">
              {session ? (
                <>
                  <Link to={home} className="btn-primary flex-1">
                    {isAdmin ? "Open kitchen" : "Order food"}
                  </Link>
                  <button onClick={out} className="btn-ghost">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary flex-1">
                    Create account
                  </Link>
                  <Link to="/signin" className="btn-ghost flex-1">
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-cobalt text-white">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo white className="h-10" />
          <p className="mt-4 max-w-xs text-white/80">{BRAND.tagline} Cooked fresh in {BRAND.city}.</p>
          <p className="mt-4 text-sm text-white/70">{BRAND.hours}</p>
        </div>
        <div>
          <h2 className="mb-3 font-sans text-base font-bold text-white">We deliver to</h2>
          <ul className="space-y-1.5 text-white/80">
            {deliveryAreas.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-sans text-base font-bold text-white">Ata Kitchen</h2>
          <ul className="space-y-1.5 text-white/80">
            <li>
              <a href="/#menu" className="hover:text-white">Today's menu</a>
            </li>
            <li>
              <Link to="/journal" className="hover:text-white">Journal</Link>
            </li>
            <li>
              <Link to="/signin" className="hover:text-white">Sign in</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="wrap flex flex-col gap-2 py-5 text-sm text-white/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Ata Kitchen. All rights reserved.</p>
          <p>
            Made in Ibadan. Built by{" "}
            <Link to="/portfolio" className="underline underline-offset-4 hover:text-white">
              Sekinat Jimoh
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function NavItem({ to, icon: Icon, children, badge, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors ${
          isActive ? "bg-cobalt text-white" : "text-ink-soft hover:bg-white hover:text-ink"
        }`
      }
    >
      <Icon size={19} strokeWidth={2.2} />
      <span className="flex-1">{children}</span>
      {badge > 0 && (
        <span className="grid h-6 min-w-6 place-items-center rounded-full bg-ata px-1.5 text-xs font-bold text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </NavLink>
  );
}
