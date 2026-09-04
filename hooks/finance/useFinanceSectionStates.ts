import type { useFinancePageData } from "./useFinancePageData";
import type { useFinancePayments } from "./useFinancePayments";
import type { useFinanceTransactions } from "./useFinanceTransactions";

type FinanceSectionPageData = Pick<
  ReturnType<typeof useFinancePageData>,
  | "players"
  | "matches"
  | "votes"
  | "attendance"
  | "fineCharges"
  | "settings"
  | "createFineCharges"
  | "deleteFineCharge"
  | "handleChangeFineChargeStatus"
>;

interface UseFinanceSectionStatesParams {
  canManage: boolean;
  payments: ReturnType<typeof useFinancePayments>;
  transactions: ReturnType<typeof useFinanceTransactions>;
  pageData: FinanceSectionPageData;
}

export function useFinanceSectionStates({
  canManage,
  payments,
  transactions,
  pageData,
}: Readonly<UseFinanceSectionStatesParams>) {
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

  const fineSectionState = {
    fineCharges: pageData.fineCharges,
    canManage,
    matches: pageData.matches,
    players: pageData.players,
    votes: pageData.votes,
    attendance: pageData.attendance,
    fineRules: pageData.settings.fineRules,
    createFineCharges: pageData.createFineCharges,
    deleteFineCharge: pageData.deleteFineCharge,
    onChangeFineChargeStatus: pageData.handleChangeFineChargeStatus,
  };

  const settingsSectionState = {
    canManage,
    dueDay: pageData.settings.dueDay,
    feeTypes: pageData.settings.feeTypes,
    fineRules: pageData.settings.fineRules,
    onChangeDueDay: pageData.settings.handleChangeDueDay,
    onAddFeeType: pageData.settings.handleAddFeeType,
    onUpdateFeeType: pageData.settings.handleUpdateFeeType,
    onDeleteFeeType: pageData.settings.handleDeleteFeeType,
    onAddFineRule: pageData.settings.handleAddFineRule,
    onDeleteFineRule: pageData.settings.handleDeleteFineRule,
  };

  return {
    transactionToolbarState,
    transactionCreateState,
    transactionEditState,
    transactionListState,
    paymentsHeaderState,
    unpaidPaymentGroupState,
    paidPaymentGroupState,
    fineSectionState,
    settingsSectionState,
  };
}
