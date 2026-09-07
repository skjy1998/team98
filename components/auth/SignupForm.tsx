import { type SignupFormValues, signupSchema } from "@/lib/auth/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import AuthFormField from "./AuthFormField";

interface SignupFormProps {
  errorMessage: string;
  successMessage: string;
  onSubmit: (values: SignupFormValues) => void | Promise<void>;
}

export default function SignupForm({
  errorMessage,
  successMessage,
  onSubmit,
}: Readonly<SignupFormProps>) {
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

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthFormField
          id="signup-name"
          label="이름"
          type="text"
          placeholder="이름 입력"
          registration={register("name")}
          errorMessage={errors.name?.message}
        />

        <AuthFormField
          id="signup-email"
          label="이메일"
          type="email"
          placeholder="you@example.com"
          registration={register("email")}
          errorMessage={errors.email?.message}
        />

        <AuthFormField
          id="signup-password"
          label="비밀번호"
          type="password"
          placeholder="6자 이상 입력"
          registration={register("password")}
          errorMessage={errors.password?.message}
        />

        <AuthFormField
          id="signup-password-confirm"
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호 다시 입력"
          registration={register("passwordConfirm")}
          errorMessage={errors.passwordConfirm?.message}
        />

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
  );
}
