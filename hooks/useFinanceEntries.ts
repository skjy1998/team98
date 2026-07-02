import { FinanceEntry } from "@/types/finance";
import { useEffect, useState } from "react";

const DEFAULT_ENTRIES: FinanceEntry[] = [];

export function useFinanceEntries() {
  const [entries, setEntries] = useState<FinanceEntry[]>(DEFAULT_ENTRIES);
  const [entriesLoaded, setEntriesLoaded] = useState(false);

  useEffect(() => {
    const savedEntries = localStorage.getItem("finance-entries");

    if (savedEntries && savedEntries !== "undefined") {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEntries(JSON.parse(savedEntries));
      } catch {
        localStorage.removeItem("finance-entries");
      }
    }
    setEntriesLoaded(true);
  }, []);

  useEffect(() => {
    if (!entriesLoaded) return;
    localStorage.setItem("finance-entries", JSON.stringify(entries));
  }, [entries, entriesLoaded]);

  const addEntry = (entry: Omit<FinanceEntry, "id">) => {
    const nextEntry: FinanceEntry = {
      id: crypto.randomUUID(),
      ...entry,
    };
    setEntries((prev) => [nextEntry, ...prev]);
  };

  const updateEntry = (entryId: string, updates: Omit<FinanceEntry, "id">) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId ? { ...entry, ...updates } : entry,
      ),
    );
  };

  const deleteEntry = (entryId: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  };

  return {
    entries,
    entriesLoaded,
    addEntry,
    updateEntry,
    deleteEntry,
    setEntries,
  };
}
