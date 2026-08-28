import {
  getFinanceDefaults,
  getFinanceSummary,
  getPrimaryFeeAmount,
} from "@/lib/finance/finance";
import { useMemo } from "react";
import { useFinanceEntries } from "./useFinanceEntries";
import { usePlayers } from "../players/usePlayers";
import { useFinanceSettings } from "./useFinanceSettings";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import { useMatches } from "../matches/useMatches";
import { useMatchVotes } from "../matches/useMatchVotes";
import { useMatchAttendance } from "../matches/useMatchAttendance";
import { useFinanceFineCharges } from "./useFinanceFineCharges";
import { useFinancePayments } from "./useFinancePayments";
import { useFinanceTransactions } from "./useFinanceTransactions";

export function useFinancePageData() {
  const { defaultMonth, defaultDate, defaultTime } = useMemo(
    () => getFinanceDefaults(),
    [],
  );

  const {
    entries,
    entriesLoaded,
    entriesError,
    addEntry,
    addEntryWithResult,
    updateEntry,
    deleteEntry,
    reloadEntries,
  } = useFinanceEntries();

  const { players, playersLoaded, playersError, reloadPlayers } = usePlayers();
  const settings = useFinanceSettings();
  const { canManage, memberLoaded } = useCurrentTeamMember();
  const { matches, matchesLoaded, matchesError, reloadMatches } = useMatches();
  const { votes, votesLoaded, votesError, reloadVotes } = useMatchVotes();
  const { attendance, attendanceLoaded, attendanceError, reloadAttendance } =
    useMatchAttendance();

  const {
    fineCharges,
    fineChargesLoaded,
    fineChargesError,
    createFineCharges,
    deleteFineCharge,
    handleChangeFineChargeStatus,
    reloadFineCharges,
  } = useFinanceFineCharges({
    addEntryWithResult,
    deleteEntry,
  });

  const primaryFeeAmount = useMemo(
    () => getPrimaryFeeAmount(settings.feeTypes),
    [settings.feeTypes],
  );

  const financeSummary = useMemo(
    () => getFinanceSummary(entries, defaultMonth),
    [entries, defaultMonth],
  );

  const payments = useFinancePayments({
    entries,
    players,
    defaultMonth,
    primaryFeeAmount,
    addEntry,
    deleteEntry,
  });

  const transactions = useFinanceTransactions({
    entries,
    currentMonth: payments.currentMonth,
    defaultDate,
    defaultTime,
    addEntry,
    updateEntry,
    deleteEntry,
  });

  const isLoaded =
    entriesLoaded &&
    playersLoaded &&
    settings.settingsLoaded &&
    memberLoaded &&
    matchesLoaded &&
    votesLoaded &&
    attendanceLoaded &&
    fineChargesLoaded;

  const pageError =
    entriesError ||
    playersError ||
    settings.settingsError ||
    matchesError ||
    votesError ||
    attendanceError ||
    fineChargesError;

  const reloadPageData = async () => {
    await Promise.all([
      reloadEntries(),
      reloadPlayers(),
      settings.reloadSettings(),
      reloadMatches(),
      reloadVotes(),
      reloadAttendance(),
      reloadFineCharges(),
    ]);
  };

  return {
    canManage,
    financeSummary,
    primaryFeeAmount,
    players,
    settings,
    matches,
    votes,
    attendance,
    fineCharges,
    createFineCharges,
    deleteFineCharge,
    handleChangeFineChargeStatus,
    payments,
    transactions,
    isLoaded,
    pageError,
    reloadPageData,
  };
}
