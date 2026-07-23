import type { Metadata } from "next";
import FinancePageClient from "@/components/finance/FinancePageClient";

export const metadata: Metadata = {
  title: "회비 관리 | SquadFlow",
  description: "월별 회비 납부 현황과 거래 기록을 관리하세요.",
};

export default function FinancePage() {
  return <FinancePageClient />;
}
