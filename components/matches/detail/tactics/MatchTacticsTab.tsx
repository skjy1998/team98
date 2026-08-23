import TacticsField from "@/components/tactics/board/TacticsField";
import TacticsSidebar from "@/components/tactics/board/TacticsSidebar";
import TacticsToolbar from "@/components/tactics/board/TacticsToolbar";
import { formationTemplate } from "@/data/formationTemplates";
import { useMatchTactics } from "@/hooks/matches/useMatchTactics";
import { useMatchVotes } from "@/hooks/matches/useMatchVotes";
import { usePlayers } from "@/hooks/players/usePlayers";
import {
  createDefaultMatchTactics,
  getAssignedPlayerIds,
  getAttendPlayerIds,
  getAvailableTacticsPlayers,
  getMatchFormationOptions,
  getPlayerById,
  sortPlayersByRecommendedPosition,
} from "@/lib/tactics/tactics-ui";
import type { FormationName, MatchQuarter, SetPieceKey } from "@/types/tactics";
import { useMemo, useState } from "react";
import MatchQuarterTabs from "../MatchQuarterTabs";
import ContentState from "@/components/common/ContentState";
import type { TeamSport } from "@/types/team";
import type { MatchPlayersPerSide } from "@/types/match";
import { useConfirmStore } from "@/stores/confirm-store";
import { useToastStore } from "@/stores/toast-store";
import { createQuarterOptions } from "@/lib/matches/match-quarter";

interface MatchTacticsTabProps {
  matchId: string;
  sport: TeamSport;
  playersPerSide: MatchPlayersPerSide;
  quarterCount: number;
  onChangePlayersPerSide: (
    playersPerSide: MatchPlayersPerSide,
  ) => Promise<boolean>;
  canManage: boolean;
}

const futsalPlayerCountOptions: readonly MatchPlayersPerSide[] = [
  3, 4, 5, 6, 7,
];

