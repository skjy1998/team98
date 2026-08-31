"use client";

import { useCurrentTeamContext } from "@/components/providers/CurrentTeamProvider";

export function useCurrentTeam() {
  return useCurrentTeamContext();
}
