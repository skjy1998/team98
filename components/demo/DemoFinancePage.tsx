"use client";

import PageHeader from "@/components/PageHeader";
import FinanceSummaryCard from "@/components/finance/FinanceSummaryCard";
import FinanceTabs from "@/components/finance/FinanceTabs";
import FinanceFineSection from "@/components/finance/fines/FinanceFineSection";
import FinancePaymentsSection from "@/components/finance/payments/FinancePaymentsSection";
import FinanceSettingsSection from "@/components/finance/settings/FinanceSettingsSection";
import FinanceTransactionSection from "@/components/finance/transactions/FinanceTransactionSection";
import { useDemoFinanceStore } from "@/components/demo/DemoFinanceProvider";
import { useFinancePayments } from "@/hooks/finance/useFinancePayments";
import { useFinanceSectionStates } from "@/hooks/finance/useFinanceSectionStates";
import { useFinanceTransactions } from "@/hooks/finance/useFinanceTransactions";
import { getFinanceSummary } from "@/lib/finance/finance";
import type { FinanceTab } from "@/types/finance";
import { useState } from "react";

const demoMonth = "2026-09";

export default function DemoFinancePage() {
  const [activeTab, setActiveTab] = useState<FinanceTab>("transactions");
  const finance = useDemoFinanceStore();

  const payments = useFinancePayments({
    entries: finance.entries,
    players: finance.players,
    defaultMonth: demoMonth,
    feeTypes: finance.feeTypes,
    addEntry: finance.addEntry,
    deleteEntry: finance.deleteEntry,
  });

  const transactions = useFinanceTransactions({
    entries: finance.entries,
    currentMonth: payments.currentMonth,
    defaultDate: `${demoMonth}-30`,
    defaultTime: "12:00",
    addEntry: finance.addEntry,
    updateEntry: finance.updateEntry,
    deleteEntry: finance.deleteEntry,
  });

  const settings = {
    dueDay: finance.dueDay,
    feeTypes: finance.feeTypes,
    fineRules: finance.fineRules,
    settingsLoaded: true,
    settingsError: "",
    handleChangeDueDay: finance.handleChangeDueDay,
    handleAddFeeType: finance.handleAddFeeType,
    handleUpdateFeeType: finance.handleUpdateFeeType,
    handleDeleteFeeType: finance.handleDeleteFeeType,
    handleAddFineRule: finance.handleAddFineRule,
    handleDeleteFineRule: finance.handleDeleteFineRule,
    reloadSettings: async () => {},
  };

  const sectionStates = useFinanceSectionStates({
    canManage: true,
    payments,
    transactions,
    pageData: {
      players: finance.players,
      matches: finance.matches,
      votes: finance.votes,
      attendance: finance.attendance,
      fineCharges: finance.fineCharges,
      settings,
      createFineCharges: finance.createFineCharges,
      deleteFineCharge: finance.deleteFineCharge,
      handleChangeFineChargeStatus: finance.handleChangeFineChargeStatus,
    },
  });

  const summary = getFinanceSummary(finance.entries, demoMonth);

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="회비 관리"
        description="월별 회비 납부 현황과 기록을 관리하세요."
      />

      <FinanceSummaryCard
        totalBalance={summary.totalBalance}
        totalIncome={summary.totalIncome}
        totalExpense={summary.totalExpense}
        feeTypeCount={finance.feeTypes.length}
      />

      <FinanceTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      <div className="space-y-4 pt-1 sm:space-y-6 sm:pt-3">
        {activeTab === "transactions" && (
          <FinanceTransactionSection
            toolbarState={sectionStates.transactionToolbarState}
            createState={sectionStates.transactionCreateState}
            editState={sectionStates.transactionEditState}
            listState={sectionStates.transactionListState}
          />
        )}

        {activeTab === "payments" && (
          <FinancePaymentsSection
            canManage
            headerState={sectionStates.paymentsHeaderState}
            paymentSummary={payments.paymentSummary}
            unpaidGroupState={sectionStates.unpaidPaymentGroupState}
            paidGroupState={sectionStates.paidPaymentGroupState}
            unconfiguredGroupState={sectionStates.unconfiguredPaymentGroupState}
            onChangePaymentStatus={payments.handleChangePaymentStatus}
            onBulkMarkPaid={payments.handleBulkMarkPaid}
          />
        )}

        {activeTab === "fines" && (
          <FinanceFineSection {...sectionStates.fineSectionState} />
        )}

        {activeTab === "settings" && (
          <FinanceSettingsSection {...sectionStates.settingsSectionState} />
        )}
      </div>
    </div>
  );
}
