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
      className="mx-auto max-w-7xl scroll-mt-16 px-6 py-24"
    >
      <div className="grid gap-8 lg:grid-cols-[0.7fr_1fr] lg:items-end">
        <div>
          <p className="text-sm font-bold text-emerald-600">주요 기능</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-stone-900">
            팀 운영의 모든 순간을 연결합니다
          </h2>
        </div>

        <p className="max-w-xl text-base leading-7 text-stone-500 lg:justify-self-end">
          경기 전 준비부터 경기 후 기록과 회비 정산까지, 여러 도구에 흩어진 팀
          운영 업무를 SquadFlow 안에서 이어갈 수 있습니다.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isEmphasized = index === 0;

          return (
            <article
              key={feature.title}
              className={`group relative min-h-64 overflow-hidden rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 ${
                isEmphasized
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-stone-200 bg-white text-stone-900"
              } ${feature.className}`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  isEmphasized
                    ? "bg-white/15 text-white"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                <Icon className="h-6 w-6" strokeWidth={1.8} />
              </div>

              <h3 className="mt-8 text-2xl font-black tracking-tight">
                {feature.title}
              </h3>

              <p
                className={`mt-3 max-w-lg text-sm leading-6 ${
                  isEmphasized ? "text-emerald-50" : "text-stone-500"
                }`}
              >
                {feature.description}
              </p>

              <p
                className={`absolute bottom-7 left-7 text-xs font-bold ${
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
