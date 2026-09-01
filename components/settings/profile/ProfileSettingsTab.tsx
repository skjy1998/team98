import { useProfileSettings } from "@/hooks/settings/useProfileSettings";
import AccountProfileForm from "./AccountProfileForm";
import MyPlayerProfileForm from "./MyPlayerProfileForm";
import NotificationSettingsSection from "./NotificationSettingsSection";
import ContentState from "@/components/common/ContentState";

export default function ProfileSettingsTab() {
  const {
    profile,
    profileLoaded,
    profileError,
    updateProfileName,
    updateProfileEmail,
    updatePlayerSettings,
    reloadProfile,
  } = useProfileSettings();

  if (!profileLoaded) {
    return (
      <ContentState
        variant="loading"
        title="내 설정을 불러오는 중..."
        description="계정과 선수 정보를 확인하고 있어요."
      />
    );
  }

  if (!profile) {
    return (
      <ContentState
        variant="error"
        title="내 설정을 불러오지 못했어요."
        description={profileError || "잠시 후 다시 시도해 주세요."}
        action={
          <button
            type="button"
            onClick={() => void reloadProfile()}
            className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            다시 시도
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {profileError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-medium text-amber-700">{profileError}</p>
        </div>
      )}

      <AccountProfileForm
        name={profile.name}
        email={profile.email}
        onSaveName={updateProfileName}
        onChangeEmail={updateProfileEmail}
      />

      {profile.player ? (
        <MyPlayerProfileForm
          player={profile.player}
          onSave={updatePlayerSettings}
        />
      ) : (
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-stone-900">내 선수 정보</h2>
          <p className="mt-1 text-sm text-stone-400">
            등번호와 선호 포지션을 관리할 수 있어요.
          </p>
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="text-sm font-semibold text-amber-700">
              내 계정과 연결된 선수 정보가 없어요.
            </p>
            <p className="mt-1 text-xs text-amber-600">
              운영진에게 선수 계정 연결을 요청해 주세요.
            </p>
          </div>
        </section>
      )}

      <NotificationSettingsSection />
    </div>
  );
}
