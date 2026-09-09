import Link from "next/link";

export default function SetupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-stone-50 px-4 py-6">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 -top-32 h-[440px] w-[440px] rounded-full bg-emerald-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white">
            S
          </span>
          <span className="text-lg font-black tracking-tight text-stone-900">
            SquadFlow
          </span>
        </Link>

        <div className="mt-10 pb-10">{children}</div>
      </div>
    </main>
  );
}
