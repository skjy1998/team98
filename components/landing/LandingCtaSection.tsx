import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const benefits = [
  "팀 생성 후 바로 시작",
  "축구와 풋살 모두 지원",
  "경기부터 회비까지 통합 관리",
] as const;

export default function LandingCtaSection() {
  return (
    <section className="bg-stone-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1fr_0.7fr] lg:items-end">
        <div>
          <p className="text-sm font-bold text-emerald-400">
            함께 운영하는 팀 관리
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-5xl">
            경기 준비에 쓰던 시간을
            <span className="block text-emerald-400">
              팀과 함께 뛰는 데 사용하세요.
            </span>
          </h2>

          <p className="mt-6 max-w-xl leading-7 text-stone-400">
            반복되는 팀 운영 업무를 한곳에 모으고, 모든 팀원이 같은 정보를
            확인할 수 있습니다.
          </p>
        </div>

        <div className="lg:justify-self-end">
          <ul className="space-y-3">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-3 text-sm font-semibold text-stone-300"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                {benefit}
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-400"
          >
            SquadFlow 시작하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
