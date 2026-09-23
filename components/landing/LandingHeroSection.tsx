import Link from "next/link";
import LandingProductPreview from "./LandingProductPreview";

export default function LandingHeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-stone-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_42%)]" />

      <div className="relative mx-auto grid min-h-0 max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:min-h-[620px] lg:grid-cols-[1fr_0.9fr] lg:gap-12">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600 sm:text-sm">
            Amateur Team Management
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:mt-5 sm:text-5xl md:text-7xl">
            축구와 풋살팀 운영을
            <span className="block text-emerald-600">하나의 흐름으로</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-stone-500 sm:mt-6 sm:text-lg sm:leading-8">
            경기 일정부터 투표, 출석, 전술, 기록, 회비까지 팀 운영에 필요한
            기능을 한곳에서 관리하세요.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-9 sm:flex sm:flex-wrap sm:gap-3">
            <Link
              href="/signup"
              className="flex items-center justify-center rounded-xl bg-emerald-600 px-3 py-3 text-xs font-bold text-white transition hover:bg-emerald-700 sm:rounded-2xl sm:px-6 sm:py-3.5 sm:text-sm"
            >
              무료로 시작하기
            </Link>

            <a
              href="#features"
              className="flex items-center justify-center rounded-xl border border-stone-300 bg-white px-3 py-3 text-xs font-bold text-stone-700 transition hover:border-emerald-300 sm:rounded-2xl sm:px-6 sm:py-3.5 sm:text-sm"
            >
              주요 기능 보기
            </a>
          </div>
        </div>
        <LandingProductPreview />
      </div>
    </section>
  );
}
