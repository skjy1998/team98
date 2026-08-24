import type { MatchItem, MatchRecordMap } from "@/types/match";
import type { DashboardTodoItem } from "@/types/dashboard";
import type { MatchVotesByMatchId } from "@/types/match-vote";
import type { PaymentStatusRow } from "@/types/finance";
import type { MatchAttendanceByMatchId } from "@/types/match-attendance";
import type { NotificationSettings } from "@/types/settings";
import { getDisplayMatches } from "../matches/match-ui";

interface GetDashboardTodoItemsParams {
  upcomingMatches: MatchItem[];
  displayMatches: MatchItem[];
  votes: MatchVotesByMatchId;
  attendance: MatchAttendanceByMatchId;
  paymentStatusRows: PaymentStatusRow[];
  myPlayerId?: string;
  currentMonth: string;
  unpaidFineCount: number;
  unpaidFineAmount: number;
  canManage: boolean;
  notificationSettings: NotificationSettings;
}

function getMatchTime(match: MatchItem) {
  return new Date(`${match.date}T${match.startTime}`).getTime();
}

function getMatchEndTime(match: MatchItem) {
  return new Date(
    `${match.date}T${match.endTime || match.startTime}`,
  ).getTime();
}

export function getDashboardMatchData(
  matches: MatchItem[],
  records: MatchRecordMap,
) {
  const displayMatches = getDisplayMatches(matches, records);

  return {
    displayMatches,
    upcomingMatches: getDashboardUpcomingMatches(displayMatches),
    recentMatch: getDashboardRecentMatch(displayMatches),
  };
}

export function getDashboardUpcomingMatches(matches: MatchItem[]) {
  const now = Date.now();

  return [...matches]
    .filter((match) => match.status !== "canceled" && getMatchTime(match) > now)
    .sort((a, b) => getMatchTime(a) - getMatchTime(b));
}

export function getDashboardRecentMatch(matches: MatchItem[]) {
  const now = Date.now();

  return [...matches]
    .filter(
      (match) =>
        match.status !== "canceled" &&
        getMatchEndTime(match) <= now &&
        match.ourScore !== undefined &&
        match.opponentScore !== undefined,
    )
    .sort((a, b) => getMatchTime(b) - getMatchTime(a))[0];
}

export function getUnvotedMatchTodos(
  upcomingMatches: MatchItem[],
  votes: MatchVotesByMatchId,
  myPlayerId: string | undefined,
): DashboardTodoItem[] {
  if (!myPlayerId) return [];

  return upcomingMatches
    .filter((match) => {
      const hasVoted = votes[match.id]?.some(
        (vote) => vote.playerId === myPlayerId && vote.status !== "unvoted",
      );

      return !hasVoted && new Date(match.voteDeadline).getTime() > Date.now();
    })
    .map((match) => ({
      id: `match-vote-${match.id}`,
      type: "match-vote" as const,
      title: `${match.title} 투표가 필요해요`,
      description: `투표 마감 ${match.voteDeadline}`,
      href: `/matches/${match.id}?tab=vote`,
      priority: 1,
    }));
}

export function getUnpaidFeeTodos(
  paymentStatusRows: PaymentStatusRow[],
  myPlayerId: string | undefined,
  currentMonth: string,
): DashboardTodoItem[] {
  if (!myPlayerId) return [];

  const myPayment = paymentStatusRows.find(
    (row) => row.playerId === myPlayerId,
  );

  if (!myPayment || myPayment.status === "paid") return [];

  const [year, month] = currentMonth.split("-");

  return [
    {
      id: `fee-unpaid-${currentMonth}`,
      type: "fee-unpaid",
      title: `${Number(month)}월 회비가 미납 상태에요.`,
      description: `${year}년 ${Number(month)}월 납부 현황을 확인하세요.`,
      href: "/finance?tab=payments",
      priority: 2,
    },
  ];
}

