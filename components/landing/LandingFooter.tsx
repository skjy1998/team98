import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 text-xs sm:px-6 sm:py-8 sm:text-sm">
        <Link href="/" className="font-black text-stone-800">
          SquadFlow
        </Link>

        <p className="text-right text-[11px] text-stone-400 sm:text-sm">
          축구·풋살팀 운영 관리 프로젝트
        </p>
      </div>
    </footer>
  );
}
