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
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-emerald-600">
            SquadFlow 팀 관리
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-900">
            새 팀을 연결해 주세요.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-500">
            새로운 팀을 만들거나 초대 코드로 다른 팀에 참가할 수 있습니다.
          </p>
        </div>
        {teamLoaded && team && (
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-stone-500"
          >
            돌아가기
          </Link>
        )}
      </header>

      <TeamEntryModeSelector mode={mode} onChangeMode={changeMode} />

      {errorMessage && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
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
