import type {
  MatchAttendanceByMatchId,
  MatchAttendanceStatus,
} from "@/types/match-attendance";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCallback, useEffect, useState } from "react";
import {
  getTeamMatchAttendance,
  removeMatchAttendance,
  upsertMatchAttendance,
} from "@/lib/matches/match-attendance-repository";

export function useMatchAttendance() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [attendance, setAttendance] = useState<MatchAttendanceByMatchId>({});
  const [attendanceLoaded, setAttendanceLoaded] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");

  const loadAttendance = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setAttendance({});
      setAttendanceLoaded(true);
      setAttendanceError("");
      return;
    }

    setAttendanceLoaded(false);
    setAttendanceError("");

    try {
      const nextAttendance = await getTeamMatchAttendance(teamId);
      setAttendance(nextAttendance);
    } catch (error) {
      console.error("match attendance load error", error);
      setAttendance({});
      setAttendanceError("출석 정보를 불러오지 못했어요.");
    } finally {
      setAttendanceLoaded(true);
    }
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAttendance();
  }, [loadAttendance]);

  const saveAttendance = async (
    matchId: string,
    playerId: string,
    status: MatchAttendanceStatus,
  ) => {
    if (!teamId) return false;

    try {
      await upsertMatchAttendance(teamId, matchId, playerId, status);

      setAttendance((previousAttendance) => {
        const currentAttendance = previousAttendance[matchId] ?? [];
        const remainingAttendance = currentAttendance.filter(
          (item) => item.playerId !== playerId,
        );

        return {
          ...previousAttendance,
          [matchId]: [...remainingAttendance, { playerId, status }],
        };
      });

      return true;
    } catch (error) {
      console.error("match attendance save error", error);
      return false;
    }
  };

  const deleteAttendance = async (matchId: string, playerId: string) => {
    if (!teamId) return false;

    try {
      await removeMatchAttendance(teamId, matchId, playerId);

      setAttendance((previousAttendance) => {
        const currentAttendance = previousAttendance[matchId] ?? [];

        return {
          ...previousAttendance,
          [matchId]: currentAttendance.filter(
            (item) => item.playerId !== playerId,
          ),
        };
      });

      return true;
    } catch (error) {
      console.error("match attendance delete error", error);
      return false;
    }
  };

  return {
    attendance,
    attendanceLoaded,
    attendanceError,
    saveAttendance,
    deleteAttendance,
    reloadAttendance: loadAttendance,
  };
}
