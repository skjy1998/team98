import type { HTMLInputTypeAttribute } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface AuthFormFieldProps {
  id: string;
  label: string;
  type: HTMLInputTypeAttribute;
  placeholder: string;
  registration: UseFormRegisterReturn;
  errorMessage?: string;
}

export default function AuthFormField({
  id,
  label,
  type,
  placeholder,
  registration,
  errorMessage,
}: Readonly<AuthFormFieldProps>) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-stone-500"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...registration}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorMessage ? `${id}-error` : undefined}
        className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300"
      />

      {errorMessage && (
        <p id={`${id}-error`} className="mt-2 text-sm text-rose-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
