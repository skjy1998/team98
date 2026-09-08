import { ChartNoAxesCombined, ClipboardCheck, Goal } from "lucide-react";
import type { ReactNode } from "react";

interface AuthPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

const features = [
  {
    label: "경기와 출석을 한 흐름으로",
    icon: ClipboardCheck,
  },
  {
    label: "축구와 풋살 전술 구성",
    icon: Goal,
  },
  {
    label: "팀과 선수 기록 확인",
    icon: ChartNoAxesCombined,
  },
] as const;

export default function AuthPageShell({
  eyebrow,
  title,
  description,
  children,
}: Readonly<AuthPageShellProps>) {
  return (
    <div className="grid min-h-[760px] overflow-hidden rounded-[32px] border border-stone-200 bg-white shadow-[0_32px_90px_-45px_rgba(28,25,23,0.3)] lg:grid-cols-[0.85fr_1fr]">
      <aside className="relative overflow-hidden bg-stone-900 p-8 text-white md:p-12">
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -right-20 top-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
              SquadFlow
            </p>

            <h2 className="mt-5 max-w-sm text-4xl font-black leading-tight tracking-tight">
              팀 운영의 모든 흐름을
              <span className="block text-emerald-400">
                한곳에서 관리하세요
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-stone-400">
              경기 준비부터 기록과 회비 정산까지 팀원 모두가 같은 정보를 공유할
              수 있습니다.
            </p>
          </div>

          <ul className="mt-14 space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <li
                  key={feature.label}
                  className="flex items-center gap-3 text-sm font-semibold text-stone-300"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  {feature.label}
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <section className="flex items-center px-6 py-12 md:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <p className="text-sm font-bold text-emerald-600">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-900">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-500">{description}</p>

          <div className="mt-8">{children}</div>
        </div>
      </section>
    </div>
  );
}
