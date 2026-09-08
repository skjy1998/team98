import { Eye, EyeOff } from "lucide-react";
import { useState, type HTMLInputTypeAttribute } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type AuthAutoComplete = "name" | "email" | "current-password" | "new-password";

interface AuthFormFieldProps {
  id: string;
  label: string;
  type: HTMLInputTypeAttribute;
  autoComplete: AuthAutoComplete;
  placeholder: string;
  registration: UseFormRegisterReturn;
  errorMessage?: string;
}

export default function AuthFormField({
  id,
  label,
  type,
  placeholder,
  autoComplete,
  registration,
  errorMessage,
}: Readonly<AuthFormFieldProps>) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordField = type === "password";
  const inputType = isPasswordField && isPasswordVisible ? "text" : type;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-stone-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...registration}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? `${id}-error` : undefined}
          className={`h-12 w-full rounded-xl border bg-stone-50 px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:bg-white focus:ring-4 ${
            isPasswordField ? "pr-12" : ""
          } ${
            errorMessage
              ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
              : "border-stone-200 focus:border-emerald-400 focus:ring-emerald-100"
          }`}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            aria-label={
              isPasswordVisible ? "비밀번호 숨기기" : "비밀번호 표시하기"
            }
            aria-pressed={isPasswordVisible}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-200 hover:text-stone-700"
          >
            {isPasswordVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {errorMessage && (
        <p
          id={`${id}-error`}
          className="mt-2 text-sm font-medium text-rose-500"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
