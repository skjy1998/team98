import { supabase } from "@/lib/supabase";
import type { CurrentTeam } from "@/types/team";
import { useCallback, useEffect, useState } from "react";

export function useCurrentTeam() {
  const [team, setTeam] = useState<CurrentTeam | null>(null);
  const [teamLoaded, setTeamLoaded] = useState(false);

  const loadCurrentTeam = useCallback(async () => {
    setTeamLoaded(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setTeam(null);
      setTeamLoaded(true);
      return;
    }

    const { data: membership } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (!membership?.team_id) {
      setTeam(null);
      setTeamLoaded(true);
      return;
    }

    const { data: teamData } = await supabase
      .from("teams")
      .select("id, name, sport, invite_code")
      .eq("id", membership.team_id)
      .maybeSingle();

    if (!teamData) {
      setTeam(null);
      setTeamLoaded(true);
      return;
    }

    setTeam({
      id: teamData.id,
      name: teamData.name,
      sport: teamData.sport as CurrentTeam["sport"],
      inviteCode: teamData.invite_code,
    });
    setTeamLoaded(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCurrentTeam();
  }, [loadCurrentTeam]);

  return { team, teamLoaded, reloadTeam: loadCurrentTeam };
}
