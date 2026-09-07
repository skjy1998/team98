import { loginSchema, type LoginFormValues } from "@/lib/auth/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import AuthFormField from "./AuthFormField";

interface LoginFormProps {
  errorMessage: string;
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
}

export default function LoginForm({
  errorMessage,
  onSubmit,
}: Readonly<LoginFormProps>) {
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

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthFormField
          id="login-email"
          label="이메일"
          type="email"
          placeholder="you@example.com"
          registration={register("email")}
          errorMessage={errors.email?.message}
        />

        <AuthFormField
          id="login-password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호 입력"
          registration={register("password")}
          errorMessage={errors.password?.message}
        />

        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
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
  );
}
