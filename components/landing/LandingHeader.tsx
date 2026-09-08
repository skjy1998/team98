import Link from "next/link";

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white">
            S
          </span>
          <span className="text-lg font-black tracking-tight text-stone-900">
            SquadFlow
          </span>
        </Link>

        <nav aria-label="주요 메뉴" className="flex items-center gap-2">
          <a
            href="#features"
            className="hidden px-3 py-2 text-sm font-semibold text-stone-500 transition hover:text-stone-900 sm:block"
          >
            주요 기능
          </a>

          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-white hover:text-stone-900"
          >
            로그인
          </Link>

          <Link
            href="/signup"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            시작하기
          </Link>
        </nav>
      </div>
    </header>
  );
}
