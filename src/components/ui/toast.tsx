"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

export function Toast({ message, type = "info", duration = 5000, onClose }: { message: string; type?: ToastType; duration?: number; onClose: () => void }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 max-w-sm px-5 py-4 rounded shadow-lg text-sm font-medium transition-all duration-300",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      { "bg-[--olive] text-white": type === "success", "bg-red-600 text-white": type === "error", "bg-[--ink] text-[--paper]": type === "info" }
    )}>
      <div className="flex items-start gap-3">
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="opacity-70 hover:opacity-100 ml-2">✕</button>
      </div>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<{ id: string; message: string; type: ToastType }[]>([]);
  function addToast(message: string, type: ToastType = "info") {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  }
  function removeToast(id: string) { setToasts((prev) => prev.filter((t) => t.id !== id)); }
  return { toasts, addToast, removeToast };
}

export function ToastContainer({ toasts, onRemove }: { toasts: { id: string; message: string; type: ToastType }[]; onRemove: (id: string) => void }) {
  return <>{toasts.map((t) => <Toast key={t.id} message={t.message} type={t.type} onClose={() => onRemove(t.id)} />)}</>;
}
