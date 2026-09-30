import type { FeeType } from "@/types/finance";
import type { PlayerType } from "@/types/player";
import type { PlayerRecentMatch } from "@/types/stats";

export const demoPlayers: PlayerType[] = [
  {
    id: "demo-player-1",
    userId: "demo-user",
    name: "김민수",
    position: "MF",
    detailPositions: ["CM"],
    number: 10,
    role: "captain",
    preferredFoot: "right",
    appearance: 12,
    goal: 7,
    assist: 5,
    feeTypeId: "demo-fee-regular",
  },
  {
    id: "demo-player-2",
    name: "장동혁",
    position: "FW",
    detailPositions: ["ST"],
    number: 9,
    preferredFoot: "right",
    appearance: 14,
    goal: 10,
    assist: 3,
    feeTypeId: "demo-fee-regular",
  },
  {
    id: "demo-player-3",
    name: "이재원",
    position: "DF",
    detailPositions: ["CB"],
    number: 4,
    role: "viceCaptain",
    preferredFoot: "both",
    appearance: 13,
    goal: 2,
    assist: 4,
    feeTypeId: "demo-fee-student",
  },
  {
    id: "demo-player-4",
    name: "한승우",
    position: "MF",
    detailPositions: ["CAM"],
    number: 11,
    preferredFoot: "left",
    appearance: 11,
    goal: 6,
    assist: 6,
    feeTypeId: "demo-fee-regular",
  },
  {
    id: "demo-player-5",
    name: "정우성",
    position: "GK",
    detailPositions: ["GK"],
    number: 1,
    preferredFoot: "right",
    appearance: 10,
    goal: 0,
    assist: 1,
    feeTypeId: "demo-fee-student",
  },
  {
    id: "demo-player-6",
    name: "윤석현",
    position: "DF",
    detailPositions: ["RB"],
    number: 2,
    preferredFoot: "right",
    appearance: 9,
    goal: 1,
    assist: 2,
    feeTypeId: "demo-fee-regular",
  },
];

export const demoPlayerRecentMatches: Record<string, PlayerRecentMatch[]> = {
  "demo-player-1": [
    {
      id: "demo-match-1",
      title: "9월 정기 경기",
      date: "2026-09-21",
      attendanceStatus: "attend",
      goal: 2,
      assist: 1,
    },
    {
      id: "demo-match-2",
      title: "9월 친선 경기",
      date: "2026-09-14",
      attendanceStatus: "attend",
      goal: 1,
      assist: 2,
    },
  ],
  "demo-player-2": [
    {
      id: "demo-match-1",
      title: "9월 정기 경기",
      date: "2026-09-21",
      attendanceStatus: "attend",
      goal: 1,
      assist: 0,
    },
  ],
  "demo-player-3": [
    {
      id: "demo-match-1",
      title: "9월 정기 경기",
      date: "2026-09-21",
      attendanceStatus: "attend",
      goal: 0,
      assist: 1,
    },
  ],
};

export const demoFeeTypes: FeeType[] = [
  {
    id: "demo-fee-regular",
    name: "일반 회비",
    description: "월 정기 회비",
    amount: 30000,
  },
  {
    id: "demo-fee-student",
    name: "학생 회비",
    description: "학생 선수 회비",
    amount: 20000,
  },
];
