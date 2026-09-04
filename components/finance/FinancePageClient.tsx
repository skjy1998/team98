"use client";

import FinancePaymentsSection from "@/components/finance/payments/FinancePaymentsSection";
import FinanceSettingsSection from "@/components/finance/settings/FinanceSettingsSection";
import FinanceSummaryCard from "@/components/finance/FinanceSummaryCard";
import FinanceTabs from "@/components/finance/FinanceTabs";
import FinanceTransactionSection from "@/components/finance/transactions/FinanceTransactionSection";
import PageHeader from "@/components/PageHeader";
import { getFinanceTab } from "@/lib/finance/finance";
import type { FinanceTab } from "@/types/finance";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FinanceFineSection from "./fines/FinanceFineSection";
import ContentState from "../common/ContentState";
import { useFinancePageData } from "@/hooks/finance/useFinancePageData";
import { useFinanceSectionStates } from "@/hooks/finance/useFinanceSectionStates";

export default function FinancePageClient() {
  // 탭 / 라우팅
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = getFinanceTab(searchParams.get("tab"));

  const pageData = useFinancePageData();

  const {
    canManage,
    financeSummary,
    primaryFeeAmount,
    payments,
    transactions,
    isLoaded,
    pageError,
    reloadPageData,
  } = pageData;

  const {
    transactionToolbarState,
    transactionCreateState,
    transactionEditState,
    transactionListState,
    paymentsHeaderState,
    unpaidPaymentGroupState,
    paidPaymentGroupState,
    fineSectionState,
    settingsSectionState,
  } = useFinanceSectionStates({
    canManage,
    payments,
    transactions,
    pageData,
  });

  // 핸들러
  const handleChangeTab = (tab: FinanceTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="회비 관리"
          description="월별 회비 납부 현황과 기록을 관리하세요."
        />
        <ContentState
          variant="loading"
          title="재정 데이터를 불러오는 중..."
          description="회비 납부 현황과 거래 내역을 준비하고 있어요."
        />
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="회비 관리"
          description="월별 회비 납부 현황과 기록을 관리하세요."
        />
        <ContentState
          variant="error"
          title="재정 데이터를 불러오지 못했어요."
          description={pageError}
          action={
            <button
              type="button"
              onClick={reloadPageData}
              className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              다시 시도
            </button>
          }
        />
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
            onBulkMarkPaid={payments.handleBulkMarkPaid}
          />
        )}
        {activeTab === "fines" && <FinanceFineSection {...fineSectionState} />}
        {activeTab === "settings" && (
          <FinanceSettingsSection {...settingsSectionState} />
        )}
      </div>
    </div>
  );
}
