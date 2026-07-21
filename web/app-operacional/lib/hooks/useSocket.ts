"use client";

import { useEffect } from "react";
import { getToken } from "@/lib/auth";
import { getSocket } from "@/lib/socket";

type HandlerMap = Record<string, (data: unknown) => void>;

export function useSocketEvents(handlers: HandlerMap) {
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socket = getSocket(token);
    Object.entries(handlers).forEach(([event, fn]) => socket.on(event, fn));

    return () => {
      Object.entries(handlers).forEach(([event, fn]) => socket.off(event, fn));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
