"use client";

import TacticsField from "@/components/tactics/TacticsField";
import TacticsSidebar from "@/components/tactics/TacticsSidebar";
import TacticsToolbar from "@/components/tactics/TacticsToolbar";
import { formationTemplate } from "@/data/formationTemplates";
import { usePlayers } from "@/hooks/usePlayers";
import { sortPlayersByRecommendedPosition } from "@/lib/tactics-ui";
import { MatchVotesByMatchId } from "@/types/match-vote";
import type {
  FormationName,
  MatchQuarter,
  MatchTacticsByQuarter,
  QuarterTacticsState,
} from "@/types/tactics";
import { useEffect, useMemo, useState } from "react";

interface MatchTacticsTabProps {
  matchId: string;
}

const quarterOptions: MatchQuarter[] = ["1Q", "2Q", "3Q", "4Q"];

const createDefaultQuarterTactics = (): QuarterTacticsState => ({
  formation: "4-4-2",
  slots: formationTemplate["4-4-2"],
  cornerKickPlayerId: "",
  freeKickPlayerId: "",
  penaltyKickPlayerId: "",
});

const createDefaultMatchTactics = (): MatchTacticsByQuarter => ({
  "1Q": createDefaultQuarterTactics(),
  "2Q": createDefaultQuarterTactics(),
  "3Q": createDefaultQuarterTactics(),
  "4Q": createDefaultQuarterTactics(),
});

