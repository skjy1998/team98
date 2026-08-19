import type { TeamSeasonFormValue } from "@/types/seasons";
import { Plus } from "lucide-react";
import { useState } from "react";
import SeasonForm from "./SeasonForm";
import { useToastStore } from "@/stores/toast-store";

interface SeasonCreateCardProps {
  canManage: boolean;
  onCreate: (value: TeamSeasonFormValue) => Promise<boolean>;
}

function getInitialValue(): TeamSeasonFormValue {
  const year = new Date().getFullYear();

  return {
    name: `${year} 시즌`,
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
  };
}

export default function SeasonCreateCard({
  canManage,
  onCreate,
}: Readonly<SeasonCreateCardProps>) {
  const showToast = useToastStore((state) => state.showToast);

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState<TeamSeasonFormValue>(getInitialValue);
  const [isSaving, setIsSaving] = useState(false);

  if (!canManage) return null;

  const handleClose = () => {
    setIsOpen(false);
    setValue(getInitialValue());
  };

  const handleCreate = async () => {
    setIsSaving(true);
    const success = await onCreate(value);
    setIsSaving(false);

    if (!success) {
      showToast(
        "시즌 생성에 실패했어요. 같은 이름의 시즌이 있는지 확인해 주세요.",
        "error",
      );
      return;
    }

    showToast("새 시즌을 만들었어요.", "success");
    handleClose();
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 px-5 py-5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
      >
        <Plus className="h-4 w-4" />새 시즌 만들기
      </button>
    );
  }

  return (
    <section className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-stone-900">새 시즌 만들기</h2>
        <p className="mt-1 text-sm text-stone-500">
          시즌 이름과 운영 기간을 설정하세요.
        </p>
      </div>

      <SeasonForm
        value={value}
        isSaving={isSaving}
        submitLabel="시즌 만들기"
        onChange={setValue}
        onSubmit={handleCreate}
        onCancel={handleClose}
      />
    </section>
  );
}
