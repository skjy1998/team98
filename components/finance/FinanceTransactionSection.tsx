import FinanceCreateEntryCard from "./FinanceCreateEntryCard";
import FinanceTransactionList from "./FinanceTransactionList";
import FinanceTransactionToolbar from "./FinanceTransactionToolbar";
import FinanceReadonlyNotice from "./FinanceReadonlyNotice";
import FinanceEmptyState from "./FinanceEmptyState";
import type {
  FinanceCreateEntryState,
  FinanceTransactionEditState,
  FinanceTransactionListState,
  FinanceTransactionToolbarState,
} from "@/types/finance-ui";

interface FinanceTransactionSectionProps {
  toolbarState: FinanceTransactionToolbarState;
  createState: FinanceCreateEntryState;
  editState: FinanceTransactionEditState;
  listState: FinanceTransactionListState;
}

export default function FinanceTransactionSection({
  toolbarState,
  createState,
  editState,
  listState,
}: Readonly<FinanceTransactionSectionProps>) {
  return (
    <>
      <FinanceTransactionToolbar {...toolbarState} />

      {toolbarState.canManage && toolbarState.isEntryFormOpen && (
        <FinanceCreateEntryCard createState={createState} />
      )}
      {!toolbarState.canManage && (
        <FinanceReadonlyNotice message="거래 내역은 조회할 수 있고, 추가/수정/삭제는 운영진만 할 수 있어요." />
      )}

      {listState.entries.length === 0 ? (
        <FinanceEmptyState message="이번 달 거래 내역이 없어요." />
      ) : (
        <FinanceTransactionList
          canManage={toolbarState.canManage}
          editState={editState}
          listState={listState}
        />
      )}
    </>
  );
}
