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
      className="rounded-xl border border-stone-200 bg-white p-4 shadow-[0_24px_70px_-40px_rgba(28,25,23,0.3)] sm:p-8"
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 sm:text-xs">
            Join Team
          </p>
          <h2 className="mt-1.5 text-xl font-black tracking-tight text-stone-900 sm:mt-2 sm:text-2xl">
            초대 코드 입력
          </h2>
          <p className="mt-1.5 text-xs leading-5 text-stone-500 sm:mt-2 sm:text-sm sm:leading-6">
            팀 관리자에게 전달받은 초대 코드를 입력해 주세요.
          </p>
        </div>

        <span className="shrink-0 whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 sm:px-3 sm:py-1.5 sm:text-xs">
          팀원
        </span>
      </div>

      <div className="mt-5 sm:mt-8">
        <label
          htmlFor="team-invite-code"
          className="mb-1.5 block text-xs font-bold text-stone-700 sm:mb-2 sm:text-sm"
        >
          초대 코드
        </label>

        <div className="relative">
          <KeyRound
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 sm:left-4 sm:h-5 sm:w-5"
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
            className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-11 pr-3 text-xs font-bold uppercase tracking-[0.18em] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:pl-12 sm:pr-4 sm:text-sm"
          />
        </div>

        <p className="mt-2 text-[11px] leading-5 text-stone-400 sm:text-xs">
          초대 코드는 팀 설정 화면에서 확인할 수 있습니다.
        </p>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className={[
          "mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold transition sm:mt-8 sm:h-12 sm:text-sm",
          canSubmit
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
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
