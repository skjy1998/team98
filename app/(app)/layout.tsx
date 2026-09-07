import AppAccessBoundary from "@/components/layout/AppAccessBoundary";
import type { ReactNode } from "react";

export default function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AppAccessBoundary>{children}</AppAccessBoundary>;
}
