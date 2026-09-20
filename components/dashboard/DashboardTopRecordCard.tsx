interface DashboardTopRecordCardProps {
  title: string;
  name: string;
  value: number;
  unit: string;
  cardClassName: string;
  titleClassName: string;
}

export default function DashboardTopRecordCard({
  title,
  name,
  value,
  unit,
  cardClassName,
  titleClassName,
}: Readonly<DashboardTopRecordCardProps>) {
  return (
    <div className={cardClassName}>
      <p className={titleClassName}>{title}</p>
      <p className="mt-1 truncate text-xs font-medium text-stone-500 sm:text-sm">
        {name}
      </p>

      <div className="mt-3 flex items-end sm:mt-4">
        <span className="text-3xl font-bold text-stone-900 sm:text-4xl">
          {value}
        </span>
        <span className="ml-1 text-xs font-semibold text-stone-500 sm:text-2xl">
          {unit}
        </span>
      </div>
    </div>
  );
}
