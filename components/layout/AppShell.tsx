import Sidebar from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: Readonly<AppShellProps>) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 lg:grid lg:grid-cols-[260px_1fr] lg:gap-4 lg:px-3">
        <Sidebar />
        <main className="w-full min-w-0">{children}</main>
      </div>
    </div>
  );
}
