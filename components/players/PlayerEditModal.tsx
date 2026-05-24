import { playerPositions, PlayerType } from "@/types/player";
import { X } from "lucide-react";
import { useState } from "react";

interface PlayerEditModalProps {
  player: PlayerType;
  onClose: () => void;
  onSave: (player: PlayerType) => void;
}

export default function PlayerEditModal({
  player,
  onClose,
  onSave,
}: Readonly<PlayerEditModalProps>) {
  const [name, setName] = useState(player.name);
  const [number, setNumber] = useState(
    player.number ? String(player.number) : "",
  );
  const [position, setPosition] = useState(player.position ?? "");
  const [birth, setBirth] = useState(player.birth ?? "");
  const [appearance, setAppearance] = useState(String(player.appearance ?? 0));
  const [goal, setGoal] = useState(String(player.goal ?? 0));

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    onSave({
      ...player,
      name: name.trim(),
      number: number ? Number(number) : undefined,
      position: position || undefined,
      birth: birth || undefined,
      appearance: Number(appearance) || 0,
      goal: Number(goal) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <div className="relative max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:bg-stone-50"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>
        {/* <div className="mb-6 h-1.5 w-full rounded-full bg-emerald-400" /> */}
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* 왼쪽 프로필 */}
          <aside className="rounded-xl border border-stone-200 bg-stone-50/70 p-5">
            <div className="flex flex-col gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-stone-200 bg-white text-3xl font-bold text-stone-700">
                {name.slice(0, 1)}
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold traking-tight text-stone-900">
                  {name || "이름 없음"}
                </p>
                <p className="text-sm text-stone-400">
                  {position || "포지션 미지정"}
                  {number ? ` · #${number}` : ""}
                </p>
              </div>
              <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] text-emerald-600">
                    PROFILE
                  </p>
                  <p className="mt-1 text-sm text-stone-400">
                    선수 기본 정보를 정리하고 기록과 연결하세요.
                  </p>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="player-name"
                    className="text-sm font-semibold text-stone-700"
                  >
                    이름
                  </label>
                  <input
                    id="player-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-emerald-300"
                  />
                </div>
              </div>
            </div>
          </aside>
          {/* 오른쪽 정보 입력 */}
          <div className="space-y-5">
            <section className="rounded-xl border border-stone-200 p-5">
              <div className="mb-4">
                <p className="text-sm font-semibold text-emerald-600">
                  01 등번호
                </p>
                <p className="mt-1 text-sm text-stone-400">
                  비워두면 아직 배정되지 않은 선수로 저장돼요.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-[160px_minmax(0,1fr)]">
                <input
                  id="player-number"
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="17"
                  className="h-16 rounded-xl border border-stone-200 px-4 text-center text-2xl font-bold text-stone-900 outline-none transition focus:border-emerald-300"
                />
                <div className="flex h-16 items-center rounded-xl border border-stone-200 bg-stone-50 px-5 text-lg font-semibold text-stone-500">
                  {number ? `미리보기 #${number}` : "미리보기"}
                </div>
              </div>
            </section>
            <section className="rounded-xl border border-stone-200 p-5">
              <div className="mb-4">
                <p className="text-sm font-semibold text-emerald-600">
                  02 포지션
                </p>
                <p className="mt-1 text-sm text-stone-400">
                  선수의 주 포지션을 선택하세요.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {playerPositions.map((pos) => {
                  const isActive = position === pos;

                  return (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setPosition(pos)}
                      className={[
                        "rounded-full border px-4 py-2 text-sm font-medium transition",
                        isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
                      ].join(" ")}
                    >
                      {pos}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setPosition("")}
                  className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-400 transition hover:bg-stone-50"
                >
                  선택해제
                </button>
              </div>
            </section>
            <section className="rounded-xl border border-stone-200 p-5">
              <div className="mb-4">
                <p className="text-sm font-semibold text-emerald-600">
                  03 추가 정보
                </p>
                <p className="mt-1 text-sm text-stone-400">
                  경기 기록과 기본 프로필을 함께 관리할 수 있어요.
                </p>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <div className="space-y-2">
                  <label
                    htmlFor="player-birth"
                    className="text-sm font-semibold text-stone-700"
                  >
                    생년월일
                  </label>
                  <input
                    id="plyaer-birth"
                    type="date"
                    value={birth}
                    onChange={(e) => setBirth(e.target.value)}
                    className="h-14 w-full rounded-xl border border-stone-200 px-4 text-sm text-stone-800 outline-none transition focus:border-emerald-300"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="player-appearance"
                    className="text-sm font-semibold text-stone-700"
                  >
                    출전
                  </label>
                  <input
                    id="player-appearance"
                    type="number"
                    value={appearance}
                    onChange={(e) => setAppearance(e.target.value)}
                    placeholder="0"
                    className="h-14 w-full rounded-[18px] border border-stone-200 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-emerald-300"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="player-goal"
                    className="text-sm font-semibold text-stone-700"
                  >
                    득점
                  </label>
                  <input
                    id="player-goal"
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="0"
                    className="h-14 w-full rounded-[18px] border border-stone-200 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-emerald-300"
                  />
                </div>
              </div>
            </section>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="h-12 rounded-full border border-stone-200 px-5 text-sm font-medium text-stone-500 transition hover:bg-stone-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="h-12 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
