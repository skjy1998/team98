"use client";

import {
  demoBoardComments,
  demoBoardLikes,
  demoBoardPosts,
} from "@/lib/demo/demo-board-data";
import { demoMatches, demoMatchRecords } from "@/lib/demo/demo-matches-data";
import { demoPlayers } from "@/lib/demo/demo-players-data";
import { createDefaultMatchTacticsBySide } from "@/lib/tactics/tactics-ui";
import {
  TeamPost,
  TeamPostCommentsByPostId,
  TeamPostFormValue,
  TeamPostLikesByPostId,
} from "@/types/board";
import type {
  MatchCreateFormValue,
  MatchItem,
  MatchPlayersPerSide,
  MatchRecordEvent,
  MatchRecordEventType,
  MatchRecordMap,
  SelfMatchSide,
} from "@/types/match";
import {
  MatchAttendanceByMatchId,
  MatchAttendanceStatus,
} from "@/types/match-attendance";
import { MatchMvpVotesByMatchId } from "@/types/match-mvp";
import type { MatchVotesByMatchId, VoteStatus } from "@/types/match-vote";
import type { PlayerType, TeamMemberRole } from "@/types/player";
import {
  MatchTacticsByQuarter,
  MatchTacticsBySide,
  MatchTacticsSide,
} from "@/types/tactics";
import { TeamSport } from "@/types/team";
import { createContext, type ReactNode, useContext, useState } from "react";

const DemoModeContext = createContext(false);

interface DemoDataContextValue {
  players: PlayerType[];
  addPlayer: (player: PlayerType) => void;
  updatePlayer: (player: PlayerType, teamMemberRole: TeamMemberRole) => void;
  deletePlayer: (playerId: string) => void;

  matches: MatchItem[];
  addMatch: (value: MatchCreateFormValue, seasonId: string) => Promise<boolean>;
  updateMatch: (
    matchId: string,
    value: MatchCreateFormValue,
  ) => Promise<boolean>;
  deleteMatch: (matchId: string) => void;

  matchVotes: MatchVotesByMatchId;
  saveVote: (
    matchId: string,
    playerId: string,
    status: VoteStatus,
  ) => Promise<boolean>;
  deleteVote: (matchId: string, playerId: string) => Promise<boolean>;

  matchAttendance: MatchAttendanceByMatchId;
  saveVoteSide: (
    matchId: string,
    playerId: string,
    side: SelfMatchSide | null,
  ) => Promise<boolean>;
  saveAttendance: (
    matchId: string,
    playerId: string,
    status: MatchAttendanceStatus,
  ) => Promise<boolean>;
  deleteAttendance: (matchId: string, playerId: string) => Promise<boolean>;

  matchTactics: Record<string, MatchTacticsBySide>;
  updateMatchPlayersPerSide: (
    matchId: string,
    playersPerSide: MatchPlayersPerSide,
  ) => Promise<boolean>;
  saveMatchTactics: (
    matchId: string,
    sport: TeamSport,
    playersPerSide: MatchPlayersPerSide,
    quarterCount: number,
    side: MatchTacticsSide,
    updater:
      | MatchTacticsByQuarter
      | ((current: MatchTacticsByQuarter) => MatchTacticsByQuarter),
  ) => Promise<boolean>;

  matchRecords: MatchRecordMap;
  addRecordEvent: (
    matchId: string,
    type: MatchRecordEventType,
  ) => Promise<boolean>;
  updateRecordEvent: (
    matchId: string,
    eventId: string,
    updates: Partial<MatchRecordEvent>,
  ) => Promise<boolean>;
  deleteRecordEvent: (matchId: string, eventId: string) => Promise<boolean>;
  reorderRecordEvents: (
    matchId: string,
    activeId: string,
    overId: string,
  ) => Promise<boolean>;
  setMatchRecordCompletion: (
    matchId: string,
    completed: boolean,
  ) => Promise<boolean>;
  updateMatchRecordInclusion: (
    matchId: string,
    countsTowardRecord: boolean,
  ) => Promise<boolean>;

