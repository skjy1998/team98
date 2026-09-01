import type { PlayerDetailPosition } from "@/types/player";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCallback, useEffect, useState } from "react";
import type { ProfileSettingsData } from "@/types/settings";
import {
  getProfileSettings,
  updateCurrentPlayerSettings,
  updateCurrentProfileEmail,
  updateCurrentProfileName,
} from "@/lib/settings/profile-settings-repository";

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

    try {
      const nextProfile = await getProfileSettings(teamId);
      setProfile(nextProfile);
    } catch (error) {
      console.error("profile load error", error);
      setProfile(null);
      setProfileError("프로필 정보를 불러오지 못했어요.");
    } finally {
      setProfileLoaded(true);
    }
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

    try {
      await updateCurrentProfileName(normalizedName);
      await loadProfile();
      return true;
    } catch (error) {
      console.error("profile name update error", error);
      setProfileError("이름 저장에 실패했어요.");
      return false;
    }
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

    try {
      await updateCurrentProfileEmail(normalizedEmail);
      await loadProfile();
      return true;
    } catch (error) {
      console.error("profile email update error", error);
      setProfileError("이메일 변경 요청에 실패했어요.");
      return false;
    }
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

    try {
      await updateCurrentPlayerSettings(
        teamId,
        playerId,
        number,
        detailPositions,
      );
      await loadProfile();
      return true;
    } catch (error) {
      console.error("player settings update error", error);
      setProfileError("선수 정보 저장에 실패했어요.");
      return false;
    }
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
