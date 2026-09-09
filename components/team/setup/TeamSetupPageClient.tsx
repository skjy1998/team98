"use client";

import ContentState from "@/components/common/ContentState";
import TeamCreateForm from "@/components/team/setup/TeamCreateForm";
import TeamJoinForm from "@/components/team/setup/TeamJoinForm";
import TeamSetupModeSelector from "@/components/team/setup/TeamSetupModeSelector";
import { useTeamSetup } from "@/hooks/team/useTeamSetup";
import { LogOut } from "lucide-react";

export default function TeamSetupPageClient() {
  const {
    mode,
    changeMode,
    form,
    updateField,
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
      <div className="mx-auto max-w-4xl">
        <ContentState
          variant="loading"
          title="팀 연결 상태를 확인하는 중..."
          description="가입된 팀 정보를 불러오고 있어요."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-emerald-600">
            SquadFlow 시작하기
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-900">
            팀을 연결해 주세요.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-500">
            새로운 팀을 만들거나 전달받은 초대 코드로 기존 팀에 참가할 수
            있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="로그아웃"
          title="로그아웃"
          className="flex shrink-0 items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-500 transition hover:border-stone-300 hover:text-stone-800"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </header>

      <div className="mt-10">
        <TeamSetupModeSelector mode={mode} onChangeMode={changeMode} />
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
        >
          {errorMessage}
        </div>
      )}

      <div className="mt-6">
        {mode === "create" && (
          <TeamCreateForm
            teamName={form.teamName}
            teamSport={form.teamSport}
            isSubmitting={isCreatingTeam}
            onChangeTeamName={(value) => updateField("teamName", value)}
            onChangeTeamSport={(value) => updateField("teamSport", value)}
            onCreateTeam={handleCreateTeam}
          />
        )}
        {mode === "join" && (
          <TeamJoinForm
            inviteCode={form.inviteCode}
            isSubmitting={isJoiningTeam}
            onChangeInviteCode={(value) => updateField("inviteCode", value)}
            onJoinTeam={handleJoinTeam}
          />
        )}
      </div>
    </div>
  );
}