export function getUnpaidFineTodos(
  count: number,
  totalAmount: number,
): DashboardTodoItem[] {
  if (count === 0) return [];

  return [
    {
      id: "fine-unpaid",
      type: "fine-unpaid",
      title: `미납 벌금이 ${count}건 있어요.`,
      description: `총 ${totalAmount.toLocaleString("ko-KR")}원을 확인하세요.`,
      href: "/finance?tab=fines",
      priority: 3,
    },
  ];
}

export function getAttendanceManagementTodos(
  matches: MatchItem[],
  votes: MatchVotesByMatchId,
  attendance: MatchAttendanceByMatchId,
  canManage: boolean,
): DashboardTodoItem[] {
  if (!canManage) return [];

  const now = Date.now();

  return [...matches]
    .filter((match) => {
      if (match.status === "canceled") return false;

      return getMatchEndTime(match) <= now;
    })
    .sort((a, b) => getMatchTime(b) - getMatchTime(a))
    .filter((match) => {
      const attendingPlayerIds = (votes[match.id] ?? [])
        .filter((vote) => vote.status === "attend")
        .map((vote) => vote.playerId);

      if (attendingPlayerIds.length === 0) return false;

      const checkedPlayerIds = new Set(
        (attendance[match.id] ?? []).map((item) => item.playerId),
      );

      return attendingPlayerIds.some(
        (playerId) => !checkedPlayerIds.has(playerId),
      );
    })
    .map((match) => ({
      id: `attendance-management-${match.id}`,
      type: "management" as const,
      title: `${match.title} 출석 확인이 필요해요.`,
      description: "참석 투표 인원의 실제 출석 상태를 확인하세요.",
      href: `/matches/${match.id}?tab=attendance`,
      priority: 4,
    }));
}

export function getRecordManagementTodos(
  matches: MatchItem[],
  canManage: boolean,
): DashboardTodoItem[] {
  if (!canManage) return [];

  const now = Date.now();

  return [...matches]
    .filter((match) => {
      if (match.status === "canceled" || match.recordCompletedAt) {
        return false;
      }

      const matchEndTime = new Date(
        `${match.date}T${match.endTime || match.startTime}`,
      ).getTime();

      return matchEndTime < now;
    })
    .sort((a, b) => getMatchTime(b) - getMatchTime(a))
    .map((match) => ({
      id: `record-management-${match.id}`,
      type: "management" as const,
      title: `${match.title} 경기 기록을 완료해 주세요.`,
      description: "득점과 실점 기록을 확인하고 완료 상태로 변경하세요.",
      href: `/matches/${match.id}?tab=record`,
      priority: 5,
    }));
}

export function getDashboardTodoItems({
  upcomingMatches,
  displayMatches,
  votes,
  attendance,
  paymentStatusRows,
  myPlayerId,
  currentMonth,
  unpaidFineCount,
  unpaidFineAmount,
  canManage,
  notificationSettings,
}: GetDashboardTodoItemsParams): DashboardTodoItem[] {
  const matchTodos = notificationSettings.matchEnabled
    ? getUnvotedMatchTodos(upcomingMatches, votes, myPlayerId)
    : [];

  const feeTodos = notificationSettings.financeEnabled
    ? getUnpaidFeeTodos(paymentStatusRows, myPlayerId, currentMonth)
    : [];

  const fineTodos = notificationSettings.financeEnabled
    ? getUnpaidFineTodos(unpaidFineCount, unpaidFineAmount)
    : [];

  const attendanceTodos = notificationSettings.managementEnabled
    ? getAttendanceManagementTodos(displayMatches, votes, attendance, canManage)
    : [];

  const recordTodos = notificationSettings.managementEnabled
    ? getRecordManagementTodos(displayMatches, canManage)
    : [];

  return [
    ...matchTodos,
    ...feeTodos,
    ...fineTodos,
    ...attendanceTodos,
    ...recordTodos,
  ].sort((a, b) => a.priority - b.priority);
}
