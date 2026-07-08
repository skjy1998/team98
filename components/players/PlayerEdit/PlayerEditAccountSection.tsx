import type { ConnectableTeamMember, TeamMemberRole } from "@/types/player";

interface PlayerEditAccountSectionProps {
  linkedUserId?: string;
  members: ConnectableTeamMember[];
  selectedUserId: string;
  onChangeSelectedUserId: (value: string) => void;
}

const roleLabelMap: Record<TeamMemberRole, string> = {
  owner: "회장",
  staff: "운영진",
  member: "일반 회원",
};

export default function PlayerEditAccountSection({
  linkedUserId,
  members,
  selectedUserId,
  onChangeSelectedUserId,
}: Readonly<PlayerEditAccountSectionProps>) {
  return (
    <section className="rounded-xl border border-stone-200 p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-emerald-600">05 계정 연결</p>
        <p className="mt-1 text-sm text-stone-400">
          가입된 팀원 계정과 이 선수를 연결할 수 있어요.
        </p>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
          <p className="text-xs font-medium text-stone-400">현재 상태</p>
          <p className="mt-1 text-sm font-semibold text-stone-900">
            {linkedUserId ? "가입된 계정과 연결됨" : "미가입 선수"}
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-stone-500">연결할 계정</p>
          <select
            value={selectedUserId}
            onChange={(event) => onChangeSelectedUserId(event.target.value)}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
          >
            <option value="">미연결</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.label} · {roleLabelMap[member.role]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
