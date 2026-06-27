"use client";

import { useEffect } from "react";
import { getToken } from "@/lib/auth";
import { getSocket } from "@/lib/socket";

type HandlerMap = Record<string, (data: unknown) => void>;

/**
 * Registers Socket.IO event listeners for the duration of the component lifecycle.
 * Connects to the gateway using the stored JWT token.
 * Handlers are stable references — pass them via useCallback or define outside the component.
 */
export function useSocketEvents(handlers: HandlerMap) {
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socket = getSocket(token);

    Object.entries(handlers).forEach(([event, fn]) => socket.on(event, fn));

    return () => {
      Object.entries(handlers).forEach(([event, fn]) => socket.off(event, fn));
    };
    // handlers object is intentionally not in deps — callers must memoize if needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
