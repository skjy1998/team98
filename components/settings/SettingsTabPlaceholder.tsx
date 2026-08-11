interface SettingsTabPlaceholderProps {
  title: string;
  description: string;
}

export default function SettingsTabPlaceholder({
  title,
  description,
}: Readonly<SettingsTabPlaceholderProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-8">
      <h2 className="text-xl font-semibold text-stone-900">{title}</h2>
      <p className="mt-2 text-sm text-stone-500">{description}</p>
    </section>
  );
}
