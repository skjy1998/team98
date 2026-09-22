import { useConfirmStore } from "@/stores/confirm-store";
import { useToastStore } from "@/stores/toast-store";
import { Copy, KeyRound, RefreshCw } from "lucide-react";
import { useState } from "react";

interface TeamInviteCodeCardProps {
  inviteCode: string;
  canRegenerate: boolean;
  onRegenerate: () => Promise<boolean>;
}

export default function TeamInviteCodeCard({
  inviteCode,
  canRegenerate,
  onRegenerate,
}: Readonly<TeamInviteCodeCardProps>) {
  const showToast = useToastStore((state) => state.showToast);
  const confirm = useConfirmStore((state) => state.confirm);

  const [isCopied, setIsCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleCopy = async () => {
    if (!inviteCode) return;

    try {
      await navigator.clipboard.writeText(inviteCode);
      setIsCopied(true);

      globalThis.setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    } catch {
      showToast("초대 코드 복사에 실패했어요.", "error");
    }
  };

  const handleRegenerate = async () => {
    const confirmed = await confirm({
      title: "초대 코드 재발급",
      description:
        "초대 코드를 새로 발급할까요? 기존 초대 코드는 즉시 사용할 수 없게 됩니다.",
      confirmLabel: "재발급",
      variant: "danger",
    });

    if (!confirmed) return;

    setIsRegenerating(true);

    const success = await onRegenerate();

    setIsRegenerating(false);

    if (!success) {
      showToast("초대 코드 재발급에 실패했어요.", "error");
      return;
    }

    showToast("새 초대 코드가 발급됐어요.", "success");
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-3.5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:h-10 sm:w-10">
          <KeyRound className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-900 sm:text-lg">
            팀 초대 코드
          </h2>
          <p className="mt-1 text-xs text-stone-400 sm:text-sm">
            코드를 공유해 새로운 팀원을 초대할 수 있어요.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3 sm:mt-5 sm:gap-3 sm:p-4">
        <p className="min-w-0 flex-1 truncate font-mono text-lg font-bold tracking-[0.16] text-stone-900 sm:text-xl sm:tracking-[0.24em]">
          {inviteCode || "코드 없음"}
        </p>
        <button
          type="button"
          disabled={!inviteCode}
          onClick={handleCopy}
          className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-stone-200 bg-white px-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3"
        >
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline">
            {isCopied ? "복사됨" : "복사"}
          </span>
        </button>
      </div>

      {canRegenerate ? (
        <div className="mt-4 flex sm:mt-5 sm:justify-end">
          <button
            type="button"
            disabled={isRegenerating}
            onClick={handleRegenerate}
            className="flex h-11 w-full items-center gap-2 rounded-xl border border-amber-200 px-4 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            {isRegenerating ? "재발급 중..." : "초대 코드 재발급"}
          </button>
        </div>
      ) : (
        <p className="mt-4 text-sm text-stone-400">
          초대 코드 재발급은 회장만 할 수 있어요.
        </p>
      )}
    </section>
  );
}
