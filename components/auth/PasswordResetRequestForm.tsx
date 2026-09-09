import {
  type PasswordResetRequestFormValues,
  passwordResetRequestSchema,
} from "@/lib/auth/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthFormField from "./AuthFormField";
import AuthSubmitButton from "./AuthSubmitButton";
import Link from "next/link";

interface PasswordResetRequestFormProps {
  errorMessage: string;
  successMessage: string;
  onSubmit: (value: PasswordResetRequestFormValues) => void | Promise<void>;
}

export default function PasswordResetRequestForm({
  errorMessage,
  successMessage,
  onSubmit,
}: Readonly<PasswordResetRequestFormProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetRequestFormValues>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: "",
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
        id="reset-email"
        label="이메일"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        registration={register("email")}
        errorMessage={errors.email?.message}
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
        label="재설정 링크 보내기"
        submittingLabel="전송 중..."
      />

      <p className="text-center text-sm text-stone-500">
        비밀번호가 기억났나요?{" "}
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
