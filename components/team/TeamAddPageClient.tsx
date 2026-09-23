"use client";

import { useTeamAdd } from "@/hooks/team/useTeamAdd";
import TeamCreateForm from "./entry/TeamCreateForm";
import TeamJoinForm from "./entry/TeamJoinForm";
import { useAppAccess } from "@/hooks/auth/useAppAccess";
import ContentState from "../common/ContentState";
import Link from "next/link";
import { useCurrentTeam } from "@/hooks/team/useCurrentTeam";
import TeamEntryModeSelector from "./entry/TeamEntryModeSelector";

export default function TeamAddPageClient() {
  const { isCheckingAccess, accessErrorMessage } = useAppAccess({
    allowWithoutTeam: true,
  });
  const { team, teamLoaded } = useCurrentTeam();

  const {
    mode,
    changeMode,
    teamName,
    setTeamName,
    teamSport,
    setTeamSport,
    inviteCode,
    setInviteCode,
    isSubmitting,
    errorMessage,
    createTeam,
    joinTeam,
  } = useTeamAdd();

  if (isCheckingAccess) {
    return <ContentState variant="loading" title="팀 정보를 확인하는 중..." />;
  }

  if (accessErrorMessage) {
    return <ContentState variant="error" title={accessErrorMessage} />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div>
          <p className="text-xs font-bold text-emerald-600 sm:text-sm">
            SquadFlow 팀 관리
          </p>
          <h1 className="mt-1.5 text-2xl font-black tracking-tight text-stone-900 sm:mt-3 sm:text-4xl">
            새 팀을 연결해 주세요.
          </h1>
          <p className="mt-2 max-w-xl text-xs leading-5 text-stone-500 sm:mt-3 sm:text-sm sm:leading-6">
            새로운 팀을 만들거나 초대 코드로 다른 팀에 참가할 수 있습니다.
          </p>
        </div>
        {teamLoaded && team && (
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-stone-500 sm:text-sm"
          >
            돌아가기
          </Link>
        )}
      </header>

      <TeamEntryModeSelector mode={mode} onChangeMode={changeMode} />

      {errorMessage && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs font-medium text-rose-600 sm:px-4 sm:text-sm"
        >
          {errorMessage}
        </p>
      )}

      {mode === "create" ? (
        <TeamCreateForm
          teamName={teamName}
          teamSport={teamSport}
          isSubmitting={isSubmitting}
          onChangeTeamName={setTeamName}
          onChangeTeamSport={setTeamSport}
          onCreateTeam={createTeam}
        />
      ) : (
        <TeamJoinForm
          inviteCode={inviteCode}
          isSubmitting={isSubmitting}
          onChangeInviteCode={setInviteCode}
          onJoinTeam={joinTeam}
        />
      )}
    </div>
  );
}
