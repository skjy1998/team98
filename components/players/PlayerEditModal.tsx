import { playerDetailPositions, PlayerType } from "@/types/player";
import { X } from "lucide-react";
import { useState } from "react";

interface PlayerEditModalProps {
  player: PlayerType;
  onClose: () => void;
  onSave: (player: PlayerType) => void;
}

const detailPositionLabels = {
  GK: {
    GK: "골키퍼",
  },
  DF: {
    CB: "센터백",
    LB: "레프트백",
    RB: "라이트백",
  },
  MF: {
    CDM: "수비형",
    CM: "중앙",
    CAM: "공격형",
  },
  FW: {
    LW: "레프트 윙",
    RW: "라이트 윙",
    ST: "스트라이커",
  },
} as const;

export default function PlayerEditModal({
  player,
  onClose,
  onSave,
}: Readonly<PlayerEditModalProps>) {
  const [number, setNumber] = useState(
    player.number ? String(player.number) : "",
  );
  const [detailPositions, setDetailPositions] = useState<string[]>(
    player.detailPositions ?? [],
  );
  const [birth, setBirth] = useState(player.birth ?? "");
  const [appearance, setAppearance] = useState(String(player.appearance ?? 0));
  const [goal, setGoal] = useState(String(player.goal ?? 0));
  const [assist, setAssist] = useState(String(player.assist ?? 0));

  const handleToggleDetailPosition = (detail: string) => {
    setDetailPositions((prev) =>
      prev.includes(detail)
        ? prev.filter((item) => item !== detail)
        : [...prev, detail],
    );
  };

  const handleSubmit = () => {
    onSave({
      ...player,
      name: player.name,
      number: number ? Number(number) : undefined,
      detailPositions: detailPositions.length > 0 ? detailPositions : undefined,
      birth: birth || undefined,
      appearance: Number(appearance) || 0,
      goal: Number(goal) || 0,
      assist: Number(assist) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:bg-stone-50"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-5">
          <section className="rounded-xl border border-stone-200 bg-gradient-to-b from-stone-50 to-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-stone-200 bg-white text-3xl font-bold text-stone-700 shadow-sm">
                {player.name.slice(0, 1)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-2xl font-bold tracking-tight text-stone-900">
                    {player.name}
                  </p>

                  {number && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      #{number}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-stone-500">
                  {detailPositions.length > 0
                    ? detailPositions.join(", ")
                    : "포지션 미지정"}
                </p>

                {birth && (
                  <p className="mt-1 text-sm text-stone-400">
                    생년월일 {birth}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-stone-200 bg-white px-3 py-3 text-center shadow-sm">
                <p className="text-xs font-semibold tracking-[0.12em] text-stone-400">
                  출전
                </p>
                <p className="mt-1 text-lg font-bold text-stone-900">
                  {appearance}
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white px-3 py-3 text-center shadow-sm">
                <p className="text-xs font-semibold tracking-[0.12em] text-stone-400">
                  득점
                </p>
                <p className="mt-1 text-lg font-bold text-stone-900">{goal}</p>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white px-3 py-3 text-center shadow-sm">
                <p className="text-xs font-semibold tracking-[0.12em] text-stone-400">
                  어시
                </p>
                <p className="mt-1 text-lg font-bold text-stone-900">
                  {assist}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-stone-200 p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold text-emerald-600">
                01 등번호
              </p>
              <p className="mt-1 text-sm text-stone-400">
                비워두면 아직 배정되지 않은 선수로 저장돼요.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="player-number"
                  className="text-sm font-semibold text-stone-700"
                >
                  등번호
                </label>
                <input
                  id="player-number"
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="17"
                  className="h-14 w-full rounded-xl border border-stone-200 px-4 text-sm font-semibold text-stone-900 outline-none transition placeholder:text-stone-300 focus:border-emerald-300"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-stone-700">미리보기</p>
                <div className="flex h-14 items-center rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm font-semibold text-stone-500">
                  {number ? `#${number}` : "미배정"}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-stone-200 p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold text-emerald-600">
                02 선호 포지션
              </p>
              <p className="mt-1 text-sm text-stone-400">
                라인업·교체 추천에 반영돼요. 복수 선택 가능.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-[20px] border border-stone-200 bg-white px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <p className="text-sm font-semibold text-stone-900">골키퍼</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {playerDetailPositions.GK.map((detail) => {
                    const isActive = detailPositions.includes(detail);

                    return (
                      <button
                        key={detail}
                        type="button"
                        onClick={() => handleToggleDetailPosition(detail)}
                        className={[
                          "rounded-full border px-4 py-2 text-sm font-semibold transition",
                          isActive
                            ? "border-amber-300 bg-amber-50 text-amber-700"
                            : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
                        ].join(" ")}
                      >
                        {detail} {detailPositionLabels.GK[detail]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[20px] border border-stone-200 bg-white px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                  <p className="text-sm font-semibold text-stone-900">수비</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {playerDetailPositions.DF.map((detail) => {
                    const isActive = detailPositions.includes(detail);

                    return (
                      <button
                        key={detail}
                        type="button"
                        onClick={() => handleToggleDetailPosition(detail)}
                        className={[
                          "rounded-full border px-4 py-2 text-sm font-semibold transition",
                          isActive
                            ? "border-blue-300 bg-blue-50 text-blue-700"
                            : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
                        ].join(" ")}
                      >
                        {detail} {detailPositionLabels.DF[detail]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[20px] border border-stone-200 bg-white px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <p className="text-sm font-semibold text-stone-900">미드</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {playerDetailPositions.MF.map((detail) => {
                    const isActive = detailPositions.includes(detail);

                    return (
                      <button
                        key={detail}
                        type="button"
                        onClick={() => handleToggleDetailPosition(detail)}
                        className={[
                          "rounded-full border px-4 py-2 text-sm font-semibold transition",
                          isActive
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
                        ].join(" ")}
                      >
                        {detail} {detailPositionLabels.MF[detail]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[20px] border border-stone-200 bg-white px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <p className="text-sm font-semibold text-stone-900">공격</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {playerDetailPositions.FW.map((detail) => {
                    const isActive = detailPositions.includes(detail);

                    return (
                      <button
                        key={detail}
                        type="button"
                        onClick={() => handleToggleDetailPosition(detail)}
                        className={[
                          "rounded-full border px-4 py-2 text-sm font-semibold transition",
                          isActive
                            ? "border-rose-300 bg-rose-50 text-rose-700"
                            : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
                        ].join(" ")}
                      >
                        {detail} {detailPositionLabels.FW[detail]}
                      </button>
                    );
                  })}
                </div>
              </div>
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
            <div className="space-y-2">
              <label
                htmlFor="player-birth"
                className="text-sm font-semibold text-stone-700"
              >
                생년월일
              </label>
              <input
                id="player-birth"
                type="date"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
                className="h-14 w-full rounded-xl border border-stone-200 px-4 text-sm text-stone-800 outline-none transition focus:border-emerald-300"
              />
            </div>
            <div className="grid gap-2 md:grid-cols-3">
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

              <div className="space-y-2">
                <label
                  htmlFor="player-goal"
                  className="text-sm font-semibold text-stone-700"
                >
                  어시스트
                </label>
                <input
                  id="player-goal"
                  type="number"
                  value={assist}
                  onChange={(e) => setAssist(e.target.value)}
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
  );
}
