import { MatchStatus, MatchType } from "@/types/match";

export const statusMap: Record<
  MatchStatus,
  {
    label: string;
    badgeClassName: string;
    valueText: string;
    scoreClassName: string;
  }
> = {
  scheduled: {
    label: "예정",
    badgeClassName: "bg-emerald-50 text-emerald-700",
    valueText: "경기 전",
    scoreClassName: "text-emerald-700",
  },
  win: {
    label: "승",
    badgeClassName: "bg-emerald-50 text-emerald-700",
    valueText: "",
    scoreClassName: "text-emerald-700",
  },
  lose: {
    label: "패",
    badgeClassName: "bg-rose-50 text-rose-600",
    valueText: "",
    scoreClassName: "text-rose-600",
  },
  draw: {
    label: "무",
    badgeClassName: "bg-stone-100 text-stone-600",
    valueText: "",
    scoreClassName: "text-stone-700",
  },
  canceled: {
    label: "취소",
    badgeClassName: "bg-stone-100 text-stone-500",
    valueText: "취소됨",
    scoreClassName: "text-stone-400",
  },
};

export const typeMap: Record<MatchType, string> = {
  정규: "bg-emerald-50 text-emerald-700",
  연습: "bg-stone-100 text-stone-600",
  자체전: "bg-sky-50 text-sky-600",
};
