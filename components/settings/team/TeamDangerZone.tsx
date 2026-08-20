import { useConfirmStore } from "@/stores/confirm-store";
import type { TeamMemberRole } from "@/types/player";
import { LogOut, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TeamDangerZoneProps {
  teamName: string;
  role: TeamMemberRole | null;
  onLeaveTeam: () => Promise<boolean>;
  onDeleteTeam: (teamName: string) => Promise<boolean>;
}

export default function TeamDangerZone({
  teamName,
  role,
  onLeaveTeam,
  onDeleteTeam,
}: Readonly<TeamDangerZoneProps>) {
  const router = useRouter();
  const confirm = useConfirmStore((state) => state.confirm);

  const [confirmationName, setConfirmationName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moveToTeamSetup = () => {
    router.replace("/teams/setup");
    router.refresh();
  };

  const handleLeave = async () => {
    const confirmed = await confirm({
      title: "팀 나가기",
      description:
        "팀에서 나갈까요? 팀에 연결된 내 선수 계정도 함께 해제됩니다.",
      confirmLabel: "나가기",
      variant: "danger",
    });

    if (!confirmed) return;

    setIsSubmitting(true);
    const success = await onLeaveTeam();
    setIsSubmitting(false);

    if (success) {
      moveToTeamSetup();
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "팀 영구 삭제",
      description:
        "팀과 연결된 경기, 선수, 기록, 회비 데이터가 모두 삭제됩니다.",
      confirmLabel: "팀 삭제",
      variant: "danger",
    });

    if (!confirmed) return;

    setIsSubmitting(true);
    const success = await onDeleteTeam(confirmationName);
    setIsSubmitting(false);

    if (success) {
      moveToTeamSetup();
    }
  };

  return (
    <section className="rounded-xl border border-rose-200 bg-rose-50/40 p-6">
      <div>
        <h2 className="text-lg font-semibold text-rose-700">위험 영역</h2>
        <p className="mt-1 text-sm text-rose-500">
          아래 작업은 되돌릴 수 없으니 신중하게 진행해 주세요.
        </p>
      </div>

      {role === "owner" ? (
        <div className="mt-5 rounded-xl border border-rose-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-stone-900">팀 삭제</h3>
          <p className="mt-1 text-sm text-stone-500">
            팀과 연결된 모든 데이터를 영구적으로 삭제합니다.
          </p>
          <label
            htmlFor="delete-team-confirmation"
            className="mt-4 block text-xs font-medium text-stone-500"
          >
            확인을 위해 <strong>{teamName}</strong>을 입력하세요.
          </label>

          <input
            id="delete-team-confirmation"
            value={confirmationName}
            disabled={isSubmitting}
            onChange={(event) => setConfirmationName(event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-rose-200 bg-white px-4 text-sm outline-none focus:border-rose-400 disabled:cursor-not-allowed disabled:bg-stone-100"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              disabled={isSubmitting || confirmationName.trim() !== teamName}
              onClick={handleDelete}
              className="flex h-11 items-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {isSubmitting ? "삭제 중..." : "팀 삭제"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-white p-5">
          <div>
            <h3 className="text-sm font-semibold text-stone-900">팀 나가기</h3>
            <p className="mt-1 text-sm text-stone-500">
              내 계정과 선수 연결이 해제돼요.
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleLeave}
            className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-rose-200 px-4 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {isSubmitting ? "처리 중..." : "팀 나가기"}
          </button>
        </div>
      )}
    </section>
  );
}
