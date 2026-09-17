import { useEscapeKey } from "@/hooks/common/useEscapeKey";
import { useCurrentTeam } from "@/hooks/team/useCurrentTeam";
import { TeamMemberRole } from "@/types/player";
import { Check, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const teamRoleLabelMap: Record<TeamMemberRole, string> = {
  owner: "회장",
  staff: "운영진",
  member: "일반 회원",
};

export default function SidebarTeamSwitcher() {
  const router = useRouter();
  const { team, teams, selectTeam } = useCurrentTeam();
  const [isOpen, setIsOpen] = useState(false);

  useEscapeKey(() => setIsOpen(false), isOpen);

  const handleSelect = (teamId: string) => {
    setIsOpen(false);
    if (teamId === team?.id || !selectTeam(teamId)) return;
    router.replace("/dashboard");
  };

  return (
    <div className="relative min-w-0">
      <div className="flex min-w-0 items-center gap-1">
        <p className="truncate text-lg font-bold text-stone-900">
          {team?.name || "팀 정보 없음"}
        </p>
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="팀 선택"
          aria-expanded={isOpen}
          className="shrink-0 rounded-lg p-1 text-stone-500 hover:bg-white hover:text-emerald-700"
        >
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute -left-5 top-full z-50 mt-2 w-60 rounded-xl border border-stone-200 bg-white p-1.5 shadow-xl">
          <p className="px-3 py-2 text-xs font-semibold text-stone-400">
            내 팀
          </p>
          {teams.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-stone-700 hover:bg-stone-50"
            >
              <p className="truncate text-lg font-bold text-stone-900">
                {item.name}
              </p>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] font-semibold text-stone-500">
                  {teamRoleLabelMap[item.memberRole]}
                </span>
                {item.id === team?.id && (
                  <Check
                    aria-label="현재 팀"
                    className="h-4 w-4 shrink-0 text-emerald-600"
                  />
                )}
              </div>
            </button>
          ))}
          <div className="my-1 border-t border-stone-100" />
          <Link
            href="/teams/add"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />새 팀 추가
          </Link>
        </div>
      )}
    </div>
  );
}
