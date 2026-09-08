import Link from "next/link";
import LandingProductPreview from "./LandingProductPreview";

export default function LandingHeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-stone-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_42%)]" />

      <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Amateur Team Management
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.08] tracking-tight md:text-7xl">
            축구와 풋살팀 운영을
            <span className="block text-emerald-600">하나의 흐름으로</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-500">
            경기 일정부터 투표, 출석, 전술, 기록, 회비까지 팀 운영에 필요한
            기능을 한곳에서 관리하세요.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-2xl bg-stone-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              무료로 시작하기
            </Link>

            <a
              href="#features"
              className="rounded-2xl border border-stone-300 bg-white px-6 py-3.5 text-sm font-bold text-stone-700 transition hover:border-emerald-300"
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
