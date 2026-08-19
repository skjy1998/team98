import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastStore {
  toasts: ToastItem[];
  showToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: (toastId: number) => void;
}

let nextToastId = 0;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  showToast: (message, variant = "info") => {
    const id = ++nextToastId;

    set((state) => ({
      toasts: [...state.toasts, { id, message, variant }],
    }));

    globalThis.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 3500);
  },

  dismissToast: (toastId) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    }));
  },
}));
