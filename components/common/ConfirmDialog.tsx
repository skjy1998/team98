"use client";

import { useConfirmStore } from "@/stores/confirm-store";
import { CircleAlert, X } from "lucide-react";
import { useEffect } from "react";

export default function ConfirmDialog() {
  const options = useConfirmStore((state) => state.options);
  const accept = useConfirmStore((state) => state.accept);
  const cancel = useConfirmStore((state) => state.cancel);

  useEffect(() => {
    if (!options) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        cancel();
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [options, cancel]);

  if (!options) return null;

  const isDanger = options.variant === "danger";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4">
      <button
        type="button"
        aria-label="확인 창 닫기"
        onClick={cancel}
        className="absolute inset-0 cursor-default"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="relative z-10 w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={cancel}
          aria-label="확인 창 닫기"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
        >
          <X className="h-4 w-4" />
        </button>

        <div
          className={[
            "flex h-11 w-11 items-center justify-center rounded-xl",
            isDanger
              ? "bg-rose-50 text-rose-500"
              : "bg-emerald-50 text-emerald-600",
          ].join(" ")}
        >
          <CircleAlert className="h-5 w-5" />
        </div>

        <h2
          id="confirm-dialog-title"
          className="mt-4 pr-8 text-xl font-bold text-stone-900"
        >
          {options.title}
        </h2>

        <p
          id="confirm-dialog-description"
          className="mt-2 text-sm leading-6 text-stone-500"
        >
          {options.description}
        </p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={cancel}
            autoFocus
            className="h-11 flex-1 rounded-xl border border-stone-200 bg-white text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
          >
            {options.cancelLabel ?? "취소"}
          </button>

          <button
            type="button"
            onClick={accept}
            className={[
              "h-11 flex-1 rounded-xl text-sm font-semibold text-white transition",
              isDanger
                ? "bg-rose-500 hover:bg-rose-600"
                : "bg-emerald-600 hover:bg-emerald-700",
            ].join(" ")}
          >
            {options.confirmLabel ?? "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}
