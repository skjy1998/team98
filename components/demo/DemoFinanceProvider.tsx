"use client";

import { useDemoFinanceData } from "@/hooks/demo/useDemoFinanceData";
import { createContext, type ReactNode, useContext } from "react";

type DemoFinanceContextValue = ReturnType<typeof useDemoFinanceData>;

const DemoFinanceContext = createContext<DemoFinanceContextValue | null>(null);

export function DemoFinanceProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const financeData = useDemoFinanceData();

  return (
    <DemoFinanceContext.Provider value={financeData}>
      {children}
    </DemoFinanceContext.Provider>
  );
}

export function useDemoFinanceStore() {
  const financeData = useContext(DemoFinanceContext);

  if (!financeData) {
    throw new Error(
      "useDemoFinanceStore must be used within DemoFinanceProvider.",
    );
  }

  return financeData;
}
