import { useRouter, useSearchParams } from "next/navigation";
import type { MatchDetailPageData } from "./useMatchDetailPageData";
import { useToastStore } from "@/stores/toast-store";
import { useConfirmStore } from "@/stores/confirm-store";
import { getMatchDetailTab } from "@/lib/matches/match-ui";
import {
  MatchCreateFormValue,
  MatchDetailTab,
  MatchPlayersPerSide,
} from "@/types/match";

type MatchDetailActionsParams = Pick<
  MatchDetailPageData,
  | "match"
  | "updateMatch"
  | "updateMatchPlayersPerSide"
  | "updateMatchRecordInclusion"
  | "setMatchRecordCompletion"
  | "deleteMatch"
>;

export function useMatchDetailActions({
  match,
  updateMatch,
  updateMatchPlayersPerSide,
  updateMatchRecordInclusion,
  setMatchRecordCompletion,
  deleteMatch,
}: MatchDetailActionsParams) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showToast = useToastStore((state) => state.showToast);
  const confirm = useConfirmStore((state) => state.confirm);

  const activeTab = getMatchDetailTab(searchParams.get("tab"));

  const handleChangeTab = (tab: MatchDetailTab) => {
    if (!match) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);

    router.replace(`/matches/${match.id}?${params.toString()}`);
  };

  const handleUpdateMatch = async (value: MatchCreateFormValue) => {
    if (!match) return false;

    const shouldResetTactics =
      match.sport !== value.sport ||
      match.playersPerSide !== value.playersPerSide ||
      match.quarterCount !== value.quarterCount;

    if (shouldResetTactics) {
      const confirmed = await confirm({
        title: "경기 구성 변경",
        description:
          "참가 인원이나 쿼터 수를 변경하면 저장된 모든 쿼터의 포메이션과 선수 배치가 초기화돼요. 변경할까요?",
        confirmLabel: "변경",
      });

      if (!confirmed) return false;
    }

    const success = await updateMatch(match.id, value);

    if (!success) {
      showToast("경기 정보 수정에 실패했어요.", "error");
      return false;
    }

    showToast(
      shouldResetTactics
        ? "경기 구성을 변경하고 기존 전술을 초기화했어요."
        : "경기 정보가 수정됐어요.",
      "success",
    );

    return true;
  };

  const handleDeleteMatch = async () => {
    if (!match) return;

    const confirmed = await confirm({
      title: "경기 삭제",
      description: `${match.title} 경기를 삭제할까요? 연결된 기록과 출석 데이터도 함께 삭제되며 되돌릴 수 없어요.`,
      confirmLabel: "삭제",
      variant: "danger",
    });

    if (!confirmed) return;

    const success = await deleteMatch(match.id);

    if (!success) {
      showToast("경기 삭제에 실패했어요.", "error");
      return;
    }

    showToast("경기를 삭제했어요.", "success");
    router.push("/matches");
  };

  const handleChangeRecordCompletion = async (completed: boolean) => {
    if (!match) return false;

    return setMatchRecordCompletion(match.id, completed);
  };

  const handleChangePlayersPerSide = async (
    playersPerSide: MatchPlayersPerSide,
  ) => {
    if (!match) return false;

    return updateMatchPlayersPerSide(match.id, playersPerSide);
  };

  const handleChangeRecordInclusion = async (countsTowardRecord: boolean) => {
    if (!match) return false;

    return updateMatchRecordInclusion(match.id, countsTowardRecord);
  };

  return {
    activeTab,
    handleChangeTab,
    handleUpdateMatch,
    handleDeleteMatch,
    handleChangeRecordCompletion,
    handleChangePlayersPerSide,
    handleChangeRecordInclusion,
  };
}
