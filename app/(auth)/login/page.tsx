"use client";

import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아니에요"),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
        return;
      }

      setIsCheckingAuth(false);
    }

    checkSession();
  }, [router]);

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email.trim(),
      password: values.password,
    });

    if (error || !data.user) {
      setErrorMessage(error?.message ?? "로그인에 실패했어요.");
      return;
    }

    const { data: membership, error: membershipError } = await supabase
      .from("team_members")
      .select("id")
      .eq("user_id", data.user.id)
      .limit(1)
      .maybeSingle();

    if (membershipError) {
      setErrorMessage("팀 정보를 확인하는 중 문제가 발생했어요.");
      return;
    }

    if (membership) {
      router.push("/dashboard");
      return;
    }

    router.push("/teams/setup");
  };

  if (isCheckingAuth) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <PageHeader
          title="로그인"
          description="이메일과 비밀번호로 팀 관리 서비스에 로그인하세요."
        />
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-stone-500">로그인 상태를 확인하는 중...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader
        title="로그인"
        description="이메일과 비밀번호로 팀 관리 서비스에 로그인하세요."
      />

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-medium text-stone-500"
            >
              이메일
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-rose-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-medium text-stone-500"
            >
              비밀번호
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="비밀번호 입력"
              {...register("password")}
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-rose-500">
                {errors.password.message}
              </p>
            )}
          </div>
          {errorMessage && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {errorMessage}
            </div>
          )}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>

            <Link
              href="/signup"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-stone-200 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
            >
              회원가입 하러 가기
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
