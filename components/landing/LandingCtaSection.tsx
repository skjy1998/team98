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
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:gap-12 sm:px-6 sm:py-24 lg:grid-cols-[1fr_0.7fr] lg:items-end">
        <div>
          <p className="text-xs font-bold text-emerald-400 sm:text-sm">
            함께 운영하는 팀 관리
          </p>

          <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:mt-4 sm:text-4xl md:text-5xl">
            경기 준비에 쓰던 시간을
            <span className="block text-emerald-400">
              팀과 함께 뛰는 데 사용하세요.
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-xs leading-5 text-stone-400 sm:text-base sm:leading-7">
            반복되는 팀 운영 업무를 한곳에 모으고, 모든 팀원이 같은 정보를
            확인할 수 있습니다.
          </p>
        </div>

        <div className="lg:justify-self-end">
          <ul className="space-y-2.5 sm:space-y-3">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-2 text-xs font-semibold text-stone-300 sm:text-sm"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                {benefit}
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-xs font-bold text-white transition hover:bg-emerald-400 sm:mt-8 sm:inline-flex sm:w-auto sm:gap-3 sm:rounded-2xl sm:px-6 sm:py-3.5 sm:text-sm"
          >
            SquadFlow 시작하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
