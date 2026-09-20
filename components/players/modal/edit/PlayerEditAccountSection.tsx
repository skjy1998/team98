import type { ConnectableTeamMember, TeamMemberRole } from "@/types/player";
import { Check, ChevronDown, X } from "lucide-react";
import { useState } from "react";

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
  const [isMobilePickerOpen, setIsMobilePickerOpen] = useState(false);

  const linkedMember = members.find((member) => member.userId === linkedUserId);
  const hasConnectableMembers = members.length > 0;

  const selectedMember = members.find(
    (member) => member.userId === selectedUserId,
  );

  return (
    <section className="rounded-xl border border-stone-200 p-3.5 sm:p-5">
      <div className="mb-3 sm:mb-4">
        <p className="text-xs font-semibold text-emerald-600 sm:text-sm">
          05 계정 연결
        </p>
        <p className="mt-1 text-xs text-stone-400 sm:text-sm">
          가입된 팀원 계정과 이 선수를 연결할 수 있어요.
        </p>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 sm:px-4 sm:py-3">
          <p className="text-xs font-medium text-stone-400">현재 상태</p>
          <p className="mt-1 text-xs font-semibold text-stone-900 sm:text-sm">
            {linkedUserId ? "가입된 계정과 연결됨" : "미가입 선수"}
          </p>
          {linkedUserId && linkedMember && (
            <p className="mt-1 text-xs text-stone-500">
              연결 계정: {linkedMember.label} ·{" "}
              {roleLabelMap[linkedMember.role]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-stone-500 sm:text-sm">
            팀원 계정 선택
          </p>
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMobilePickerOpen(true)}
              className="flex h-11 w-full items-center justify-between rounded-xl border border-stone-200 bg-white px-3 text-left text-xs text-stone-800 transition hover:border-emerald-300"
            >
              <span className="truncate">
                {selectedMember
                  ? `${selectedMember.label} · ${roleLabelMap[selectedMember.role]}`
                  : "미연결"}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-stone-400" />
            </button>
          </div>

          <select
            value={selectedUserId}
            onChange={(event) => onChangeSelectedUserId(event.target.value)}
            className="hidden h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300 md:block"
          >
            <option value="">미연결</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.label} · {roleLabelMap[member.role]}
              </option>
            ))}
          </select>
          {!hasConnectableMembers && (
            <p className="text-xs text-stone-400">
              아직 연결 가능한 가입 계정이 없어요.
            </p>
          )}
        </div>
      </div>
      {isMobilePickerOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="계정 선택 닫기"
            onClick={() => setIsMobilePickerOpen(false)}
            className="absolute inset-0 bg-black/35"
          />

          <div className="absolute inset-x-0 bottom-0 max-h-[72dvh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-stone-900">
                팀원 계정 선택
              </h3>
              <button
                type="button"
                onClick={() => setIsMobilePickerOpen(false)}
                className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  onChangeSelectedUserId("");
                  setIsMobilePickerOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  selectedUserId === ""
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                }`}
              >
                미연결
                {selectedUserId === "" && <Check className="h-4 w-4" />}
              </button>
              {members.map((member) => {
                const isSelected = selectedUserId === member.userId;

                return (
                  <button
                    key={member.userId}
                    type="button"
                    onClick={() => {
                      onChangeSelectedUserId(member.userId);
                      setIsMobilePickerOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {member.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-stone-400">
                        {roleLabelMap[member.role]}
                      </span>
                    </span>
                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
