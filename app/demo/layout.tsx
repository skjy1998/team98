import DemoAppShell from "@/components/demo/DemoAppShell";
import { DemoFinanceProvider } from "@/components/demo/DemoFinanceProvider";
import { DemoModeProvider } from "@/components/demo/DemoModeProvider";
import type { ReactNode } from "react";

export default function DemoLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <DemoModeProvider>
      <DemoFinanceProvider>
        <DemoAppShell>{children}</DemoAppShell>
      </DemoFinanceProvider>
    </DemoModeProvider>
  );
}
