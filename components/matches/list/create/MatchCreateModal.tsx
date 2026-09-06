import type { MatchCreateFormValue } from "@/types/match";
import type { TeamSport } from "@/types/team";
import { X } from "lucide-react";
import MatchCreateTypeSection from "./MatchCreateTypeSection";
import MatchCreateScheduleSection from "./MatchCreateScheduleSection";
import MatchCreateOpponentSection from "./MatchCreateOpponentSection";
import MatchCreateLocationSection from "./MatchCreateLocationSection";
import MatchCreateUniformSection from "./MatchCreateUniformSection";
import MatchCreateSportSection from "./MatchCreateSportSection";
import { useMatchCreateForm } from "@/hooks/matches/useMatchCreateForm";
import { useEffect, useRef } from "react";

interface MatchCreateModalProps {
  defaultSport: TeamSport;
  onClose: () => void;
  onSave: (value: MatchCreateFormValue) => Promise<boolean>;
}

export default function MatchCreateModal({
  defaultSport,
  onClose,
  onSave,
}: Readonly<MatchCreateModalProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    dialog.showModal();

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, []);

  const {
    typeState,
    sportState,
    scheduleState,
    opponentState,
    locationState,
    uniformState,
    isSubmitting,
    onSubmit,
  } = useMatchCreateForm({
    defaultSport,
    onSave,
  });

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="match-create-modal-title"
      onCancel={(event) => {
        event.preventDefault();

        if (!isSubmitting) {
          onClose();
        }
      }}
      className="m-0 h-dvh max-h-none w-dvw max-w-none border-0 bg-transparent p-0 backdrop:bg-black/35"
    >
      <div className="relative flex min-h-full items-center justify-center px-4 py-6">
        <button
          type="button"
          tabIndex={-1}
          aria-label="일정 등록 모달 닫기"
          disabled={isSubmitting}
          className="absolute inset-0"
          onClick={onClose}
        />
        <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl md:p-8">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 hover:bg-stone-50"
            aria-label="닫기"
          >
            <X className="h-4 w-4" strokeWidth={2.2} />
          </button>
          <div className="mb-8">
            <p className="text-sm font-semibold text-emerald-700">일정 등록</p>
            <h2
              id="match-create-modal-title"
              className="mt-2 text-3xl font-bold tracking-tight text-stone-900"
            >
              새 경기 추가하기
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              경기 종류와 일정, 장소를 먼저 등록하고 세부 내용은 나중에 수정할
              수 있어요.
            </p>
          </div>
          <div className="space-y-7">
            <MatchCreateTypeSection {...typeState} />
            <MatchCreateSportSection {...sportState} />
            <MatchCreateScheduleSection {...scheduleState} />
            <MatchCreateOpponentSection {...opponentState} />
            <MatchCreateLocationSection {...locationState} />
            <MatchCreateUniformSection {...uniformState} />
          </div>

          <div className="mt-8 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-12 rounded-xl border border-stone-200 px-5 text-sm font-medium text-stone-500 transition hover:bg-stone-50"
            >
              취소
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => void onSubmit()}
              className="h-12 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {isSubmitting ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
