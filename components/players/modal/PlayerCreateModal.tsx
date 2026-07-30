import { X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { PlayerType } from "@/types/player";

interface PlayerCreateModalProps {
  onClose: () => void;
  onSave: (player: PlayerType) => void | Promise<void>;
}

export default function PlayerCreateModal({
  onClose,
  onSave,
}: Readonly<PlayerCreateModalProps>) {
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    globalThis.window.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      globalThis.alert("이름을 입력해주세요.");
      return;
    }

    const nextPlayer: PlayerType = {
      id: crypto.randomUUID(),
      name: trimmedName,
      birth: birth || undefined,
      appearance: 0,
      goal: 0,
      assist: 0,
    };

    onSave(nextPlayer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="선수 추가 모달 닫기"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl rounded-[32px] bg-white px-6 py-6 shadow-2xl md:px-8 md:py-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:bg-stone-50"
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mt-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl">
            선수 추가하기
          </h2>
          <p className="mt-2 text-base leading-7 text-stone-500">
            이름만 먼저 등록하고, 자세한 정보는 나중에 수정에서 채워도 돼요.
          </p>
        </div>

        <div className="mt-7 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label
                htmlFor="player-create-name"
                className="text-lg font-bold text-stone-900"
              >
                이름
              </label>
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                필수
              </span>
            </div>
            <input
              id="player-create-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="실명 또는 닉네임"
              className="h-16 w-full rounded-[20px] border border-stone-200 px-5 text-lg text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-emerald-300"
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <label
                htmlFor="player-create-birth"
                className="text-base font-semibold text-stone-800"
              >
                생년월일
              </label>
              <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500">
                선택
              </span>
            </div>
            <input
              id="player-create-birth"
              value={birth}
              onChange={(event) => setBirth(event.target.value)}
              type="date"
              className="h-14 w-full rounded-[18px] border border-stone-200 px-4 text-base text-stone-800 outline-none transition focus:border-emerald-300"
            />
            <p className="text-sm text-stone-500">
              비워두고 등록한 뒤 나중에 추가해도 괜찮아요.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-7 flex h-15 w-full items-center justify-center gap-2 rounded-[22px] bg-stone-100 text-xl font-bold text-stone-700 transition hover:bg-emerald-600 hover:text-white"
        >
          등록하기
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
