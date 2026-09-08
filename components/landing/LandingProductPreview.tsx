import {
  CalendarDays,
  Check,
  CircleDollarSign,
  MapPin,
  Users,
} from "lucide-react";

export default function LandingProductPreview() {
  return (
    <div aria-hidden="true" className="relative min-h-[460px] lg:min-h-[520px]">
      <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200/50 blur-3xl" />

      <div className="absolute inset-x-4 top-10 rotate-[-2deg] rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_32px_80px_-32px_rgba(6,78,59,0.35)] backdrop-blur">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              다음 경기
            </span>
            <p className="mt-4 text-xs font-semibold text-stone-400">
              9월 12일 토요일 · 20:00 - 22:00
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-900">
              SquadFlow FC
              <span className="mx-2 text-stone-300">vs</span>
              Riverside
            </h2>
          </div>

          <div className="text-right">
            <p className="text-xs font-bold text-stone-400">투표 마감</p>
            <p className="mt-1 text-xl font-black text-rose-500">D-3</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 border-t border-stone-100 pt-5 text-sm font-medium text-stone-500">
          <MapPin className="h-4 w-4 text-emerald-600" />
          서울 축구 아레나
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-emerald-600 px-3 py-3 text-center text-sm font-bold text-white">
            참석 12
          </div>
          <div className="rounded-2xl bg-stone-100 px-3 py-3 text-center text-sm font-bold text-stone-500">
            미정 3
          </div>
          <div className="rounded-2xl bg-stone-100 px-3 py-3 text-center text-sm font-bold text-stone-500">
            불참 2
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 rotate-[3deg] rounded-2xl border border-white bg-stone-900 px-5 py-4 text-white shadow-xl shadow-stone-900/20">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-medium text-stone-400">이번 시즌</p>
            <p className="mt-0.5 font-bold">8승 2무 3패</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-2 rotate-[-2deg] rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-xl shadow-emerald-900/10">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <CircleDollarSign className="h-5 w-5" />
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

      <div className="absolute right-0 top-0 flex items-center gap-2 rounded-full border border-white bg-white/90 px-4 py-2 text-xs font-bold text-stone-700 shadow-lg backdrop-blur">
        <Users className="h-4 w-4 text-emerald-600" />
        팀원 24명
      </div>
    </div>
  );
}
