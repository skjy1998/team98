const weekLabels = ["일", "월", "화", "수", "목", "금", "토"] as const;

export function getDashboardMatchDDay(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(`${date}T00:00:00`);
  target.setHours(0, 0, 0, 0);

  const diff = Math.floor(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff === 0) return "D-Day";
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

export function getDashboardMatchDateParts(date: string) {
  const target = new Date(`${date}T00:00:00`);

  return {
    month: target.getMonth() + 1,
    day: target.getDate(),
    dayOfWeek: `${weekLabels[target.getDay()]}요일`,
  };
}
