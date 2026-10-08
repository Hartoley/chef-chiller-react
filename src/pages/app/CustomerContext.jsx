import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { auth, basket as basketApi, errorMessage } from "../../lib/api";
import { useSocket } from "../../lib/socket";
import { useSession } from "../../lib/session";
import { basketTotal } from "../../lib/format";

const Ctx = createContext(null);

export function CustomerProvider({ children }) {
  const { userId } = useSession();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const u = await auth.getUser(userId);
      setUser(u);
      setItems(u?.orders || []);
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't load your account."));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Live basket updates from the server
  useSocket(
    {
      ordersUpdated: (d) => {
        if (String(d?.userId) === String(userId)) setItems(d.orders || []);
      },
    },
    [userId]
  );

  const update = useCallback(
    async (product, action) => {
      const id = product.productId || product._id;
      setBusyId(id);
      try {
        await basketApi.update({ userId, product, action });
        if (action === "add") toast.success(`${product.name || product.productName} added to your basket`);
        await refresh();
      } catch (err) {
        toast.error(errorMessage(err, "Couldn't update your basket."));
      } finally {
        setBusyId(null);
      }
    },
    [userId, refresh]
  );

  const value = useMemo(
    () => ({
      userId,
      user,
      items,
      count: items.reduce((n, i) => n + (i.quantity || 0), 0),
      subtotal: basketTotal(items),
      loading,
      busyId,
      refresh,
      update,
      quantityOf: (productId) => items.find((i) => String(i.productId) === String(productId))?.quantity || 0,
    }),
    [userId, user, items, loading, busyId, refresh, update]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCustomer = () => useContext(Ctx);
