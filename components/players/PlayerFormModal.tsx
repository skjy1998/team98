"use client";

import { useState } from "react";
import { playerPositions, type Playertype } from "@/types/player";

interface PlayerFormModalProps {
  player: Playertype | null;
  onClose: () => void;
  onSave: (player: Playertype) => void;
}

export default function PlayerFormModal({
  player,
  onClose,
  onSave,
}: Readonly<PlayerFormModalProps>) {
  const [name, setName] = useState(player?.name ?? "");
  const [pos, setPos] = useState(player?.position ?? "");
  const [number, setNumber] = useState(player ? String(player.number) : "");
  const [birth, setBirth] = useState(player?.birth ?? "");
  const [appearance, setAppearance] = useState(
    player ? String(player.appearance) : "",
  );
  const [goal, setGoal] = useState(player ? String(player.goal) : "");

  const handleSubmit = () => {
    if (!name || !pos || !number) {
      alert("필수값을 입력해주세요");
      return;
    }

    onSave({
      id: player?.id ?? crypto.randomUUID(),
      name,
      position: pos,
      number: Number(number),
      birth,
      appearance: appearance ? Number(appearance) : 0,
      goal: goal ? Number(goal) : 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] h-[600px] rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold">
          {player ? "선수 수정" : "선수 등록"}
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          className="w-full border px-3 py-2 rounded-lg"
        />

        <select
          value={pos}
          onChange={(e) => setPos(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        >
          <option value="">포지션 선택</option>
          {playerPositions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>

        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="등번호"
          type="number"
          className="w-full border px-3 py-2 rounded-lg"
        />

        <input
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
          type="date"
          className="w-full border px-3 py-2 rounded-lg"
        />

        <input
          value={appearance}
          onChange={(e) => setAppearance(e.target.value)}
          placeholder="출전 (선택)"
          className="w-full border px-3 py-2 rounded-lg"
        />

        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="득점 (선택)"
          type="number"
          className="w-full border px-3 py-2 rounded-lg"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm text-gray-500"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm"
          >
            {player ? "수정" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
