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
      <div className="relative flex min-h-full items-end justify-center px-0 pt-10 md:items-center md:px-4 md:py-6">
        <button
          type="button"
          tabIndex={-1}
          aria-label="일정 등록 모달 닫기"
          disabled={isSubmitting}
          className="absolute inset-0"
          onClick={onClose}
        />
        <div className="relative z-10 max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] bg-white p-4 pb-5 shadow-2xl md:max-h-[90vh] md:rounded-xl md:p-8">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:bg-stone-50 md:right-5 md:top-5 md:h-10 md:w-10"
            aria-label="닫기"
          >
            <X className="h-4 w-4" strokeWidth={2.2} />
          </button>
          <div className="mb-6 pr-10 md:mb-8">
            <p className="text-sm font-semibold text-emerald-700">일정 등록</p>
            <h2
              id="match-create-modal-title"
              className="mt-2 text-2xl font-bold tracking-tight text-stone-900 md:text-3xl"
            >
              새 경기 추가하기
            </h2>
            <p className="mt-2 text-sm leading-5 text-stone-500 md:leading-6">
              경기 종류와 일정, 장소를 먼저 등록하고 세부 내용은 나중에 수정할
              수 있어요.
            </p>
          </div>
          <div className="space-y-6 md:space-y-7">
            <MatchCreateTypeSection {...typeState} />
            <MatchCreateSportSection {...sportState} />
            <MatchCreateScheduleSection {...scheduleState} />
            <MatchCreateOpponentSection {...opponentState} />
            <MatchCreateLocationSection {...locationState} />
            <MatchCreateUniformSection {...uniformState} />
          </div>

          <div className="sticky bottom-0 -mx-4 mt-6 flex gap-2 border-t border-stone-100 bg-white/95 px-4 pt-4 backdrop-blur md:static md:mx-0 md:mt-8 md:justify-end md:border-0 md:bg-transparent md:px-0 md:pt-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-12 flex-1 rounded-xl border border-stone-200 px-5 text-sm font-medium text-stone-500 transition hover:bg-stone-50 md:flex-none"
            >
              취소
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => void onSubmit()}
              className="h-12 flex-1 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-300 md:flex-none"
            >
              {isSubmitting ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
