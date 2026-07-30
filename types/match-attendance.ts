export type MatchAttendanceStatus = "attend" | "late" | "absent";

export interface MatchAttendance {
  playerId: string;
  status: MatchAttendanceStatus;
}

export type MatchAttendanceByMatchId = Record<string, MatchAttendance[]>;
