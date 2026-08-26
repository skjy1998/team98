import { createDefaultMatchTactics } from "@/lib/tactics/tactics-ui";
import { useConfirmStore } from "@/stores/confirm-store";
import { useToastStore } from "@/stores/toast-store";
import { MatchPlayersPerSide, MatchType } from "@/types/match";
import type { MatchTacticsByQuarter, MatchTacticsSide } from "@/types/tactics";
import type { TeamSport } from "@/types/team";
import { useState } from "react";

interface UseMatchPlayerCountActionParams {
  matchType: MatchType;
  sport: TeamSport;
  playersPerSide: MatchPlayersPerSide;
  quarterCount: number;
  canManage: boolean;
  onChangePlayersPerSide: (
    playersPerSide: MatchPlayersPerSide,
  ) => Promise<boolean>;
  saveTacticsBySide: (
    side: MatchTacticsSide,
    tactics: MatchTacticsByQuarter,
  ) => Promise<boolean>;
  onResetSelection: () => void;
}

export function useMatchPlayerCountAction({
  matchType,
  sport,
  playersPerSide,
  quarterCount,
  canManage,
  onChangePlayersPerSide,
  saveTacticsBySide,
  onResetSelection,
}: UseMatchPlayerCountActionParams) {
  const confirm = useConfirmStore((state) => state.confirm);
  const showToast = useToastStore((state) => state.showToast);
  const [isPlayerCountSaving, setIsPlayerCountSaving] = useState(false);

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

    try {
      const countUpdated = await onChangePlayersPerSide(nextPlayersPerSide);

      if (!countUpdated) {
        showToast("경기 인원 변경에 실패했어요.", "error");
        return;
      }

      const sidesToReset: MatchTacticsSide[] =
        matchType === "자체전" ? ["team_a", "team_b"] : ["our"];

      const defaultTactics = createDefaultMatchTactics(
        sport,
        nextPlayersPerSide,
        quarterCount,
      );

      const resetResults = await Promise.all(
        sidesToReset.map((side) => saveTacticsBySide(side, defaultTactics)),
      );

      if (!resetResults.every(Boolean)) {
        await onChangePlayersPerSide(playersPerSide);
        showToast("전술 초기화에 실패했어요.", "error");
        return;
      }

      onResetSelection();

      showToast(
        `${nextPlayersPerSide}대${nextPlayersPerSide}로 변경했어요.`,
        "success",
      );
    } finally {
      setIsPlayerCountSaving(false);
    }
  };

  return {
    isPlayerCountSaving,
    handleChangePlayersPerSide,
  };
}
