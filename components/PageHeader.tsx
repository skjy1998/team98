interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({
  title,
  description,
}: Readonly<PageHeaderProps>) {
  return (
    <div>
      <h2 className="text-xl font-bold ">{title}</h2>
      {description && <p className="text-sm text-gray-500 ">{description}</p>}
    </div>
  );
}
