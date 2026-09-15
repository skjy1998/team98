import type { MatchUniform } from "@/types/match";
import MatchUniformSelector from "../../MatchUniformSelector";

interface MatchCreateUniformSectionProps {
  uniform: MatchUniform;
  onChangeUniform: (value: MatchUniform) => void;
}

export default function MatchCreateUniformSection({
  uniform,
  onChangeUniform,
}: Readonly<MatchCreateUniformSectionProps>) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-lg font-semibold text-stone-900">유니폼</p>
        <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500">
          선택
        </span>
      </div>

      <MatchUniformSelector value={uniform} onChange={onChangeUniform} />
    </section>
  );
}
