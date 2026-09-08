const workflowSteps = [
  {
    number: "01",
    phase: "경기 전",
    title: "일정을 공유하고 참석 인원을 확정합니다",
    description:
      "경기를 등록하면 팀원이 참석 여부를 투표하고, 확정된 인원을 기준으로 출석과 전술을 준비합니다.",
    keywords: ["경기 일정", "참석 투표", "전술 구성"],
  },
  {
    number: "02",
    phase: "경기 당일",
    title: "출석과 팀 배정을 한 화면에서 관리합니다",
    description:
      "실제 참석 상태를 기록하고 자체전 팀과 포메이션을 구성해 경기 준비 시간을 줄입니다.",
    keywords: ["출석 체크", "팀 배정", "포메이션"],
  },
  {
    number: "03",
    phase: "경기 후",
    title: "기록을 팀 통계와 회비 관리로 연결합니다",
    description:
      "경기 결과와 개인 기록을 저장하고 시즌 통계, 회비, 벌금 내역까지 이어서 관리합니다.",
    keywords: ["경기 기록", "시즌 통계", "회비 정산"],
  },
] as const;

export default function LandingWorkflowSection() {
  return (
    <section className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-bold text-emerald-600">운영 흐름</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-stone-900">
            경기의 시작과 끝이 하나로 이어집니다
          </h2>
          <p className="mt-4 leading-7 text-stone-500">
            매번 반복되는 팀 운영 과정을 경기의 시간 순서에 맞춰 관리할 수
            있습니다.
          </p>
        </div>

        <ol className="mt-14 border-t border-stone-200">
          {workflowSteps.map((step) => (
            <li
              key={step.number}
              className="grid gap-5 border-b border-stone-200 py-9 md:grid-cols-[80px_140px_1fr] md:items-start"
            >
              <span className="text-sm font-black text-emerald-600">
                {step.number}
              </span>

              <p className="text-sm font-bold text-stone-400">{step.phase}</p>

              <div>
                <h3 className="text-xl font-black tracking-tight text-stone-900 md:text-2xl">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
                  {step.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {step.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
