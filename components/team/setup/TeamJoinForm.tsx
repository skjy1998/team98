import { KeyRound, LoaderCircle } from "lucide-react";

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
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onJoinTeam();
      }}
      className="rounded-xl border border-stone-200 bg-white p-8 shadow-[0_24px_70px_-40px_rgba(28,25,23,0.3)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
            Join Team
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-900">
            초대 코드 입력
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            팀 관리자에게 전달받은 초대 코드를 입력해 주세요.
          </p>
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
          팀원
        </span>
      </div>

      <div className="mt-8">
        <label
          htmlFor="team-invite-code"
          className="mb-2 block text-sm font-bold text-stone-700"
        >
          초대 코드
        </label>

        <div className="relative">
          <KeyRound
            aria-hidden="true"
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
          />

          <input
            id="team-invite-code"
            type="text"
            value={inviteCode}
            onChange={(event) => onChangeInviteCode(event.target.value)}
            placeholder="ABCDEF"
            disabled={isSubmitting}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 pl-12 pr-4 text-sm font-bold uppercase tracking-[0.18em] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <p className="mt-2 text-xs leading-5 text-stone-400">
          초대 코드는 팀 설정 화면에서 확인할 수 있습니다.
        </p>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className={[
          "mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition",
          canSubmit
            ? "bg-stone-900 text-white hover:bg-emerald-600"
            : "cursor-not-allowed bg-stone-100 text-stone-400",
        ].join(" ")}
      >
        {isSubmitting && (
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
        )}
        {isSubmitting ? "팀 참가 중..." : "초대 코드로 참가하기"}
      </button>
    </form>
  );
}