  matchMvpVotes: MatchMvpVotesByMatchId;
  saveMvpVote: (matchId: string, candidatePlayerId: string) => Promise<boolean>;
  deleteMvpVote: (matchId: string) => Promise<boolean>;

  boardPosts: TeamPost[];
  createBoardPost: (value: TeamPostFormValue) => Promise<boolean>;
  updateBoardPost: (
    postId: string,
    value: TeamPostFormValue,
  ) => Promise<boolean>;
  deleteBoardPost: (postId: string) => Promise<boolean>;
  incrementBoardPostViewCount: (postId: string) => Promise<boolean>;

  boardComments: TeamPostCommentsByPostId;
  createBoardComment: (postId: string, content: string) => Promise<boolean>;
  updateBoardComment: (commentId: string, content: string) => Promise<boolean>;
  deleteBoardComment: (commentId: string) => Promise<boolean>;

  boardLikes: TeamPostLikesByPostId;
  toggleBoardPostLike: (postId: string) => Promise<boolean>;
}

const DemoDataContext = createContext<DemoDataContextValue | null>(null);

const initialMatchVotes: MatchVotesByMatchId = {
  "demo-match-upcoming": [
    { playerId: "demo-player-1", status: "attend" },
    { playerId: "demo-player-2", status: "attend" },
    { playerId: "demo-player-3", status: "pending" },
  ],
  "demo-match-recent": [
    { playerId: "demo-player-1", status: "attend" },
    { playerId: "demo-player-2", status: "attend" },
    { playerId: "demo-player-3", status: "attend" },
  ],
  "demo-match-self": [
    { playerId: "demo-player-1", status: "attend", side: "team_a" },
    { playerId: "demo-player-2", status: "attend", side: "team_b" },
    { playerId: "demo-player-3", status: "attend", side: "team_a" },
    { playerId: "demo-player-4", status: "attend", side: "team_b" },
  ],
};

const initialMatchAttendance: MatchAttendanceByMatchId = {
  "demo-match-recent": [
    { playerId: "demo-player-1", status: "attend" },
    { playerId: "demo-player-2", status: "attend" },
    { playerId: "demo-player-3", status: "late" },
  ],
  "demo-match-self": [
    { playerId: "demo-player-1", status: "attend" },
    { playerId: "demo-player-2", status: "attend" },
    { playerId: "demo-player-3", status: "attend" },
    { playerId: "demo-player-4", status: "absent" },
  ],
};

const initialMatchMvpVotes: MatchMvpVotesByMatchId = {
  "demo-match-recent": [
    {
      id: "demo-mvp-vote-1",
      matchId: "demo-match-recent",
      candidatePlayerId: "demo-player-2",
      voterUserId: "demo-user",
      createdAt: "2026-09-21T13:30:00",
      updatedAt: "2026-09-21T13:30:00",
    },
  ],
};

function isUpcomingMatch(value: MatchCreateFormValue) {
  return new Date(`${value.date}T${value.startTime}`) > new Date();
}

