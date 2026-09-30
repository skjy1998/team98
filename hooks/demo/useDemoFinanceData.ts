"use client";

import { useDemoData } from "@/components/demo/DemoModeProvider";
import {
  demoFeeTypes,
  demoFinanceEntries,
  demoFineCharges,
  demoFineRules,
} from "@/lib/demo/demo-finance-data";
import type {
  CreateFineChargeInput,
  FeeType,
  FineCharge,
  FineChargeStatus,
  FineRule,
  FinanceEntry,
} from "@/types/finance";
import { useState } from "react";

export function useDemoFinanceData() {
  const { players, matches, matchVotes, matchAttendance } = useDemoData();

  const [entries, setEntries] = useState(() => demoFinanceEntries);
  const [feeTypes, setFeeTypes] = useState(() => demoFeeTypes);
  const [fineRules, setFineRules] = useState(() => demoFineRules);
  const [fineCharges, setFineCharges] = useState(() => demoFineCharges);
  const [dueDay, setDueDay] = useState("10");

  const addEntry = async (entry: Omit<FinanceEntry, "id">) => {
    setEntries((current) => [
      { id: crypto.randomUUID(), ...entry },
      ...current,
    ]);
    return true;
  };

  const updateEntry = async (
    entryId: string,
    updates: Omit<FinanceEntry, "id">,
  ) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === entryId ? { id: entryId, ...updates } : entry,
      ),
    );
    return true;
  };

  const deleteEntry = async (entryId: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== entryId));
    return true;
  };

  const handleChangeDueDay = async (value: string) => {
    setDueDay(value);
    return true;
  };

  const handleAddFeeType = async (feeType: FeeType) => {
    setFeeTypes((current) => [...current, feeType]);
    return true;
  };

  const handleUpdateFeeType = async (
    feeTypeId: string,
    updates: Partial<FeeType>,
  ) => {
    setFeeTypes((current) =>
      current.map((feeType) =>
        feeType.id === feeTypeId ? { ...feeType, ...updates } : feeType,
      ),
    );
    return true;
  };

  const handleDeleteFeeType = async (feeTypeId: string) => {
    setFeeTypes((current) =>
      current.filter((feeType) => feeType.id !== feeTypeId),
    );
    return true;
  };

  const handleAddFineRule = async (fineRule: FineRule) => {
    setFineRules((current) => [fineRule, ...current]);
    return true;
  };

  const handleDeleteFineRule = async (fineRuleId: string) => {
    setFineRules((current) =>
      current.filter((fineRule) => fineRule.id !== fineRuleId),
    );
    return true;
  };

  const createFineCharges = async (inputs: CreateFineChargeInput[]) => {
    const chargedAt = new Date().toISOString();

    setFineCharges((current) => [
      ...inputs.map((input) => ({
        id: crypto.randomUUID(),
        ...input,
        status: "unpaid" as const,
        chargedAt,
      })),
      ...current,
    ]);

    return true;
  };

  const deleteFineCharge = async (fineChargeId: string) => {
    setFineCharges((current) =>
      current.filter((charge) => charge.id !== fineChargeId),
    );
    return true;
  };

  const handleChangeFineChargeStatus = async (
    charge: FineCharge,
    nextStatus: FineChargeStatus,
  ) => {
    if (charge.status === nextStatus) return true;

    if (nextStatus === "paid") {
      const paidAt = new Date().toISOString();
      const paidEntryId = crypto.randomUUID();

      setEntries((current) => [
        {
          id: paidEntryId,
          type: "income",
          amount: charge.amount,
          description: `${charge.description} (${
            players.find((player) => player.id === charge.playerId)?.name ??
            "선수"
          })`,
          date: paidAt.slice(0, 10),
          time: paidAt.slice(11, 16),
          category: "fine",
          playerId: charge.playerId,
          matchId: charge.matchId,
        },
        ...current,
      ]);

      setFineCharges((current) =>
        current.map((item) =>
          item.id === charge.id
            ? { ...item, status: "paid", paidAt, paidEntryId }
            : item,
        ),
      );

      return true;
    }

    if (charge.paidEntryId) {
      setEntries((current) =>
        current.filter((entry) => entry.id !== charge.paidEntryId),
      );
    }

    setFineCharges((current) =>
      current.map((item) =>
        item.id === charge.id
          ? {
              ...item,
              status: "unpaid",
              paidAt: undefined,
              paidEntryId: undefined,
            }
          : item,
      ),
    );

    return true;
  };

  return {
    players,
    matches,
    votes: matchVotes,
    attendance: matchAttendance,
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    dueDay,
    feeTypes,
    fineRules,
    fineCharges,
    createFineCharges,
    deleteFineCharge,
    handleChangeFineChargeStatus,
    handleChangeDueDay,
    handleAddFeeType,
    handleUpdateFeeType,
    handleDeleteFeeType,
    handleAddFineRule,
    handleDeleteFineRule,
  };
}
