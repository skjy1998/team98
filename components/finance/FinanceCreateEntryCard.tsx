import type { FinanceEntryType } from "@/types/finance";
import FinanceEntryForm from "./FinanceEntryForm";

interface FinanceCreateEntryCardProps {
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

export default function FinanceCreateEntryCard({
  createEntryType,
  onChangeCreateEntryType,
  createEntryAmount,
  onChangeCreateEntryAmount,
  createEntryDescription,
  onChangeCreateEntryDescription,
  createEntryDate,
  onChangeCreateEntryDate,
  createEntryTime,
  onChangeCreateEntryTime,
  onSubmitCreateEntry,
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
        entryType={createEntryType}
        onChangeEntryType={onChangeCreateEntryType}
        entryAmount={createEntryAmount}
        onChangeEntryAmount={onChangeCreateEntryAmount}
        entryDescription={createEntryDescription}
        onChangeEntryDescription={onChangeCreateEntryDescription}
        entryDate={createEntryDate}
        onChangeEntryDate={onChangeCreateEntryDate}
        entryTime={createEntryTime}
        onChangeEntryTime={onChangeCreateEntryTime}
        onSubmit={onSubmitCreateEntry}
        submitLabel="거래 추가"
      />
    </div>
  );
}
