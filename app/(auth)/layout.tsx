import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white">
            S
          </span>
          <span className="text-lg font-black tracking-tight text-stone-900">
            SquadFlow
          </span>
        </Link>

        <div className="py-10">{children}</div>
      </div>
    </main>
  );
}
