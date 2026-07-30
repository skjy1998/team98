import type { FineCharge, FineRule } from "@/types/finance";
import type { MatchItem } from "@/types/match";
import type { MatchAttendance } from "@/types/match-attendance";
import type { MatchVote } from "@/types/match-vote";
import type { PlayerType } from "@/types/player";

export interface FineTarget {
  playerId: string;
  playerName: string;
  ruleId: string;
  ruleName: string;
  trigger: FineRule["trigger"];
  amount: number;
  description: string;
}

function getFineRuleMap(fineRules: FineRule[]) {
  return {
    late: fineRules.find((rule) => rule.trigger === "late"),
    absence: fineRules.find((rule) => rule.trigger === "absence"),
    noshow: fineRules.find((rule) => rule.trigger === "noshow"),
  };
}

function hasExistingFineCharge(
  fineCharges: FineCharge[],
  matchId: string,
  playerId: string,
  ruleId: string,
) {
  return fineCharges.some(
    (charge) =>
      charge.matchId === matchId &&
      charge.playerId === playerId &&
      charge.ruleId === ruleId,
  );
}

export function getFineTargetsByMatch({
  match,
  players,
  attendance,
  votes,
  fineRules,
  fineCharges,
}: {
  match: MatchItem;
  players: PlayerType[];
  attendance: MatchAttendance[];
  votes: MatchVote[];
  fineRules: FineRule[];
  fineCharges: FineCharge[];
}) {
  const ruleMap = getFineRuleMap(fineRules);
  const lateRule = ruleMap.late;
  const absenceRule = ruleMap.absence;
  const noshowRule = ruleMap.noshow;

  const targets: FineTarget[] = [];
  const votePlayerIds = new Set(
    votes
      .filter((vote) => vote.status !== "unvoted")
      .map((vote) => vote.playerId),
  );

  attendance.forEach((item) => {
    const player = players.find((current) => current.id === item.playerId);
    if (!player) return;

    if (item.status === "late" && lateRule) {
      if (
        !hasExistingFineCharge(fineCharges, match.id, player.id, lateRule.id)
      ) {
        targets.push({
          playerId: player.id,
          playerName: player.name,
          ruleId: lateRule.id,
          ruleName: lateRule.name,
          trigger: lateRule.trigger,
          amount: lateRule.amount,
          description: `[late] ${match.date} 지각 벌금 (${player.name})`,
        });
      }
    }

    if (item.status === "absent" && absenceRule) {
      if (
        !hasExistingFineCharge(fineCharges, match.id, player.id, absenceRule.id)
      ) {
        targets.push({
          playerId: player.id,
          playerName: player.name,
          ruleId: absenceRule.id,
          ruleName: absenceRule.name,
          trigger: absenceRule.trigger,
          amount: absenceRule.amount,
          description: `[absence] ${match.date} 무단불참 벌금 (${player.name})`,
        });
      }
    }
  });

  if (noshowRule) {
    players.forEach((player) => {
      if (votePlayerIds.has(player.id)) return;

      if (
        !hasExistingFineCharge(fineCharges, match.id, player.id, noshowRule.id)
      ) {
        targets.push({
          playerId: player.id,
          playerName: player.name,
          ruleId: noshowRule.id,
          ruleName: noshowRule.name,
          trigger: noshowRule.trigger,
          amount: noshowRule.amount,
          description: `[noshow] ${match.date} 미투표 벌금 (${player.name})`,
        });
      }
    });
  }

  return targets;
}
