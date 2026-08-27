import { useEffect, useEffectEvent } from "react";

export function useEscapeKey(onEscape: () => void, enabled = true) {
  const handleEscape = useEffectEvent(onEscape);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleEscape();
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);
}