export function DemoModeProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [players, setPlayers] = useState(() => demoPlayers);
  const [matches, setMatches] = useState(() => demoMatches);
  const [matchVotes, setMatchVotes] =
    useState<MatchVotesByMatchId>(initialMatchVotes);
  const [matchAttendance, setMatchAttendance] =
    useState<MatchAttendanceByMatchId>(initialMatchAttendance);
  const [matchTactics, setMatchTactics] = useState<
    Record<string, MatchTacticsBySide>
  >({});
  const [matchRecords, setMatchRecords] =
    useState<MatchRecordMap>(demoMatchRecords);
  const [matchMvpVotes, setMatchMvpVotes] =
    useState<MatchMvpVotesByMatchId>(initialMatchMvpVotes);
  const [boardPosts, setBoardPosts] = useState(() => demoBoardPosts);
  const [boardComments, setBoardComments] = useState<TeamPostCommentsByPostId>(
    () => demoBoardComments,
  );
  const [boardLikes, setBoardLikes] = useState<TeamPostLikesByPostId>(
    () => demoBoardLikes,
  );

  const addPlayer = (player: PlayerType) => {
    setPlayers((current) => [...current, player]);
  };

  const updatePlayer = (player: PlayerType, teamMemberRole: TeamMemberRole) => {
    setPlayers((current) =>
      current.map((currentPlayer) =>
        currentPlayer.id === player.id
          ? { ...player, teamMemberRole }
          : currentPlayer,
      ),
    );
  };

  const deletePlayer = (playerId: string) => {
    setPlayers((current) => current.filter((player) => player.id !== playerId));
  };

  const addMatch = async (value: MatchCreateFormValue, seasonId: string) => {
    const nextMatch: MatchItem = {
      id: crypto.randomUUID(),
      seasonId,
      ...value,
      status: "scheduled",
      isUpcoming: isUpcomingMatch(value),
      countsTowardRecord: true,
    };

    setMatches((current) => [...current, nextMatch]);
    return true;
  };

  const updateMatch = async (matchId: string, value: MatchCreateFormValue) => {
    setMatches((current) =>
      current.map((match) =>
        match.id === matchId
          ? {
              ...match,
              ...value,
              isUpcoming: isUpcomingMatch(value),
            }
          : match,
      ),
    );

    return true;
  };

  const deleteMatch = (matchId: string) => {
    setMatches((current) => current.filter((match) => match.id !== matchId));
    setMatchVotes((current) => {
      const remainingVotes = { ...current };
      delete remainingVotes[matchId];
      return remainingVotes;
    });
    setMatchAttendance((current) => {
      const remainingAttendance = { ...current };
      delete remainingAttendance[matchId];
      return remainingAttendance;
    });
    setMatchTactics((current) => {
      const remainingTactics = { ...current };
      delete remainingTactics[matchId];
      return remainingTactics;
    });
    setMatchRecords((current) => {
      const remainingRecords = { ...current };
      delete remainingRecords[matchId];
      return remainingRecords;
    });
    setMatchMvpVotes((current) => {
      const remainingMvpVotes = { ...current };
      delete remainingMvpVotes[matchId];
      return remainingMvpVotes;
    });
  };

  const saveVote = async (
    matchId: string,
    playerId: string,
    status: VoteStatus,
  ) => {
    setMatchVotes((current) => ({
      ...current,
      [matchId]: [
        ...(current[matchId] ?? []).filter(
          (vote) => vote.playerId !== playerId,
        ),
        { playerId, status },
      ],
    }));

    return true;
  };

  const deleteVote = async (matchId: string, playerId: string) => {
    setMatchVotes((current) => ({
      ...current,
      [matchId]: (current[matchId] ?? []).filter(
        (vote) => vote.playerId !== playerId,
      ),
    }));

    return true;
  };

  const saveVoteSide = async (
    matchId: string,
    playerId: string,
    side: SelfMatchSide | null,
  ) => {
    const currentVote = matchVotes[matchId]?.find(
      (vote) => vote.playerId === playerId,
    );

    if (currentVote?.status !== "attend") return false;

    setMatchVotes((current) => ({
      ...current,
      [matchId]: (current[matchId] ?? []).map((vote) =>
        vote.playerId === playerId
          ? { ...vote, side: side ?? undefined }
          : vote,
      ),
    }));

    return true;
  };

  const saveAttendance = async (
    matchId: string,
    playerId: string,
    status: MatchAttendanceStatus,
  ) => {
    setMatchAttendance((current) => ({
      ...current,
      [matchId]: [
        ...(current[matchId] ?? []).filter(
          (attendance) => attendance.playerId !== playerId,
        ),
        { playerId, status },
      ],
    }));

    return true;
  };

  const deleteAttendance = async (matchId: string, playerId: string) => {
    setMatchAttendance((current) => ({
      ...current,
      [matchId]: (current[matchId] ?? []).filter(
        (attendance) => attendance.playerId !== playerId,
      ),
    }));

    return true;
  };

  const updateMatchPlayersPerSide = async (
    matchId: string,
    playersPerSide: MatchPlayersPerSide,
  ) => {
    setMatches((current) =>
      current.map((match) =>
        match.id === matchId ? { ...match, playersPerSide } : match,
      ),
    );

    return true;
  };

  const saveMatchTactics = async (
    matchId: string,
    sport: TeamSport,
    playersPerSide: MatchPlayersPerSide,
    quarterCount: number,
    side: MatchTacticsSide,
    updater:
      | MatchTacticsByQuarter
      | ((current: MatchTacticsByQuarter) => MatchTacticsByQuarter),
  ) => {
    setMatchTactics((current) => {
      const currentBySide =
        current[matchId] ??
        createDefaultMatchTacticsBySide(sport, playersPerSide, quarterCount);

      const currentByQuarter = currentBySide[side];
      const nextByQuarter =
        typeof updater === "function" ? updater(currentByQuarter) : updater;

      return {
        ...current,
        [matchId]: {
          ...currentBySide,
          [side]: nextByQuarter,
        },
      };
    });

    return true;
  };
  const addRecordEvent = async (
    matchId: string,
    type: MatchRecordEventType,
  ) => {
    setMatchRecords((current) => ({
      ...current,
      [matchId]: [
        ...(current[matchId] ?? []),
        {
          id: crypto.randomUUID(),
          type,
          quarter: "unknown",
        },
      ],
    }));

    return true;
  };

  const updateRecordEvent = async (
    matchId: string,
    eventId: string,
    updates: Partial<MatchRecordEvent>,
  ) => {
    setMatchRecords((current) => ({
      ...current,
      [matchId]: (current[matchId] ?? []).map((event) =>
        event.id === eventId ? { ...event, ...updates } : event,
      ),
    }));

    return true;
  };

  const deleteRecordEvent = async (matchId: string, eventId: string) => {
    setMatchRecords((current) => ({
      ...current,
      [matchId]: (current[matchId] ?? []).filter(
        (event) => event.id !== eventId,
      ),
    }));

    return true;
  };

  const reorderRecordEvents = async (
    matchId: string,
    activeId: string,
    overId: string,
  ) => {
    setMatchRecords((current) => {
      const events = [...(current[matchId] ?? [])];
      const activeIndex = events.findIndex((event) => event.id === activeId);
      const overIndex = events.findIndex((event) => event.id === overId);

      if (activeIndex === -1 || overIndex === -1) return current;

      const [movedEvent] = events.splice(activeIndex, 1);
      events.splice(overIndex, 0, movedEvent);

      return {
        ...current,
        [matchId]: events,
      };
    });

    return true;
  };

  const setMatchRecordCompletion = async (
    matchId: string,
    completed: boolean,
  ) => {
    setMatches((current) =>
      current.map((match) =>
        match.id === matchId
          ? {
              ...match,
              recordCompletedAt: completed
                ? new Date().toISOString()
                : undefined,
            }
          : match,
      ),
    );

    return true;
  };

  const updateMatchRecordInclusion = async (
    matchId: string,
    countsTowardRecord: boolean,
  ) => {
    setMatches((current) =>
      current.map((match) =>
        match.id === matchId ? { ...match, countsTowardRecord } : match,
      ),
    );

    return true;
  };

  const saveMvpVote = async (matchId: string, candidatePlayerId: string) => {
    const now = new Date().toISOString();

    setMatchMvpVotes((current) => ({
      ...current,
      [matchId]: [
        ...(current[matchId] ?? []).filter(
          (vote) => vote.voterUserId !== "demo-user",
        ),
        {
          id: crypto.randomUUID(),
          matchId,
          candidatePlayerId,
          voterUserId: "demo-user",
          createdAt: now,
          updatedAt: now,
        },
      ],
    }));

    return true;
  };

  const deleteMvpVote = async (matchId: string) => {
    setMatchMvpVotes((current) => ({
      ...current,
      [matchId]: (current[matchId] ?? []).filter(
        (vote) => vote.voterUserId !== "demo-user",
      ),
    }));

    return true;
  };

  const createBoardPost = async (value: TeamPostFormValue) => {
    const now = new Date().toISOString();

    setBoardPosts((current) => [
      {
        id: crypto.randomUUID(),
        teamId: "demo-team",
        authorId: "demo-user",
        authorName: "김민수",
        ...value,
        viewCount: 0,
        createdAt: now,
        updatedAt: now,
      },
      ...current,
    ]);

    return true;
  };

  const updateBoardPost = async (postId: string, value: TeamPostFormValue) => {
    setBoardPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, ...value, updatedAt: new Date().toISOString() }
          : post,
      ),
    );

    return true;
  };

  const deleteBoardPost = async (postId: string) => {
    setBoardPosts((current) => current.filter((post) => post.id !== postId));

    setBoardComments((current) => {
      const nextComments = { ...current };
      delete nextComments[postId];
      return nextComments;
    });

    setBoardLikes((current) => {
      const nextLikes = { ...current };
      delete nextLikes[postId];
      return nextLikes;
    });

    return true;
  };

  const incrementBoardPostViewCount = async (postId: string) => {
    setBoardPosts((current) =>
      current.map((post) =>
        post.id === postId ? { ...post, viewCount: post.viewCount + 1 } : post,
      ),
    );

    return true;
  };

  const createBoardComment = async (postId: string, content: string) => {
    const now = new Date().toISOString();

    setBoardComments((current) => ({
      ...current,
      [postId]: [
        ...(current[postId] ?? []),
        {
          id: crypto.randomUUID(),
          postId,
          teamId: "demo-team",
          authorId: "demo-user",
          authorName: "김민수",
          content,
          createdAt: now,
          updatedAt: now,
        },
      ],
    }));

    return true;
  };

  const updateBoardComment = async (commentId: string, content: string) => {
    setBoardComments((current) =>
      Object.fromEntries(
        Object.entries(current).map(([postId, comments]) => [
          postId,
          comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, content, updatedAt: new Date().toISOString() }
              : comment,
          ),
        ]),
      ),
    );

    return true;
  };

  const deleteBoardComment = async (commentId: string) => {
    setBoardComments((current) =>
      Object.fromEntries(
        Object.entries(current).map(([postId, comments]) => [
          postId,
          comments.filter((comment) => comment.id !== commentId),
        ]),
      ),
    );

    return true;
  };

  const toggleBoardPostLike = async (postId: string) => {
    setBoardLikes((current) => {
      const like = current[postId] ?? { count: 0, isLiked: false };

      return {
        ...current,
        [postId]: {
          count: Math.max(0, like.count + (like.isLiked ? -1 : 1)),
          isLiked: !like.isLiked,
        },
      };
    });

    return true;
  };

  return (
    <DemoModeContext.Provider value>
      <DemoDataContext.Provider
        value={{
          players,
          addPlayer,
          updatePlayer,
          deletePlayer,
          matches,
          addMatch,
          updateMatch,
          deleteMatch,
          matchVotes,
          saveVote,
          deleteVote,
          matchAttendance,
          saveVoteSide,
          saveAttendance,
          deleteAttendance,
          matchTactics,
          updateMatchPlayersPerSide,
          saveMatchTactics,
          matchRecords,
          addRecordEvent,
          updateRecordEvent,
          deleteRecordEvent,
          reorderRecordEvents,
          setMatchRecordCompletion,
          updateMatchRecordInclusion,
          matchMvpVotes,
          saveMvpVote,
          deleteMvpVote,
          boardPosts,
          createBoardPost,
          updateBoardPost,
          deleteBoardPost,
          incrementBoardPostViewCount,
          boardComments,
          createBoardComment,
          updateBoardComment,
          deleteBoardComment,
          boardLikes,
          toggleBoardPostLike,
        }}
      >
        {children}
      </DemoDataContext.Provider>
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  return useContext(DemoModeContext);
}

export function useDemoData() {
  const data = useContext(DemoDataContext);

  if (!data) {
    throw new Error("useDemoData must be used within DemoModeProvider.");
  }

  return data;
}
