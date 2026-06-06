import { X, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { PlayerType } from "@/types/player";

interface PlayerCreateModalProps {
  onClose: () => void;
  onSave: (player: PlayerType) => void;
}

export default function PlayerCreateModal({
  onClose,
  onSave,
}: Readonly<PlayerCreateModalProps>) {
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      birth: birth || undefined,
      appearance: 0,
      goal: 0,
      assist: 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="relative w-full max-w-2xl rounded-[32px] bg-white px-6 py-6 shadow-2xl md:px-8 md:py-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:bg-stone-50"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mt-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl">
            선수 추가하기
          </h2>
          <p className="mt-3 text-base leading-7 text-stone-500">
            먼저 이름만 빠르게 등록하고, 자세한 정보는 나중에 수정에서 채워도
            괜찮아요.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-lg font-bold text-stone-900">이름</label>
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                필수
              </span>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="실명 또는 닉네임"
              className="h-16 w-full rounded-[20px] border border-stone-200 px-5 text-lg text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-emerald-300"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-lg font-bold text-stone-900">
                생년월일
              </label>
              <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500">
                선택
              </span>
            </div>
            <input
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              type="date"
              className="h-16 w-full rounded-[20px] border border-stone-200 px-5 text-lg text-stone-800 outline-none transition focus:border-emerald-300"
            />
            <p className="text-sm text-stone-500">
              생년월일은 나중에 수정해도 괜찮아요.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-8 flex h-16 w-full items-center justify-center gap-2 rounded-[22px] bg-stone-100 text-xl font-bold text-stone-700 transition hover:bg-emerald-600 hover:text-white"
        >
          등록하기
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