export default function MatchTacticsTab({
  matchId,
  sport,
  playersPerSide,
  quarterCount,
  onChangePlayersPerSide,
  canManage,
}: Readonly<MatchTacticsTabProps>) {
  const confirm = useConfirmStore((state) => state.confirm);
  const showToast = useToastStore((state) => state.showToast);

  const { players, playersLoaded } = usePlayers();
  const { votes, votesLoaded } = useMatchVotes();
  const { tacticsByQuarter, saveTacticsByQuarter, tacticsLoaded } =
    useMatchTactics(matchId, sport, playersPerSide, quarterCount);

  const [selectedQuarter, setSelectedQuarter] = useState<MatchQuarter>("1Q");
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isPlayerCountSaving, setIsPlayerCountSaving] = useState(false);

  const currentTactics = tacticsByQuarter[selectedQuarter];

  const quarterOptions = useMemo(
    () => createQuarterOptions(quarterCount),
    [quarterCount],
  );

  const formationOptions = useMemo(
    () => getMatchFormationOptions(sport, playersPerSide),
    [sport, playersPerSide],
  );

  const {
    formation,
    slots,
    cornerKickPlayerId = "",
    freeKickPlayerId = "",
    penaltyKickPlayerId = "",
  } = currentTactics;

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId),
    [slots, selectedSlotId],
  );
  const currentVotes = useMemo(() => votes[matchId] ?? [], [votes, matchId]);

  // 현재 경기 참석자 id 구하기
  const attendPlayerIds = useMemo(
    () => getAttendPlayerIds(currentVotes),
    [currentVotes],
  );

  const assignedPlayerIds = useMemo(() => getAssignedPlayerIds(slots), [slots]);

  const availablePlayers = useMemo(
    () =>
      getAvailableTacticsPlayers(players, attendPlayerIds, assignedPlayerIds),
    [players, attendPlayerIds, assignedPlayerIds],
  );

  const sortedAvailablePlayers = useMemo(
    () => sortPlayersByRecommendedPosition(availablePlayers, selectedSlot),
    [availablePlayers, selectedSlot],
  );

  const updateCurrentQuarterTactics = (
    updater: (
      current: (typeof tacticsByQuarter)[MatchQuarter],
    ) => (typeof tacticsByQuarter)[MatchQuarter],
  ) => {
    saveTacticsByQuarter((prev) => ({
      ...prev,
      [selectedQuarter]: updater(prev[selectedQuarter]),
    }));
  };

  const handleChangePlayersPerSide = async (
    nextPlayersPerSide: MatchPlayersPerSide,
  ) => {
    if (!canManage || isPlayerCountSaving) return;
    if (nextPlayersPerSide === playersPerSide) return;

    const confirmed = await confirm({
      title: "경기 인원 변경",
      description:
        "경기 인원을 변경하면 모든 쿼터의 포메이션과 선수 배치가 초기화돼요. 변경할까요?",
      confirmLabel: "변경",
    });

    if (!confirmed) return;

    setIsPlayerCountSaving(true);

    const countUpdated = await onChangePlayersPerSide(nextPlayersPerSide);

    if (!countUpdated) {
      showToast("경기 인원 변경에 실패했어요.", "error");
      setIsPlayerCountSaving(false);
      return;
    }

    const nextTactics = createDefaultMatchTactics(
      sport,
      nextPlayersPerSide,
      quarterCount,
    );
    const tacticsSaved = await saveTacticsByQuarter(nextTactics);

    if (!tacticsSaved) {
      await onChangePlayersPerSide(playersPerSide);
      showToast("전술 초기화에 실패했어요.", "error");
      setIsPlayerCountSaving(false);
      return;
    }

    setSelectedSlotId(null);
    showToast(
      `${nextPlayersPerSide}대${nextPlayersPerSide}로 변경했어요.`,
      "success",
    );
    setIsPlayerCountSaving(false);
  };

  const handleFormationChange = (value: FormationName) => {
    if (!canManage) return;

    updateCurrentQuarterTactics((current) => ({
      ...current,
      formation: value,
      slots: formationTemplate[value],
    }));
    setSelectedSlotId(null);
  };

  const handleResetFormation = () => {
    if (!canManage) return;

    updateCurrentQuarterTactics((current) => ({
      ...current,
      slots: formationTemplate[current.formation],
    }));
    setSelectedSlotId(null);
  };

  const handleAssignPlayer = (playerId: string) => {
    if (!canManage) return;
    if (!selectedSlotId) return;

    updateCurrentQuarterTactics((current) => ({
      ...current,
      slots: current.slots.map((slot) =>
        slot.id === selectedSlotId ? { ...slot, playerId } : slot,
      ),
    }));

    setSelectedSlotId(null);
  };

  const handleClearSlot = () => {
    if (!canManage) return;
    if (!selectedSlotId) return;

    updateCurrentQuarterTactics((current) => ({
      ...current,
      slots: current.slots.map((slot) =>
        slot.id === selectedSlotId ? { ...slot, playerId: undefined } : slot,
      ),
    }));

    setSelectedSlotId(null);
  };

  const handleChangeSetPiecePlayer = (key: SetPieceKey, value: string) => {
    if (!canManage) return;

    updateCurrentQuarterTactics((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const findPlayerById = (playerId?: string) =>
    getPlayerById(players, playerId);

  const handleChangeQuarter = (quarter: MatchQuarter) => {
    setSelectedQuarter(quarter);
    setSelectedSlotId(null);
  };

  const handleSelectSlot = (slotId: string | null) => {
    if (!canManage) return;
    setSelectedSlotId(slotId);
  };

  if (!playersLoaded || !votesLoaded || !tacticsLoaded) {
    return (
      <ContentState
        variant="loading"
        title="전술 정보를 불러오는 중..."
        description="경기 포메이션과 선수 배치를 준비하고 있어요."
      />
    );
  }

  return (
    <div className="space-y-6">
      <MatchQuarterTabs
        quarters={quarterOptions}
        selectedQuarter={selectedQuarter}
        onChangeQuarter={handleChangeQuarter}
      />
      {!canManage && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
          전술 배치와 세트피스 설정은 운영진만 수정할 수 있어요.
        </div>
      )}
      <TacticsToolbar
        formation={formation}
        formationOptions={formationOptions}
        onChangeFormation={handleFormationChange}
        onReset={handleResetFormation}
        saveMode="auto"
        canManage={canManage}
        playerCountOptions={
          sport === "futsal" ? futsalPlayerCountOptions : undefined
        }
        playersPerSide={sport === "futsal" ? playersPerSide : undefined}
        onChangePlayersPerSide={handleChangePlayersPerSide}
        isPlayerCountSaving={isPlayerCountSaving}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TacticsField
          formation={formation}
          slots={slots}
          selectedSlotId={selectedSlotId}
          onSelectSlot={handleSelectSlot}
          getPlayerById={findPlayerById}
          canManage={canManage}
        />

        <TacticsSidebar
          playersLoaded={playersLoaded}
          players={players}
          availablePlayers={sortedAvailablePlayers}
          selectedSlot={selectedSlot}
          selectedSlotId={selectedSlotId}
          onAssignPlayer={handleAssignPlayer}
          onClearSlot={handleClearSlot}
          getPlayerById={findPlayerById}
          cornerKickPlayerId={cornerKickPlayerId}
          freeKickPlayerId={freeKickPlayerId}
          penaltyKickPlayerId={penaltyKickPlayerId}
          onChangeCornerKickPlayerId={(value) =>
            handleChangeSetPiecePlayer("cornerKickPlayerId", value)
          }
          onChangeFreeKickPlayerId={(value) =>
            handleChangeSetPiecePlayer("freeKickPlayerId", value)
          }
          onChangePenaltyKickPlayerId={(value) =>
            handleChangeSetPiecePlayer("penaltyKickPlayerId", value)
          }
          playerListEmptyMessage="출석 탭에서 참석 선수를 먼저 체크하세요."
          canManage={canManage}
        />
      </div>
    </div>
  );
}
