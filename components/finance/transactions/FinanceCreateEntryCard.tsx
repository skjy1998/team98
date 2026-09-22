import type { FinanceCreateEntryState } from "@/types/finance-ui";
import FinanceEntryForm from "./FinanceEntryForm";

interface FinanceCreateEntryCardProps {
  createState: FinanceCreateEntryState;
}

export default function FinanceCreateEntryCard({
  createState,
}: Readonly<FinanceCreateEntryCardProps>) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="px-3.5 py-3 sm:px-5 sm:py-4">
        <span className="text-sm font-semibold text-stone-900 sm:text-base">
          수기 입력
        </span>
      </div>

      <FinanceEntryForm
        className="border-t border-stone-200 px-3.5 py-3.5 sm:px-5 sm:py-5"
        entryType={createState.createEntryType}
        onChangeEntryType={createState.onChangeCreateEntryType}
        entryAmount={createState.createEntryAmount}
        onChangeEntryAmount={createState.onChangeCreateEntryAmount}
        entryDescription={createState.createEntryDescription}
        onChangeEntryDescription={createState.onChangeCreateEntryDescription}
        entryDate={createState.createEntryDate}
        onChangeEntryDate={createState.onChangeCreateEntryDate}
        entryTime={createState.createEntryTime}
        onChangeEntryTime={createState.onChangeCreateEntryTime}
        onSubmit={createState.onSubmitCreateEntry}
        submitLabel="거래 추가"
      />
    </div>
  );
}
