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
import { usePlayers } from "@/hooks/players/usePlayers";
import {
  getFinanceDefaults,
  getFinanceSummary,
  getFinanceTab,
  getPrimaryFeeAmount,
} from "@/lib/finance";
import type { FinanceTab } from "@/types/finance";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useCurrentTeamMember } from "@/hooks/useCurrentTeamMember";

export default function FinancePageClient() {
  // 탭 / 라우팅
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = getFinanceTab(searchParams.get("tab"));

  // 원본 데이터
  const { entries, entriesLoaded, addEntry, updateEntry, deleteEntry } =
    useFinanceEntries();
  const { defaultMonth, defaultDate, defaultTime } = useMemo(
    () => getFinanceDefaults(),
    [],
  );
  const { players, playersLoaded } = usePlayers();
  const settings = useFinanceSettings();
  const { canManage, memberLoaded } = useCurrentTeamMember();

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

  const transactionToolbarState = {
    canManage,
    search: transactions.search,
    onChangeSearch: transactions.setSearch,
    entryFilter: transactions.entryFilter,
    onChangeEntryFilter: transactions.setEntryFilter,
    currentMonthLabel: payments.currentMonthLabel,
    onMoveMonth: payments.handleMoveMonth,
    isEntryFormOpen: transactions.isEntryFormOpen,
    onToggleEntryForm: transactions.handleToggleEntryForm,
  };

  const transactionCreateState = {
    createEntryType: transactions.createEntryType,
    onChangeCreateEntryType: transactions.setCreateEntryType,
    createEntryAmount: transactions.createEntryAmount,
    onChangeCreateEntryAmount: transactions.setCreateEntryAmount,
    createEntryDescription: transactions.createEntryDescription,
    onChangeCreateEntryDescription: transactions.setCreateEntryDescription,
    createEntryDate: transactions.createEntryDate,
    onChangeCreateEntryDate: transactions.setCreateEntryDate,
    createEntryTime: transactions.createEntryTime,
    onChangeCreateEntryTime: transactions.setCreateEntryTime,
    onSubmitCreateEntry: transactions.handleSubmitCreateEntry,
  };

  const transactionEditState = {
    editingEntryId: transactions.editingEntryId,
    editEntryType: transactions.editEntryType,
    onChangeEditEntryType: transactions.setEditEntryType,
    editEntryAmount: transactions.editEntryAmount,
    onChangeEditEntryAmount: transactions.setEditEntryAmount,
    editEntryDescription: transactions.editEntryDescription,
    onChangeEditEntryDescription: transactions.setEditEntryDescription,
    editEntryDate: transactions.editEntryDate,
    onChangeEditEntryDate: transactions.setEditEntryDate,
    editEntryTime: transactions.editEntryTime,
    onChangeEditEntryTime: transactions.setEditEntryTime,
    onSubmitEditEntry: transactions.handleSubmitEditEntry,
    onCancelEdit: transactions.handleCancelEdit,
  };

  const transactionListState = {
    entries: transactions.filteredEntries,
    onStartEdit: transactions.handleStartEdit,
    onDeleteEntry: transactions.handleDeleteEntry,
  };

  const paymentsHeaderState = {
    currentMonthLabel: payments.currentMonthLabel,
    onMoveMonth: payments.handleMoveMonth,
  };

  const unpaidPaymentGroupState = {
    title: "미납",
    count: payments.paymentSummary.unpaidCount,
    tone: "unpaid" as const,
    isOpen: payments.isUnpaidOpen,
    onToggle: payments.handleToggleUnpaid,
    rows: payments.unpaidPaymentRows,
  };

  const paidPaymentGroupState = {
    title: "납부 완료",
    count: payments.paymentSummary.paidCount,
    tone: "paid" as const,
    isOpen: payments.isPaidOpen,
    onToggle: payments.handleTogglePaid,
    rows: payments.paidPaymentRows,
  };

  if (
    !entriesLoaded ||
    !playersLoaded ||
    !settings.settingsLoaded ||
    !memberLoaded
  ) {
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
            toolbarState={transactionToolbarState}
            createState={transactionCreateState}
            editState={transactionEditState}
            listState={transactionListState}
          />
        )}
        {activeTab === "payments" && (
          <FinancePaymentsSection
            canManage={canManage}
            headerState={paymentsHeaderState}
            paymentSummary={payments.paymentSummary}
            unpaidGroupState={unpaidPaymentGroupState}
            paidGroupState={paidPaymentGroupState}
            onChangePaymentStatus={payments.handleChangePaymentStatus}
          />
        )}
        {activeTab === "settings" && (
          <FinanceSettingsSection
            canManage={canManage}
            dueDay={settings.dueDay}
            feeTypes={settings.feeTypes}
            fineRules={settings.fineRules}
            onChangeDueDay={settings.handleChangeDueDay}
            onAddFeeType={settings.handleAddFeeType}
            onUpdateFeeType={settings.handleUpdateFeeType}
            onDeleteFeeType={settings.handleDeleteFeeType}
            onAddFineRule={settings.handleAddFineRule}
            onDeleteFineRule={settings.handleDeleteFineRule}
          />
        )}
      </div>
    </div>
  );
}
