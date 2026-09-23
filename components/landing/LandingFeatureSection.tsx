import {
  ChartNoAxesCombined,
  CircleDollarSign,
  ClipboardCheck,
  Goal,
} from "lucide-react";

const features = [
  {
    title: "경기 운영",
    description:
      "경기 생성부터 참석 투표, 실제 출석과 팀 배정까지 하나의 흐름으로 관리합니다.",
    detail: "일정 · 투표 · 출석 · 팀 배정",
    icon: ClipboardCheck,
    className: "md:col-span-2",
  },
  {
    title: "전술 보드",
    description: "축구와 풋살에 맞는 포메이션과 전담 선수를 구성합니다.",
    detail: "축구 · 풋살 · 자체전",
    icon: Goal,
    className: "",
  },
  {
    title: "기록과 통계",
    description: "시즌별 팀 성적과 선수의 득점, 도움, 출전 기록을 확인합니다.",
    detail: "경기 기록 · 선수 순위",
    icon: ChartNoAxesCombined,
    className: "",
  },
  {
    title: "회비 관리",
    description:
      "월별 납부 현황과 입출금 내역, 출석에 따른 벌금까지 관리합니다.",
    detail: "회비 · 입출금 · 벌금",
    icon: CircleDollarSign,
    className: "md:col-span-2",
  },
] as const;

export default function LandingFeatureSection() {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl scroll-mt-16 px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="grid gap-4 sm:gap-8 lg:grid-cols-[0.7fr_1fr] lg:items-end">
        <div>
          <p className="text-xs font-bold text-emerald-600 sm:text-sm">
            주요 기능
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-900 sm:mt-3 sm:text-4xl">
            팀 운영의 모든 순간을 연결합니다
          </h2>
        </div>

        <p className="max-w-xl text-xs leading-5 text-stone-500 sm:text-base sm:leading-7 lg:justify-self-end">
          경기 전 준비부터 경기 후 기록과 회비 정산까지, 여러 도구에 흩어진 팀
          운영 업무를 SquadFlow 안에서 이어갈 수 있습니다.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:mt-12 sm:gap-4 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isEmphasized = index === 0;

          return (
            <article
              key={feature.title}
              className={`relative min-h-[208px] overflow-hidden rounded-2xl border p-4 transition duration-300 hover:-translate-y-1 sm:min-h-64 sm:rounded-3xl sm:p-7 ${
                isEmphasized
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-stone-200 bg-white text-stone-900"
              } ${feature.className}`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12 sm:rounded-2xl ${
                  isEmphasized
                    ? "bg-white/15 text-white"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.8} />
              </div>

              <h3 className="mt-5 text-xl font-black tracking-tight sm:mt-8 sm:text-2xl">
                {feature.title}
              </h3>

              <p
                className={`mt-2 max-w-lg text-xs leading-5 sm:mt-3 sm:text-sm sm:leading-6 ${
                  isEmphasized ? "text-emerald-50" : "text-stone-500"
                }`}
              >
                {feature.description}
              </p>

              <p
                className={`absolute bottom-4 left-4 text-[11px] font-bold sm:bottom-7 sm:left-7 sm:text-xs ${
                  isEmphasized ? "text-emerald-200" : "text-emerald-700"
                }`}
              >
                {feature.detail}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
