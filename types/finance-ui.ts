import type {
  FeeType,
  FinanceEntry,
  FinanceEntryFilter,
  FinanceEntryType,
  FineRule,
  PaymentStatusRow,
  PaymentSummary,
} from "./finance";

export interface FinanceTransactionToolbarState {
  canManage: boolean;
  search: string;
  onChangeSearch: (value: string) => void;
  entryFilter: FinanceEntryFilter;
  onChangeEntryFilter: (value: FinanceEntryFilter) => void;
  currentMonthLabel: string;
  onMoveMonth: (direction: "prev" | "next") => void;
  isEntryFormOpen: boolean;
  onToggleEntryForm: () => void;
}

export interface FinanceCreateEntryState {
  createEntryType: FinanceEntryType;
  onChangeCreateEntryType: (value: FinanceEntryType) => void;
  createEntryAmount: string;
  onChangeCreateEntryAmount: (value: string) => void;
  createEntryDescription: string;
  onChangeCreateEntryDescription: (value: string) => void;
  createEntryDate: string;
  onChangeCreateEntryDate: (value: string) => void;
  createEntryTime: string;
  onChangeCreateEntryTime: (value: string) => void;
  onSubmitCreateEntry: () => void;
}

export interface FinanceTransactionEditState {
  editingEntryId: string | null;
  editEntryType: FinanceEntryType;
  onChangeEditEntryType: (value: FinanceEntryType) => void;
  editEntryAmount: string;
  onChangeEditEntryAmount: (value: string) => void;
  editEntryDescription: string;
  onChangeEditEntryDescription: (value: string) => void;
  editEntryDate: string;
  onChangeEditEntryDate: (value: string) => void;
  editEntryTime: string;
  onChangeEditEntryTime: (value: string) => void;
  onSubmitEditEntry: () => void;
  onCancelEdit: () => void;
}

export interface FinanceTransactionListState {
  entries: FinanceEntry[];
  onStartEdit: (entry: FinanceEntry) => void;
  onDeleteEntry: (entryId: string) => void;
}

export interface FinancePaymentsHeaderState {
  currentMonthLabel: string;
  onMoveMonth: (direction: "prev" | "next") => void;
}

export interface FinancePaymentStatusGroupState {
  title: string;
  count: number;
  tone: "paid" | "unpaid";
  isOpen: boolean;
  onToggle: () => void;
  rows: PaymentStatusRow[];
}

export interface FinancePaymentsSectionProps {
  canManage: boolean;
  headerState: FinancePaymentsHeaderState;
  paymentSummary: PaymentSummary;
  unpaidGroupState: FinancePaymentStatusGroupState;
  paidGroupState: FinancePaymentStatusGroupState;
  onChangePaymentStatus: (
    playerName: string,
    nextStatus: "paid" | "unpaid",
  ) => void;
}

export interface FinanceReadonlyNoticeProps {
  message: string;
}

export interface FinanceEmptyStateProps {
  message: string;
}

export interface FinanceDueDayState {
  dueDay: string;
  onChangeDueDay: (value: string) => void;
}

export interface FinanceCreateFeeTypeState {
  isAddingFeeType: boolean;
  onOpenAddFeeType: () => void;
  feeTypeName: string;
  onChangeFeeTypeName: (value: string) => void;
  feeTypeDescription: string;
  onChangeFeeTypeDescription: (value: string) => void;
  feeTypeAmount: number;
  onChangeFeeTypeAmount: (value: number) => void;
  onCancelFeeType: () => void;
  onSaveFeeType: () => void;
}

export interface FinanceEditFeeTypeState {
  editingFeeTypeId: string | null;
  editingFeeName: string;
  editingFeeDescription: string;
  editingFeeAmount: string;
  onChangeEditingFeeName: (value: string) => void;
  onChangeEditingFeeDescription: (value: string) => void;
  onChangeEditingFeeAmount: (value: string) => void;
  onStartEditFeeType: (feeType: FeeType) => void;
  onSaveEditFeeType: () => void;
  onCancelEditFeeType: () => void;
  onDeleteFeeType: (feeTypeId: string) => void;
}

export interface FinanceCreateFineRuleState {
  isAddingFineRule: boolean;
  onOpenAddFineRule: () => void;
  fineRuleName: string;
  onChangeFineRuleName: (value: string) => void;
  fineRuleTrigger: FineRule["trigger"];
  onChangeFineRuleTrigger: (value: FineRule["trigger"]) => void;
  fineRuleAmount: number;
  onChangeFineRuleAmount: (value: number) => void;
  onCancelFineRule: () => void;
  onSaveFineRule: () => Promise<void>;
}

export interface FinanceFineRuleListState {
  fineRules: FineRule[];
  fineTriggerLabel: Record<string, string>;
  onDeleteFineRule: (ruleId: string) => void;
}