export default function MatchTacticsTab({
  matchId,
}: Readonly<MatchTacticsTabProps>) {
  const { players, loaded } = usePlayers();

  const [selectedQuarter, setSelectedQuarter] = useState<MatchQuarter>("1Q");
  const [tacticsByQuarter, setTacticsByQuarter] =
    useState<MatchTacticsByQuarter>(createDefaultMatchTactics());
  const [tacticsLoaded, setTacticsLoaded] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [votes, setVotes] = useState<MatchVotesByMatchId>({});
  const [votesLoaded, setVotesLoaded] = useState(false);

  const storageKey = `match-tactics-${matchId}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      const parsed = JSON.parse(saved) as Partial<MatchTacticsByQuarter>;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTacticsByQuarter({
        ...createDefaultMatchTactics(),
        ...parsed,
      });
    }

    setTacticsLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!tacticsLoaded) return;
    localStorage.setItem(storageKey, JSON.stringify(tacticsByQuarter));
  }, [storageKey, tacticsByQuarter, tacticsLoaded]);

  // 출석 불러오기
  useEffect(() => {
    const savedVotes = localStorage.getItem("match-votes");

    if (savedVotes) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVotes(JSON.parse(savedVotes));
    }
    setVotesLoaded(true);
  }, []);

  const currentTactics = tacticsByQuarter[selectedQuarter];

  const formation = currentTactics.formation;
  const slots = currentTactics.slots;
  const cornerKickPlayerId = currentTactics.cornerKickPlayerId ?? "";
  const freeKickPlayerId = currentTactics.freeKickPlayerId ?? "";
  const penaltyKickPlayerId = currentTactics.penaltyKickPlayerId ?? "";

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId),
    [slots, selectedSlotId],
  );

  // 현재 경기 참석자 id 구하기
  const attendPlayerIds = useMemo(() => {
    const currentVotes = votes[matchId] ?? [];

    return new Set(
      currentVotes
        .filter((vote) => vote.status === "attend")
        .map((vote) => vote.playerId),
    );
  }, [votes, matchId]);

  // 전술 탭에서 쓸 선수 목록 만들기
  const tacticsPlayers = useMemo(() => {
    return players.filter((player) => attendPlayerIds.has(player.id));
  }, [players, attendPlayerIds]);

  const getPlayerById = (playerId?: string) =>
    players.find((player) => player.id === playerId);

  const assignedPlayerIds = useMemo(
    () =>
      new Set(slots.flatMap((slot) => (slot.playerId ? [slot.playerId] : []))),
    [slots],
  );

  const availablePlayers = useMemo(
    () => tacticsPlayers.filter((player) => !assignedPlayerIds.has(player.id)),
    [tacticsPlayers, assignedPlayerIds],
  );

  const sortedAvailablePlayers = useMemo(
    () => sortPlayersByRecommendedPosition(availablePlayers, selectedSlot),
    [availablePlayers, selectedSlot],
  );

  const handleFormationChange = (value: FormationName) => {
    setTacticsByQuarter((prev) => ({
      ...prev,
      [selectedQuarter]: {
        ...prev[selectedQuarter],
        formation: value,
        slots: formationTemplate[value],
      },
    }));
    setSelectedSlotId(null);
  };

  const handleResetFormation = () => {
    setTacticsByQuarter((prev) => ({
      ...prev,
      [selectedQuarter]: {
        ...prev[selectedQuarter],
        slots: formationTemplate[prev[selectedQuarter].formation],
      },
    }));
    setSelectedSlotId(null);
  };

  const handleAssignPlayer = (playerId: string) => {
    if (!selectedSlotId) return;

    setTacticsByQuarter((prev) => ({
      ...prev,
      [selectedQuarter]: {
        ...prev[selectedQuarter],
        slots: prev[selectedQuarter].slots.map((slot) =>
          slot.id === selectedSlotId ? { ...slot, playerId } : slot,
        ),
      },
    }));

    setSelectedSlotId(null);
  };

  const handleClearSlot = () => {
    if (!selectedSlotId) return;

    setTacticsByQuarter((prev) => ({
      ...prev,
      [selectedQuarter]: {
        ...prev[selectedQuarter],
        slots: prev[selectedQuarter].slots.map((slot) =>
          slot.id === selectedSlotId ? { ...slot, playerId: undefined } : slot,
        ),
      },
    }));

    setSelectedSlotId(null);
  };

  const handleChangeCornerKickPlayerId = (value: string) => {
    setTacticsByQuarter((prev) => ({
      ...prev,
      [selectedQuarter]: {
        ...prev[selectedQuarter],
        cornerKickPlayerId: value,
      },
    }));
  };

  const handleChangeFreeKickPlayerId = (value: string) => {
    setTacticsByQuarter((prev) => ({
      ...prev,
      [selectedQuarter]: {
        ...prev[selectedQuarter],
        freeKickPlayerId: value,
      },
    }));
  };

  const handleChangePenaltyKickPlayerId = (value: string) => {
    setTacticsByQuarter((prev) => ({
      ...prev,
      [selectedQuarter]: {
        ...prev[selectedQuarter],
        penaltyKickPlayerId: value,
      },
    }));
  };

  const cornerKickPlayer = getPlayerById(cornerKickPlayerId);
  const freeKickPlayer = getPlayerById(freeKickPlayerId);
  const penaltyKickPlayer = getPlayerById(penaltyKickPlayerId);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-stone-200 bg-white p-1">
        <div className="grid grid-cols-4 gap-1">
          {quarterOptions.map((quarter) => {
            const isActive = selectedQuarter === quarter;

            return (
              <button
                key={quarter}
                type="button"
                onClick={() => {
                  setSelectedQuarter(quarter);
                  setSelectedSlotId(null);
                }}
                className={[
                  "rounded-lg px-3 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-stone-500 hover:bg-stone-50",
                ].join(" ")}
              >
                {quarter}
              </button>
            );
          })}
        </div>
      </section>

      <TacticsToolbar
        formation={formation}
        onChangeFormation={handleFormationChange}
        onReset={handleResetFormation}
        saveMode="auto"
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TacticsField
          formation={formation}
          slots={slots}
          selectedSlotId={selectedSlotId}
          onSelectSlot={setSelectedSlotId}
          getPlayerById={getPlayerById}
        />

        <TacticsSidebar
          loaded={loaded}
          players={players}
          availablePlayers={sortedAvailablePlayers}
          selectedSlot={selectedSlot}
          selectedSlotId={selectedSlotId}
          onAssignPlayer={handleAssignPlayer}
          onClearSlot={handleClearSlot}
          getPlayerById={getPlayerById}
          cornerKickPlayerId={cornerKickPlayerId}
          freeKickPlayerId={freeKickPlayerId}
          penaltyKickPlayerId={penaltyKickPlayerId}
          onChangeCornerKickPlayerId={handleChangeCornerKickPlayerId}
          onChangeFreeKickPlayerId={handleChangeFreeKickPlayerId}
          onChangePenaltyKickPlayerId={handleChangePenaltyKickPlayerId}
          cornerKickPlayer={cornerKickPlayer}
          freeKickPlayer={freeKickPlayer}
          penaltyKickPlayer={penaltyKickPlayer}
          playerListemptyMessage="출석 탭에서 참석 선수를 먼저 체크하세요."
        />
      </div>
    </div>
  );
}
