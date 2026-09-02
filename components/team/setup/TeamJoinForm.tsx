interface TeamJoinFormProps {
  inviteCode: string;
  isSubmitting: boolean;
  onChangeInviteCode: (value: string) => void;
  onJoinTeam: () => void | Promise<void>;
}

export default function TeamJoinForm({
  inviteCode,
  isSubmitting,
  onChangeInviteCode,
  onJoinTeam,
}: Readonly<TeamJoinFormProps>) {
  const canSubmit = Boolean(inviteCode.trim()) && !isSubmitting;

  return (
    <section className="rounded-xl border border-sky-200 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-stone-900">팀 참가하기</h3>
        <p className="text-sm text-stone-500">
          초대 코드를 입력해 기존 팀에 참가할 수 있어요.
        </p>
      </div>

      <div className="mt-5">
        <label
          htmlFor="team-invite-code"
          className="mb-2 block text-sm font-medium text-stone-900"
        >
          초대 코드
        </label>
        <input
          id="team-invite-code"
          type="text"
          value={inviteCode}
          onChange={(event) => onChangeInviteCode(event.target.value)}
          placeholder="ABCDEF"
          disabled={isSubmitting}
          autoCapitalize="characters"
          className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm uppercase text-stone-800 outline-none placeholder:text-stone-400 focus:border-sky-300 disabled:cursor-not-allowed disabled:bg-stone-100"
        />
      </div>
      <div className="mt-6">
        <button
          type="button"
          onClick={onJoinTeam}
          disabled={!canSubmit}
          className={[
            "flex h-14 w-full items-center justify-center rounded-xl px-5 text-sm font-semibold transition",
            canSubmit
              ? "bg-sky-600 text-white hover:bg-sky-700"
              : "cursor-not-allowed bg-stone-100 text-stone-400",
          ].join(" ")}
        >
          {isSubmitting ? "팀 참가 중..." : "초대코드로 참가하기"}
        </button>
      </div>
    </section>
  );
}
