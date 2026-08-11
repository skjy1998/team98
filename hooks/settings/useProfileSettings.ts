import type { PlayerDetailPosition } from "@/types/player";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCallback, useEffect, useState } from "react";
import type { ProfileSettingsData } from "@/types/settings";
import { supabase } from "@/lib/supabase";
import { getMainPositionFromDetail } from "@/lib/players/player-ui";

interface ProfilePlayerRow {
  id: string;
  name: string;
  number: number | null;
  detail_positions: PlayerDetailPosition[] | null;
}

export function useProfileSettings() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [profile, setProfile] = useState<ProfileSettingsData | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profileError, setProfileError] = useState("");

  const loadProfile = useCallback(async () => {
    if (!teamLoaded) return;

    setProfileLoaded(false);
    setProfileError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setProfile(null);
      setProfileError("로그인 정보를 확인할 수 없어요.");
      setProfileLoaded(true);
      return;
    }

    let player: ProfileSettingsData["player"] = null;

    if (teamId) {
      const { data: playerRow, error: playerError } = await supabase
        .from("players")
        .select("id, name, number, detail_positions")
        .eq("team_id", teamId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (playerError) {
        setProfileError("연결된 선수 정보를 불러오지 못했어요.");
      }

      if (playerRow) {
        const row = playerRow as ProfilePlayerRow;

        player = {
          id: row.id,
          name: row.name,
          number: row.number ?? undefined,
          detailPositions: row.detail_positions ?? [],
        };
      }
    }

    const metadataName =
      typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name.trim()
        : "";
    setProfile({
      userId: user.id,
      name:
        metadataName || player?.name || user.email?.split("@")[0] || "사용자",
      email: user.email ?? "",
      player,
    });

    setProfileLoaded(true);
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
  }, [loadProfile]);

  const updateProfileName = async (name: string) => {
    const normalizedName = name.trim();

    if (!normalizedName) {
      setProfileError("이름을 입력해 주세요.");
      return false;
    }

    setProfileError("");

    const { error } = await supabase.rpc("update_my_profile_name", {
      p_name: normalizedName,
    });

    if (error) {
      console.error("profile name update error", error);
      setProfileError("이름 저장에 실패했어요.");
      return false;
    }

    await loadProfile();
    return true;
  };

  const updateProfileEmail = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setProfileError("이메일을 입력해 주세요.");
      return false;
    }

    if (normalizedEmail === profile?.email.toLowerCase()) {
      setProfileError("현재 이메일과 동일해요.");
      return false;
    }

    setProfileError("");

    const { error } = await supabase.auth.updateUser({
      email: normalizedEmail,
    });

    if (error) {
      console.error("profile email update error", error);
      setProfileError(error.message || "이메일 변경 요청에 실패했어요.");
      return false;
    }

    await loadProfile();
    return true;
  };

  const updatePlayerSettings = async (
    playerId: string,
    number: number | undefined,
    detailPositions: PlayerDetailPosition[],
  ) => {
    if (!teamId) {
      setProfileError("팀 정보를 확인할 수 없어요.");
      return false;
    }

    if (number !== undefined && (!Number.isInteger(number) || number < 0)) {
      setProfileError("등번호는 0 이상의 정수로 입력해 주세요.");
      return false;
    }

    setProfileError("");

    const { error } = await supabase.rpc("update_my_player_settings", {
      p_team_id: teamId,
      p_player_id: playerId,
      p_number: number ?? null,
      p_position: getMainPositionFromDetail(detailPositions) ?? null,
      p_detail_positions: detailPositions.length > 0 ? detailPositions : null,
    });

    if (error) {
      console.error("player settings update error", error);
      setProfileError("선수 정보 저장에 실패했어요.");
      return false;
    }

    await loadProfile();
    return true;
  };

  return {
    profile,
    profileLoaded,
    profileError,
    updateProfileName,
    updateProfileEmail,
    updatePlayerSettings,
    reloadProfile: loadProfile,
  };
}
