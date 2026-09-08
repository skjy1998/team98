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
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-stone-900 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSubmitting && (
        <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
      )}
      {isSubmitting ? submittingLabel : label}
    </button>
  );
}
