import { loginSchema, type LoginFormValues } from "@/lib/auth/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import AuthFormField from "./AuthFormField";
import AuthSubmitButton from "./AuthSubmitButton";

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={isSubmitting}
      className="space-y-4 sm:space-y-5"
    >
      <AuthFormField
        id="login-email"
        label="이메일"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        registration={register("email")}
        errorMessage={errors.email?.message}
      />

      <div>
        <AuthFormField
          id="login-password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호 입력"
          autoComplete="current-password"
          registration={register("password")}
          errorMessage={errors.password?.message}
        />

        <div className="mt-1.5 text-right sm:mt-2">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-stone-500 transition hover:text-emerald-700 sm:text-sm"
          >
            비밀번호를 잊으셨나요?
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-600 sm:px-4 sm:py-3 sm:text-sm"
        >
          {errorMessage}
        </div>
      )}

      <AuthSubmitButton
        isSubmitting={isSubmitting}
        label="로그인"
        submittingLabel="로그인 중..."
      />

      <p className="text-center text-xs text-stone-500 sm:text-sm">
        아직 계정이 없나요?{" "}
        <Link
          href="/signup"
          className="font-bold text-emerald-700 transition hover:text-emerald-600"
        >
          회원가입
        </Link>
      </p>
    </form>
  );
}
