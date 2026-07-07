export default function SetupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10">{children}</main>
  );
}
