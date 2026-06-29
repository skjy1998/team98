"use client";

import FinancePaymentsSection from "@/components/finance/FinancePaymentsSection";
import FinanceSettingsSection from "@/components/finance/FinanceSettingsSection";
import FinanceSummaryCard from "@/components/finance/FinanceSummaryCard";
import FinanceTabs from "@/components/finance/FinanceTabs";
import FinanceTransactionSection from "@/components/finance/FinanceTransactionSection";
import PageHeader from "@/components/PageHeader";
import { useFinanceEntries } from "@/hooks/useFinanceEntries";
import { useFinancePayments } from "@/hooks/useFinancePayments";
import { useFinanceSettings } from "@/hooks/useFinanceSettings";
import { useFinanceTransactions } from "@/hooks/useFinanceTransactions";
import { usePlayers } from "@/hooks/usePlayers";
import {
  getFinanceDefaults,
  getFinanceSummary,
  getFinanceTab,
  getPrimaryFeeAmount,
} from "@/lib/finance";
import type { FinanceTab } from "@/types/finance";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useMemo } from "react";

export default function FinancePage() {
  // 탭 / 라우팅
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = getFinanceTab(searchParams.get("tab"));

  // 원본 데이터
  const { entries, loaded, addEntry, updateEntry, deleteEntry } =
    useFinanceEntries();
  const { defaultMonth, defaultDate, defaultTime } = useMemo(
    () => getFinanceDefaults(),
    [],
  );
  const { players, playersLoaded } = usePlayers();
  const settings = useFinanceSettings();

  // 파생값
  const primaryFeeAmount = useMemo(
    () => getPrimaryFeeAmount(settings.feeTypes),
    [settings.feeTypes],
  );
  const financeSummary = useMemo(
    () => getFinanceSummary(entries, defaultMonth),
    [entries, defaultMonth],
  );

  // 기능 훅
  const payments = useFinancePayments({
    entries,
    players,
    defaultMonth,
    primaryFeeAmount,
    addEntry,
    deleteEntry,
  });
  const transactions = useFinanceTransactions({
    entries,
    currentMonth: payments.currentMonth,
    defaultDate,
    defaultTime,
    addEntry,
    updateEntry,
    deleteEntry,
  });

  // 핸들러
  const handleChangeTab = (tab: FinanceTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (!loaded || !playersLoaded || !settings.settingsLoaded) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="회비 관리"
          description="월별 회비 납부 현황과 기록을 관리하세요."
        />
        <div className="rounded-xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
          재정 데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="회비 관리"
        description="월별 회비 납부 현황과 기록을 관리하세요."
      />
      <FinanceSummaryCard
        totalBalance={financeSummary.totalBalance}
        totalIncome={financeSummary.totalIncome}
        totalExpense={financeSummary.totalExpense}
        monthlyFee={primaryFeeAmount}
      />
      <FinanceTabs activeTab={activeTab} onChangeTab={handleChangeTab} />
      <div className="space-y-6 pt-3">
        {activeTab === "transactions" && (
          <FinanceTransactionSection
            search={transactions.search}
            onChangeSearch={transactions.setSearch}
            entryFilter={transactions.entryFilter}
            onChangeEntryFilter={transactions.setEntryFilter}
            isEntryFormOpen={transactions.isEntryFormOpen}
            onToggleEntryForm={transactions.handleToggleEntryForm}
            createEntryType={transactions.createEntryType}
            onChangeCreateEntryType={transactions.setCreateEntryType}
            createEntryAmount={transactions.createEntryAmount}
            onChangeCreateEntryAmount={transactions.setCreateEntryAmount}
            createEntryDescription={transactions.createEntryDescription}
            onChangeCreateEntryDescription={
              transactions.setCreateEntryDescription
            }
            createEntryDate={transactions.createEntryDate}
            onChangeCreateEntryDate={transactions.setCreateEntryDate}
            createEntryTime={transactions.createEntryTime}
            onChangeCreateEntryTime={transactions.setCreateEntryTime}
            onSubmitCreateEntry={transactions.handleSubmitCreateEntry}
            editingEntryId={transactions.editingEntryId}
            editEntryType={transactions.editEntryType}
            onChangeEditEntryType={transactions.setEditEntryType}
            editEntryAmount={transactions.editEntryAmount}
            onChangeEditEntryAmount={transactions.setEditEntryAmount}
            editEntryDescription={transactions.editEntryDescription}
            onChangeEditEntryDescription={transactions.setEditEntryDescription}
            editEntryDate={transactions.editEntryDate}
            onChangeEditEntryDate={transactions.setEditEntryDate}
            editEntryTime={transactions.editEntryTime}
            onChangeEditEntryTime={transactions.setEditEntryTime}
            onSubmitEditEntry={transactions.handleSubmitEditEntry}
            onCancelEdit={transactions.handleCancelEdit}
            entries={transactions.filteredEntries}
            onStartEdit={transactions.handleStartEdit}
            onDeleteEntry={transactions.handleDeleteEntry}
            currentMonthLabel={payments.currentMonthLabel}
            onMoveMonth={payments.handleMoveMonth}
          />
        )}
        {activeTab === "payments" && (
          <FinancePaymentsSection
            currentMonthLabel={payments.currentMonthLabel}
            onMoveMonth={payments.handleMoveMonth}
            paymentSummary={payments.paymentSummary}
            unpaidPaymentRows={payments.unpaidPaymentRows}
            paidPaymentRows={payments.paidPaymentRows}
            isUnpaidOpen={payments.isUnpaidOpen}
            onToggleUnpaid={payments.handleToggleUnpaid}
            isPaidOpen={payments.isPaidOpen}
            onTogglePaid={payments.handleTogglePaid}
            onChangePaymentStatus={payments.handleChangePaymentStatus}
          />
        )}
        {activeTab === "settings" && (
          <FinanceSettingsSection
            dueDay={settings.dueDay}
            feeTypes={settings.feeTypes}
            fineRules={settings.fineRules}
            onChangeDueDay={settings.handleChangeDueDay}
            onAddFeeType={settings.handleAddFeeType}
            onUpdateFeeType={settings.handleUpdateFeeType}
            onDeleteFeeType={settings.handleDeleteFeeType}
            onAddFineRule={settings.handleAddFineRule}
            onUpdateFineRule={settings.handleUpdateFineRule}
            onDeleteFineRule={settings.handleDeleteFineRule}
          />
        )}
      </div>
    </div>
  );
}
