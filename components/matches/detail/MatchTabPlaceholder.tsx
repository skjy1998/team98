interface MatchTabPlaceholderProps {
  label: string;
}

export default function MatchTabPlaceholder({
  label,
}: Readonly<MatchTabPlaceholderProps>) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center">
      <p className="text-lg font-semibold text-stone-800">{label} 탭 준비중</p>
      <p className="mt-2 text-sm text-stone-400">
        이 영역에 {label} 관련 UI를 붙이면 됩니다.
      </p>
    </div>
  );
}
