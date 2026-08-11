import type { TeamMemberRole } from "@/types/player";
import { ShieldCheck } from "lucide-react";

interface TeamRoleCardProps {
  role: TeamMemberRole | null;
}

const roleMeta: Record<
  TeamMemberRole,
  {
    label: string;
    description: string;
    permissions: string[];
    badgeClassName: string;
  }
> = {
  owner: {
    label: "회장",
    description: "팀의 모든 운영 설정을 관리할 수 있어요.",
    permissions: [
      "팀 기본 정보 변경",
      "초대 코드 재발급",
      "팀원 권한 관리",
      "팀 삭제",
    ],
    badgeClassName: "bg-amber-100 text-amber-700",
  },
  staff: {
    label: "운영진",
    description: "경기와 선수 등 팀 운영 기능을 관리할 수 있어요.",
    permissions: [
      "팀 기본 정보 변경",
      "선수 및 경기 관리",
      "회비 및 벌금 관리",
    ],
    badgeClassName: "bg-emerald-100 text-emerald-700",
  },
  member: {
    label: "일반 회원",
    description: "팀 정보를 확인하고 개인 기능을 이용할 수 있어요.",
    permissions: [
      "경기 투표 참여",
      "내 선수 정보 변경",
      "팀 기록 및 일정 확인",
    ],
    badgeClassName: "bg-stone-100 text-stone-600",
  },
};

export default function TeamRoleCard({ role }: Readonly<TeamRoleCardProps>) {
  const meta = role ? roleMeta[role] : null;

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-stone-900">내 팀 권한</h2>

            {meta && (
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badgeClassName}`}
              >
                {meta.label}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-stone-400">
            {meta?.description ?? "팀 권한 정보를 확인할 수 없어요."}
          </p>
        </div>
      </div>

      {meta && (
        <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-4">
          <p className="text-xs font-semibold tracking-wide text-stone-400">
            사용 가능한 기능
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {meta.permissions.map((permission) => (
              <span
                key={permission}
                className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600"
              >
                {permission}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
