import { type SignupFormValues, signupSchema } from "@/lib/auth/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import AuthFormField from "./AuthFormField";
import AuthSubmitButton from "./AuthSubmitButton";

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={isSubmitting}
      className="space-y-5"
    >
      <AuthFormField
        id="signup-name"
        label="이름"
        type="text"
        placeholder="이름 입력"
        autoComplete="name"
        registration={register("name")}
        errorMessage={errors.name?.message}
      />

      <AuthFormField
        id="signup-email"
        label="이메일"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        registration={register("email")}
        errorMessage={errors.email?.message}
      />

      <AuthFormField
        id="signup-password"
        label="비밀번호"
        type="password"
        placeholder="6자 이상 입력"
        autoComplete="new-password"
        registration={register("password")}
        errorMessage={errors.password?.message}
      />

      <AuthFormField
        id="signup-password-confirm"
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호 다시 입력"
        autoComplete="new-password"
        registration={register("passwordConfirm")}
        errorMessage={errors.passwordConfirm?.message}
      />

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <output className="block rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </output>
      )}

      <AuthSubmitButton
        isSubmitting={isSubmitting}
        label="회원가입"
        submittingLabel="가입 중..."
      />

      <p className="text-center text-sm text-stone-500">
        이미 계정이 있나요?{" "}
        <Link
          href="/login"
          className="font-bold text-emerald-700 transition hover:text-emerald-600"
        >
          로그인
        </Link>
      </p>
    </form>
  );
}
