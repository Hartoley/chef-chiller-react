import { io } from "socket.io-client";
import { useEffect } from "react";
import { API_URL } from "./api";

// A single shared connection for the whole app (the old code opened one per component).
export const socket = io(API_URL, { autoConnect: true, transports: ["websocket", "polling"] });

/** Subscribe to socket events for the lifetime of a component. */
export function useSocket(handlers, deps = []) {
  useEffect(() => {
    const entries = Object.entries(handlers);
    entries.forEach(([event, fn]) => socket.on(event, fn));
    return () => entries.forEach(([event, fn]) => socket.off(event, fn));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
