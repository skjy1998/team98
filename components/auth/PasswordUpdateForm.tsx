import {
  type PasswordUpdateFormValues,
  passwordUpdateSchema,
} from "@/lib/auth/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthFormField from "./AuthFormField";
import AuthSubmitButton from "./AuthSubmitButton";
import Link from "next/link";

interface PasswordUpdateFormProps {
  errorMessage: string;
  successMessage: string;
  onSubmit: (values: PasswordUpdateFormValues) => void | Promise<void>;
}

export default function PasswordUpdateForm({
  errorMessage,
  successMessage,
  onSubmit,
}: Readonly<PasswordUpdateFormProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordUpdateFormValues>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
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
        id="new-password"
        label="새 비밀번호"
        type="password"
        placeholder="6자 이상 입력"
        autoComplete="new-password"
        registration={register("password")}
        errorMessage={errors.password?.message}
      />

      <AuthFormField
        id="new-password-confirm"
        label="새 비밀번호 확인"
        type="password"
        placeholder="비밀번호 다시 입력"
        autoComplete="new-password"
        registration={register("passwordConfirm")}
        errorMessage={errors.passwordConfirm?.message}
      />

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-600 sm:px-4 sm:py-3 sm:text-sm"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <output className="block rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700 sm:px-4 sm:py-3 sm:text-sm">
          {successMessage}
        </output>
      )}

      <AuthSubmitButton
        isSubmitting={isSubmitting}
        label="새 비밀번호 저장"
        submittingLabel="저장 중..."
      />

      <p className="text-center text-xs text-stone-500 sm:text-sm">
        재설정 링크가 만료됐나요?{" "}
        <Link
          href="/forgot-password"
          className="font-bold text-emerald-700 transition hover:text-emerald-600"
        >
          다시 요청하기
        </Link>
      </p>
    </form>
  );
}
