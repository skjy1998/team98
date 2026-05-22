import Sidebar from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: Readonly<AppShellProps>) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-[260px_1fr] gap-4 px-3 py-4 ">
        <Sidebar />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
