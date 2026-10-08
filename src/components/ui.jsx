import { Link } from "react-router-dom";
import { statusInfo } from "../lib/status";

export function Logo({ className = "h-9", white = false, to = "/" }) {
  return (
    <Link to={to} className="inline-flex items-center" aria-label="Ata Kitchen home">
      <img
        src={white ? "/brand/ata-logo-white.svg" : "/brand/ata-logo.svg"}
        alt="Ata Kitchen"
        className={className}
      />
    </Link>
  );
}

/**
 * The brand's signature: a dish sitting inside an enamel bowl rim.
 * size is a Tailwind size class pair, e.g. "h-40 w-40".
 */
export function Bowl({ src, alt, size = "h-40 w-40", rim = "thick", className = "" }) {
  const ring =
    rim === "thick"
      ? "ring-[10px] ring-cobalt outline outline-[6px] outline-offset-[10px] outline-white"
      : "ring-[5px] ring-cobalt";
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full bg-white ${ring} ${size} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="grid h-full w-full place-items-center bg-cobalt-soft">
          <img src="/brand/ata-mark.svg" alt="" className="w-1/2 opacity-60" />
        </div>
      )}
    </div>
  );
}

const TONES = {
  palm: "bg-palm-soft text-[#7A5200]",
  cobalt: "bg-cobalt-soft text-cobalt-deep",
  ata: "bg-ata-soft text-ata-deep",
  ugu: "bg-ugu-soft text-ugu",
  ink: "bg-line text-ink",
};

export function StatusBadge({ status }) {
  const info = statusInfo(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold ${TONES[info.tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {info.label}
    </span>
  );
}

export function Field({ label, error, hint, id, children, ...props }) {
  const fieldId = id || props.name;
  return (
    <div>
      {label && (
        <label htmlFor={fieldId} className="label">
          {label}
        </label>
      )}
      {children || <input id={fieldId} className="field" {...props} />}
      {hint && !error && <p className="mt-1.5 text-[13px] text-ink-faint">{hint}</p>}
      {error && <p className="mt-1.5 text-[13px] font-medium text-ata">{error}</p>}
    </div>
  );
}

export function Empty({ title, children, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <img src="/brand/ata-mark.svg" alt="" className="mb-5 h-16 w-16 opacity-80" />
      <h3 className="text-xl font-bold">{title}</h3>
      {children && <p className="mt-2 max-w-sm text-ink-soft">{children}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Spinner({ label = "Loading" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ink-soft" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-[3px] border-cobalt border-t-transparent" />
      {label}
    </div>
  );
}

export function PageTitle({ title, children, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
        {children && <p className="mt-2 max-w-xl text-ink-soft">{children}</p>}
      </div>
      {action}
    </div>
  );
}
