import { create } from "zustand";

export type ConfirmVariant = "default" | "danger";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

interface ConfirmState {
  options: ConfirmOptions | null;
  resolveConfirm: ((confirmed: boolean) => void) | null;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  accept: () => void;
  cancel: () => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  options: null,
  resolveConfirm: null,

  confirm: (options) =>
    new Promise<boolean>((resolve) => {
      set({
        options,
        resolveConfirm: resolve,
      });
    }),

  accept: () => {
    get().resolveConfirm?.(true);

    set({
      options: null,
      resolveConfirm: null,
    });
  },

  cancel: () => {
    get().resolveConfirm?.(false);

    set({
      options: null,
      resolveConfirm: null,
    });
  },
}));
