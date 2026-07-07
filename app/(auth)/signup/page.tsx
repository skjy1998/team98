"use client";

import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signupSchema = z
  .object({
    name: z.string().min(1, "이름을 입력해 주세요."),
    email: z.string().email("올바른 이메일 형식이 아니에요."),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 해요."),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해 주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호 확인이 일치하지 않아요.",
    path: ["passwordConfirm"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
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

  const onSubmit = async (values: SignupFormValues) => {
    setErrorMessage("");
    setSuccessMessage("");

    const { error } = await supabase.auth.signUp({
      email: values.email.trim(),
      password: values.password,
      options: {
        data: {
          name: values.name.trim(),
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    await supabase.auth.signOut();

    setSuccessMessage("회원가입이 완료됐어요. 로그인해 주세요.");

    setTimeout(() => {
      router.push("/login");
    }, 1200);
  };

  if (isCheckingAuth) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <PageHeader
          title="회원가입"
          description="이메일 계정을 만들고 팀 관리 서비스를 시작하세요."
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
        title="회원가입"
        description="이메일 계정을 만들고 팀 관리 서비스를 시작하세요."
      />

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="signup-name"
              className="mb-2 block text-sm font-medium text-stone-500"
            >
              이름
            </label>
            <input
              id="signup-name"
              type="text"
              placeholder="이름 입력"
              {...register("name")}
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-rose-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="mb-2 block text-sm font-medium text-stone-500"
            >
              이메일
            </label>
            <input
              id="signup-email"
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
              htmlFor="signup-password"
              className="mb-2 block text-sm font-medium text-stone-500"
            >
              비밀번호
            </label>
            <input
              id="signup-password"
              type="password"
              placeholder="6자 이상 입력"
              {...register("password")}
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-rose-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="signup-password-confirm"
              className="mb-2 block text-sm font-medium text-stone-500"
            >
              비밀번호 확인
            </label>
            <input
              id="signup-password-confirm"
              type="password"
              placeholder="비밀번호 다시 입력"
              {...register("passwordConfirm")}
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300"
            />
            {errors.passwordConfirm && (
              <p className="mt-2 text-sm text-rose-500">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {successMessage}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "가입 중..." : "회원가입"}
            </button>

            <Link
              href="/login"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-stone-200 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
            >
              로그인 하러 가기
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
