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
      <p className="mt-1 text-sm font-medium text-stone-500">{name}</p>

      <div className="mt-4 flex items-end">
        <span className="text-4xl font-bold text-stone-900">{value}</span>
        <span className="ml-1 text-2xl font-semibold text-stone-500">
          {unit}
        </span>
      </div>
    </div>
  );
}
