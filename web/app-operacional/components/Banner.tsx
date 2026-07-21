"use client";

import { useEffect, useState } from "react";

interface Props {
  message: string | null;
  onDismiss: () => void;
  durationMs?: number;
}

export function Banner({ message, onDismiss, durationMs = 3000 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, durationMs);
    return () => clearTimeout(t);
  }, [message, durationMs, onDismiss]);

  if (!message || !visible) return null;

  return (
    <div className="bg-bordeaux-700 px-4 py-3 text-cream-50 text-sm font-semibold animate-pulse">
      {message}
    </div>
  );
}
