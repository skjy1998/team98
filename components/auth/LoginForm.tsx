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
      className="space-y-5"
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

      <AuthFormField
        id="login-password"
        label="비밀번호"
        type="password"
        placeholder="비밀번호 입력"
        autoComplete="current-password"
        registration={register("password")}
        errorMessage={errors.password?.message}
      />

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
        >
          {errorMessage}
        </div>
      )}

      <AuthSubmitButton
        isSubmitting={isSubmitting}
        label="로그인"
        submittingLabel="로그인 중..."
      />

      <p className="text-center text-sm text-stone-500">
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
