import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type CurrentTeam = {
  id: string;
  name: string;
  sport: "soccer" | "futsal";
};

export function useCurrentTeam() {
  const [team, setTeam] = useState<CurrentTeam | null>(null);
  const [teamLoaded, setTeamLoaded] = useState(false);

  useEffect(() => {
    async function loadCurrentTeam() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
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
        setTeamLoaded(true);
        return;
      }

      const { data: teamData } = await supabase
        .from("teams")
        .select("id, name, sport")
        .eq("id", membership.team_id)
        .maybeSingle();

      if (!teamData) {
        setTeamLoaded(true);
        return;
      }

      setTeam({
        id: teamData.id,
        name: teamData.name,
        sport: teamData.sport,
      });
      setTeamLoaded(true);
    }

    loadCurrentTeam();
  }, []);

  return { team, teamLoaded };
}
