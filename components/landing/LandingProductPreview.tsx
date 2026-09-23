import {
  CalendarDays,
  Check,
  CircleDollarSign,
  MapPin,
  Users,
} from "lucide-react";

export default function LandingProductPreview() {
  return (
    <div
      aria-hidden="true"
      className="relative min-h-[330px] sm:min-h-[460px] lg:min-h-[520px]"
    >
      <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200/50 blur-3xl sm:h-[390px] sm:w-[390px]" />

      <div className="absolute inset-x-2 top-6 rotate-[-2deg] rounded-2xl border border-white/80 bg-white/90 p-3.5 shadow-[0_32px_80px_-32px_rgba(6,78,59,0.35)] backdrop-blur sm:inset-x-4 sm:top-10 sm:rounded-[28px] sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 sm:px-3 sm:text-xs">
              다음 경기
            </span>
            <p className="mt-2.5 text-[11px] font-semibold text-stone-400 sm:mt-4 sm:text-xs">
              9월 12일 토요일 · 20:00 - 22:00
            </p>
            <h2 className="mt-2 text-lg font-black tracking-tight text-stone-900 sm:text-2xl">
              SquadFlow FC
              <span className="mx-2 text-stone-300">vs</span>
              Riverside
            </h2>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold text-stone-400 sm:text-xs">
              투표 마감
            </p>
            <p className="mt-1 text-lg font-black text-rose-500 sm:text-xl">
              D-3
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-stone-100 pt-3 text-xs font-medium text-stone-500 sm:mt-6 sm:pt-5 sm:text-sm">
          <MapPin className="h-4 w-4 text-emerald-600" />
          서울 축구 아레나
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-5 sm:gap-2">
          <div className="rounded-xl bg-emerald-600 px-2 py-2 text-center text-xs font-bold text-white sm:rounded-2xl sm:px-3 sm:py-3 sm:text-sm">
            참석 12
          </div>
          <div className="rounded-xl bg-stone-100 px-2 py-2 text-center text-xs font-bold text-stone-500 sm:rounded-2xl sm:px-3 sm:py-3 sm:text-sm">
            미정 3
          </div>
          <div className="rounded-xl bg-stone-100 px-2 py-2 text-center text-xs font-bold text-stone-500 sm:rounded-2xl sm:px-3 sm:py-3 sm:text-sm">
            불참 2
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 left-0 rotate-[3deg] rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-emerald-900 shadow-xl shadow-emerald-900/10 sm:bottom-10 sm:rounded-2xl sm:px-5 sm:py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 sm:h-10 sm:w-10 sm:rounded-xl">
            <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <div>
            <p className="text-xs font-medium text-emerald-600">이번 시즌</p>
            <p className="mt-0.5 font-bold">8승 2무 3패</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 rotate-[-2deg] rounded-xl border border-emerald-100 bg-white px-3 py-2.5 shadow-xl shadow-emerald-900/10 sm:bottom-4 sm:right-2 sm:rounded-2xl sm:px-5 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 sm:h-10 sm:w-10 sm:rounded-xl">
            <CircleDollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <div>
            <p className="text-xs font-medium text-stone-400">회비 납부</p>
            <p className="mt-0.5 flex items-center gap-1 font-bold text-stone-800">
              <Check className="h-4 w-4 text-emerald-600" />
              납부 완료
            </p>
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-0 flex items-center gap-1.5 rounded-full border border-white bg-white/90 px-2.5 py-1.5 text-[11px] font-bold text-stone-700 shadow-lg backdrop-blur sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
        <Users className="h-4 w-4 text-emerald-600" />
        팀원 24명
      </div>
    </div>
  );
}
