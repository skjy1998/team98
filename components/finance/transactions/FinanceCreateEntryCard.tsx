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
      <div className="px-5 py-4">
        <span className="text-base font-semibold text-stone-900">
          수기 입력
        </span>
      </div>

      <FinanceEntryForm
        className="border-t border-stone-200 px-5 py-5"
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
