import type {
  FinanceEntry,
  FinanceEntryFilter,
  FinanceEntryType,
} from "@/types/finance";

interface FinanceEntryFormValue {
  type: FinanceEntryType;
  amount: string;
  description: string;
  date: string;
  time: string;
}

export function getFilteredFinanceEntries(
  entries: FinanceEntry[],
  currentMonth: string,
  search: string,
  entryFilter: FinanceEntryFilter,
) {
  const normalizedSearch = search.trim().toLocaleLowerCase("ko");

  return entries.filter((entry) => {
    const matchesMonth = entry.date.startsWith(currentMonth);
    const matchesSearch = entry.description
      .toLocaleLowerCase("ko")
      .includes(normalizedSearch);
    const matchesType = entryFilter === "all" || entry.type === entryFilter;

    return matchesMonth && matchesSearch && matchesType;
  });
}

export function getFinanceEntryFromForm({
  type,
  amount,
  description,
  date,
  time,
}: Readonly<FinanceEntryFormValue>): Omit<FinanceEntry, "id"> | null {
  const normalizedAmount = Number(amount);
  const normalizedDescription = description.trim();

  if (
    !amount.trim() ||
    !normalizedDescription ||
    !Number.isFinite(normalizedAmount) ||
    normalizedAmount <= 0
  ) {
    return null;
  }

  return {
    type,
    amount: normalizedAmount,
    description: normalizedDescription,
    date,
    time,
  };
}
