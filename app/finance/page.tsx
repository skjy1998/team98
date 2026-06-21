"use client";

import FinancePaymentsSection from "@/components/finance/FinancePaymentsSection";
import FinanceSettingsSection from "@/components/finance/FinanceSettingsSection";
import FinanceSummaryCard from "@/components/finance/FinanceSummaryCard";
import FinanceTabs from "@/components/finance/FinanceTabs";
import FinanceTransactionSection from "@/components/finance/FinanceTransactionSection";
import PageHeader from "@/components/PageHeader";
import { useFinanceEntries } from "@/hooks/useFinanceEntries";
import { usePlayers } from "@/hooks/usePlayers";
import {
  getCurrentMonthLabel,
  getFinanceDefaults,
  getFinanceSummary,
  getMonthlyPaymentEntries,
  getPaymentStatusRows,
  getPaymentSummary,
} from "@/lib/finance";
import type {
  FinanceEntry,
  FinanceEntryType,
  FinanceTab,
  FineRule,
} from "@/types/finance";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useEffect, useMemo, useState } from "react";

export default function FinancePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTabParam = searchParams.get("tab");
  const activeTab: FinanceTab =
    activeTabParam === "transactions" ||
    activeTabParam === "payments" ||
    activeTabParam === "settings"
      ? activeTabParam
      : "transactions";

  const { entries, loaded, addEntry, updateEntry, deleteEntry } =
    useFinanceEntries();
  const { defaultMonth, defaultDate, defaultTime } = useMemo(
    () => getFinanceDefaults(),
    [],
  );
  const { players, loaded: playersLoaded } = usePlayers();

  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);
  const [entryType, setEntryType] = useState<FinanceEntryType>("income");
  const [entryAmount, setEntryAmount] = useState("");
  const [entryDescription, setEntryDescription] = useState("");
  const [entryDate, setEntryDate] = useState(defaultDate);
  const [entryTime, setEntryTime] = useState(defaultTime);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [entryFilter, setEntryFilter] = useState<"all" | FinanceEntryType>(
    "all",
  );

  // 월 이동 상태
  const [currentMonth, setCurrentMonth] = useState(defaultMonth);

  const [isUnpaidOpen, setIsUnpaidOpen] = useState(false);
  const [isPaidOpen, setIsPaidOpen] = useState(false);

  const [feeTypes, setFeeTypes] = useState<
    { id: string; name: string; description: string; amount: number }[]
  >([]);

  const [dueDay, setDueDay] = useState(1);

  const [fineRules, setFineRules] = useState<FineRule[]>([]);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("finance-settings");

    if (savedSettings && savedSettings !== "undefined") {
      try {
        const parsed = JSON.parse(savedSettings);

        if (Array.isArray(parsed.feeTypes)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setFeeTypes(parsed.feeTypes);
        }

        if (typeof parsed.dueDay === "number") {
          setDueDay(parsed.dueDay);
        }
        if (Array.isArray(parsed.fineRules)) {
          setFineRules(parsed.fineRules);
        }
      } catch {
        localStorage.removeItem("finance-settings");
      }
    }
    setSettingsLoaded(true);
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;

    localStorage.setItem(
      "finance-settings",
      JSON.stringify({
        feeTypes,
        dueDay,
        fineRules,
      }),
    );
  }, [feeTypes, dueDay, fineRules, settingsLoaded]);

  // 화면용 월 문자열
  const currentMonthLabel = useMemo(
    () => getCurrentMonthLabel(currentMonth),
    [currentMonth],
  );

  const thisMonth = defaultMonth;

  const financeSummary = useMemo(
    () => getFinanceSummary(entries, thisMonth),
    [entries, thisMonth],
  );

  // 이번 달 회비 납부 기록 목록
  const monthlyPaymentEntries = useMemo(
    () => getMonthlyPaymentEntries(entries, currentMonth),
    [entries, currentMonth],
  );

  // 선수 별 납부 상태 status === paid 면 납부완료
  const paymentStatusRows = useMemo(
    () => getPaymentStatusRows(players, monthlyPaymentEntries),
    [players, monthlyPaymentEntries],
  );

  // 통계값 만들기
  const paymentSummary = useMemo(
    () => getPaymentSummary(paymentStatusRows),
    [paymentStatusRows],
  );

  const primaryFeeAmount = useMemo(() => {
    const generalFee =
      feeTypes.find((feeType) => feeType.name.includes("일반")) ?? feeTypes[0];

    return generalFee?.amount ?? 0;
  }, [feeTypes]);

  const handleChangeTab = (tab: FinanceTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSubmitEntry = () => {
    if (
      !entryDescription.trim() ||
      !entryAmount.trim() ||
      Number(entryAmount) <= 0
    ) {
      return;
    }

    if (editingEntryId) {
      updateEntry(editingEntryId, {
        type: entryType,
        amount: Number(entryAmount),
        description: entryDescription.trim(),
        date: entryDate,
        time: entryTime,
      });

      handleCancelEdit();
      return;
    }

    addEntry({
      type: entryType,
      amount: Number(entryAmount),
      description: entryDescription.trim(),
      date: entryDate,
      time: entryTime,
    });

    handleCancelEdit();
    setIsEntryFormOpen(false);
  };

  const handleStartEdit = (entry: FinanceEntry) => {
    setEditingEntryId(entry.id);
    setEntryType(entry.type);
    setEntryAmount(String(entry.amount));
    setEntryDescription(entry.description);
    setEntryDate(entry.date);
    setEntryTime(entry.time);
  };

  const handleCancelEdit = () => {
    setEditingEntryId(null);
    setEntryType("income");
    setEntryAmount("");
    setEntryDescription("");
    setEntryDate(defaultDate);
    setEntryTime(defaultTime);
    setIsEntryFormOpen(false);
  };

  const handleDeleteEntry = (entryId: string) => {
    const confirmed = globalThis.confirm("이 내역을 삭제할까요?");
    if (!confirmed) return;

    deleteEntry(entryId);
  };

  // 월 이동 함수
  const handleMoveMonth = (direction: "prev" | "next") => {
    const [year, month] = currentMonth.split("-").map(Number);

    const nextDate =
      direction === "prev"
        ? new Date(year, month - 2, 1)
        : new Date(year, month, 1);
    const nextYear = nextDate.getFullYear();
    const nextMonth = String(nextDate.getMonth() + 1).padStart(2, "0");

    setCurrentMonth(`${nextYear}-${nextMonth}`);
  };

  const handleChangePaymentStatus = (
    playerName: string,
    nextStatus: "paid" | "unpaid",
  ) => {
    const existingPaymentEntry = monthlyPaymentEntries.find((entry) =>
      entry.description.includes(playerName),
    );

    if (nextStatus === "paid" && !existingPaymentEntry) {
      const now = new Date();

      const currentTime = now.toTimeString().slice(0, 5);

      addEntry({
        type: "income",
        amount: primaryFeeAmount,
        description: `${currentMonth} 회비 (${playerName})`,
        date: `${currentMonth}-01`,
        time: currentTime,
      });

      return;
    }

    if (nextStatus === "unpaid" && existingPaymentEntry) {
      deleteEntry(existingPaymentEntry.id);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesMonth = entry.date.startsWith(currentMonth);
    const matchesSearch = entry.description
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = entryFilter === "all" || entry.type === entryFilter;

    return matchesMonth && matchesSearch && matchesFilter;
  });

  const unpaidPaymentRows = paymentStatusRows.filter(
    (row) => row.status === "unpaid",
  );

  const paidPaymentRows = paymentStatusRows.filter(
    (row) => row.status === "paid",
  );

  if (!loaded || !playersLoaded) {
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
            search={search}
            onChangeSearch={setSearch}
            entryFilter={entryFilter}
            onChangeEntryFilter={setEntryFilter}
            isEntryFormOpen={isEntryFormOpen}
            onToggleEntryForm={() => {
              setEditingEntryId(null);
              setIsEntryFormOpen((prev) => !prev);
            }}
            entryType={entryType}
            onChangeEntryType={setEntryType}
            entryAmount={entryAmount}
            onChangeEntryAmount={setEntryAmount}
            entryDescription={entryDescription}
            onChangeEntryDescription={setEntryDescription}
            entryDate={entryDate}
            onChangeEntryDate={setEntryDate}
            entryTime={entryTime}
            onChangeEntryTime={setEntryTime}
            editingEntryId={editingEntryId}
            entries={filteredEntries}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
            onSubmitEntry={handleSubmitEntry}
            onDeleteEntry={handleDeleteEntry}
            currentMonthLabel={currentMonthLabel}
            onMoveMonth={handleMoveMonth}
          />
        )}
        {activeTab === "payments" && (
          <FinancePaymentsSection
            currentMonthLabel={currentMonthLabel}
            onMoveMonth={handleMoveMonth}
            paymentSummary={paymentSummary}
            unpaidPaymentRows={unpaidPaymentRows}
            paidPaymentRows={paidPaymentRows}
            isUnpaidOpen={isUnpaidOpen}
            onToggleUnpaid={() => setIsUnpaidOpen((prev) => !prev)}
            isPaidOpen={isPaidOpen}
            onTogglePaid={() => setIsPaidOpen((prev) => !prev)}
            onChangePaymentStatus={handleChangePaymentStatus}
          />
        )}
        {activeTab === "settings" && (
          <FinanceSettingsSection
            dueDay={dueDay}
            setDueDay={setDueDay}
            feeTypes={feeTypes}
            setFeeTypes={setFeeTypes}
            fineRules={fineRules}
            setFineRules={setFineRules}
          />
        )}
      </div>
    </div>
  );
}
