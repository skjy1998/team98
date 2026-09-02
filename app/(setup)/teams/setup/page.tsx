"use client";

import ContentState from "@/components/common/ContentState";
import PageHeader from "@/components/PageHeader";
import TeamCreateForm from "@/components/team/setup/TeamCreateForm";
import TeamJoinForm from "@/components/team/setup/TeamJoinForm";
import TeamSetupModeSelector from "@/components/team/setup/TeamSetupModeSelector";
import { useTeamSetup } from "@/hooks/team/useTeamSetup";

export default function TeamSetupPage() {
  const {
    mode,
    changeMode,
    teamSport,
    setTeamSport,
    teamName,
    setTeamName,
    inviteCode,
    setInviteCode,
    isCreatingTeam,
    isJoiningTeam,
    isCheckingTeam,
    errorMessage,
    createTeam: handleCreateTeam,
    joinTeam: handleJoinTeam,
    logout: handleLogout,
  } = useTeamSetup();

  if (isCheckingTeam) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader
          title="팀 시작하기"
          description="팀 정보를 확인하고 있어요."
        />
        <ContentState
          variant="loading"
          title="팀 연결 상태를 확인하는 중..."
          description="가입된 팀 정보를 불러오고 있어요."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
        >
          로그아웃
        </button>
      </div>
      <PageHeader
        title="팀 시작하기"
        description="팀을 새로 만들거나 초대 코드를 통해 기존 팀에 참가할 수 있어요."
      />
      <TeamSetupModeSelector mode={mode} onChangeMode={changeMode} />
      {errorMessage && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          {errorMessage}
        </div>
      )}
      {mode === "create" && (
        <TeamCreateForm
          teamName={teamName}
          teamSport={teamSport}
          isSubmitting={isCreatingTeam}
          onChangeTeamName={setTeamName}
          onChangeTeamSport={setTeamSport}
          onCreateTeam={handleCreateTeam}
        />
      )}
      {mode === "join" && (
        <TeamJoinForm
          inviteCode={inviteCode}
          isSubmitting={isJoiningTeam}
          onChangeInviteCode={setInviteCode}
          onJoinTeam={handleJoinTeam}
        />
      )}
    </div>
  );
}
