import { LoaderCircle } from "lucide-react";

interface AuthSubmitButtonProps {
  isSubmitting: boolean;
  label: string;
  submittingLabel: string;
}

export default function AuthSubmitButton({
  isSubmitting,
  label,
  submittingLabel,
}: Readonly<AuthSubmitButtonProps>) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
    >
      {isSubmitting && (
        <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
      )}
      {isSubmitting ? submittingLabel : label}
    </button>
  );
}
