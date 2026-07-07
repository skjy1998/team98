"use client";

import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";
import { LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFutbol } from "react-icons/fa6";

type TeamSetupMode = "create" | "join";
type TeamSport = "soccer" | "futsal";

function createInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function TeamSetupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<TeamSetupMode>("create");
  const [teamSport, setTeamSport] = useState<TeamSport>("soccer");
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [isJoiningTeam, setIsJoiningTeam] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCheckingTeam, setIsCheckingTeam] = useState(true);

  useEffect(() => {
    async function checkUserTeam() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setIsCheckingTeam(false);
        return;
      }

      const { data: membership, error: membershipError } = await supabase
        .from("team_members")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (!membershipError && membership) {
        router.replace("/dashboard");
        return;
      }
      setIsCheckingTeam(false);
    }
    checkUserTeam();
  }, [router]);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return;

    setIsCreatingTeam(true);
    setErrorMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage("로그인 정보를 확인할 수 없어요.");
      setIsCreatingTeam(false);
      return;
    }

    const inviteCode = createInviteCode();

    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({
        name: teamName.trim(),
        sport: teamSport,
        invite_code: inviteCode,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (teamError || !team) {
      setErrorMessage(teamError?.message ?? "팀 생성에 실패했어요.");
      setIsCreatingTeam(false);
      return;
    }

    const { error: memberError } = await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: user.id,
      role: "owner",
    });

    if (memberError) {
      setErrorMessage(memberError.message);
      setIsCreatingTeam(false);
      return;
    }

    const displayName =
      user.user_metadata.name?.trim() || user.email?.split("@")[0] || "새 회원";

    const { error: playerError } = await supabase.from("players").insert({
      team_id: team.id,
      user_id: user.id,
      name: displayName,
      role: "member",
      preferred_foot: "right",
    });

    if (playerError) {
      setErrorMessage(playerError.message);
      setIsCreatingTeam(false);
    }

    setIsCreatingTeam(false);
    router.push("/dashboard");
  };

  const handleJoinTeam = async () => {
    if (!inviteCode.trim()) return;

    setIsJoiningTeam(true);
    setErrorMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage("로그인 정보를 확인할 수 없어요.");
      setIsJoiningTeam(false);
      return;
    }

    const normalizedInviteCode = inviteCode.trim().toUpperCase();

    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id")
      .eq("invite_code", normalizedInviteCode)
      .maybeSingle();

    if (teamError) {
      setErrorMessage(teamError.message);
      setIsJoiningTeam(false);
      return;
    }

    if (!team) {
      setErrorMessage("일치하는 팀 초대코드를 찾을 수 없어요.");
      setIsJoiningTeam(false);
      return;
    }

    const { error: memberError } = await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: user.id,
      role: "member",
    });

    if (memberError) {
      if (memberError.code === "23505") {
        setErrorMessage("이미 참가한 팀이에요.");
      } else {
        setErrorMessage(memberError.message);
      }
      setIsJoiningTeam(false);
      return;
    }

    const displayName =
      user.user_metadata.name?.trim() || user.email?.split("@")[0] || "새 회원";

    const { error: playerError } = await supabase.from("players").insert({
      team_id: team.id,
      user_id: user.id,
      name: displayName,
      role: "member",
      preferred_foot: "right",
    });

    if (playerError) {
      setErrorMessage(playerError.message);
      setIsJoiningTeam(false);
      return;
    }

    setIsJoiningTeam(false);
    router.push("/dashboard");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isCheckingTeam) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader
          title="팀 시작하기"
          description="팀 정보를 확인하고 있어요."
        />
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-stone-500">
            팀 연결 상태를 확인하는 중...
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
        >
          로그아웃
        </button>
      </div>
      <PageHeader
        title="팀 시작하기"
        description="팀을 새로 만들거나 초대 코드를 통해 기존 팀에 참가할 수 있어요."
      />

      <section className="grid gap-6 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setMode("create")}
          className={[
            "rounded-xl border p-6 text-left shadow-sm transition",
            mode === "create"
              ? "border-emerald-300 bg-emerald-50"
              : "border-stone-200 bg-white hover:bg-stone-50",
          ].join(" ")}
        >
          <div className="space-y-3">
            <div
              className={[
                "flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold shadow-sm",
                mode === "create"
                  ? "bg-white text-emerald-600"
                  : "bg-stone-100 text-stone-600",
              ].join(" ")}
            >
              +
            </div>

            <div>
              <h2 className="text-xl font-semibold text-stone-900">
                새 팀 만들기
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                우리 팀을 직접 생성하고 팀 이름과 기본 정보를 설정해요.
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setMode("join")}
          className={[
            "rounded-xl border p-6 text-left shadow-sm transition",
            mode === "join"
              ? "border-sky-300 bg-sky-50"
              : "border-stone-200 bg-white hover:bg-stone-50",
          ].join(" ")}
        >
          <div className="space-y-3">
            <div
              className={[
                "flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold shadow-sm",
                mode === "join"
                  ? "bg-white text-sky-600"
                  : "bg-stone-100 text-stone-600",
              ].join(" ")}
            >
              #
            </div>

            <div>
              <h2 className="text-xl font-semibold text-stone-900">
                팀 참가하기
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                초대 코드를 입력해 기존 팀에 참가해요.
              </p>
            </div>
          </div>
        </button>
      </section>

      {errorMessage && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          {errorMessage}
        </div>
      )}
      {mode === "create" && (
        <section className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-stone-900">
              새 팀 만들기
            </h3>
            <p className="text-sm text-stone-500">
              팀 이름과 기본 정보를 입력해 팀을 생성해요.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-900">
                팀 이름
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
                placeholder="우리 팀의 이름"
                className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-900">
                종목
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTeamSport("soccer")}
                  className={[
                    "rounded-xl border px-4 py-4 text-left transition",
                    teamSport === "soccer"
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-stone-200 bg-white hover:bg-stone-50",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                        teamSport === "soccer"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-stone-100 text-stone-400",
                      ].join(" ")}
                    >
                      <FaFutbol className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={[
                          "text-sm font-semibold",
                          teamSport === "soccer"
                            ? "text-emerald-700"
                            : "text-stone-900",
                        ].join(" ")}
                      >
                        축구
                      </p>
                      <p className="mt-1 text-xs leading-5 text-stone-500">
                        정규 축구 경기 기준으로 팀을 운영해요.
                      </p>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setTeamSport("futsal")}
                  className={[
                    "rounded-xl border px-4 py-4 text-left transition",
                    teamSport === "futsal"
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-stone-200 bg-white hover:bg-stone-50",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                        teamSport === "futsal"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-stone-100 text-stone-400",
                      ].join(" ")}
                    >
                      <LayoutGrid className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={[
                          "text-sm font-semibold",
                          teamSport === "futsal"
                            ? "text-emerald-700"
                            : "text-stone-900",
                        ].join(" ")}
                      >
                        풋살
                      </p>
                      <p className="mt-1 text-xs leading-5 text-stone-500">
                        소규모 인원 중심으로 팀을 운영해요.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleCreateTeam}
              disabled={!teamName.trim()}
              className={[
                "flex h-14 w-full items-center justify-center rounded-xl px-5 text-sm font-semibold transition",
                teamName.trim()
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "cursor-not-allowed bg-stone-100 text-stone-400",
              ].join(" ")}
            >
              {isCreatingTeam ? "팀 생성 중..." : "팀 만들고 시작하기"}
            </button>
          </div>
        </section>
      )}
      {mode === "join" && (
        <section className="rounded-xl border border-sky-200 bg-white p-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-stone-900">
              팀 참가하기
            </h3>
            <p className="text-sm text-stone-500">
              초대 코드를 입력해 기존 팀에 참가할 수 있어요.
            </p>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-stone-900">
              초대 코드
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value)}
              placeholder="ABCDEF"
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-sky-300"
            />
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleJoinTeam}
              disabled={!inviteCode.trim() || isJoiningTeam}
              className={[
                "flex h-14 w-full items-center justify-center rounded-xl px-5 text-sm font-semibold transition",
                inviteCode.trim()
                  ? "bg-sky-600 text-white hover:bg-sky-700"
                  : "cursor-not-allowed bg-stone-100 text-stone-400",
              ].join(" ")}
            >
              {isJoiningTeam ? "팀 참가 중..." : "초대코드로 참가하기"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
