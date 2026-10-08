import { createContext, useCallback, useContext, useMemo, useState } from "react";

const KEY = "ata.session";
const SessionContext = createContext(null);

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(read);

  const signIn = useCallback((next) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* private mode: keep it in memory only */
    }
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      userId: session?.id || null,
      isAdmin: session?.role === "Admin",
      signIn,
      signOut,
    }),
    [session, signIn, signOut]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
