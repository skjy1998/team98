import MenuItem from "./MenuItem";
import {
  BarChart,
  Calendar,
  ClipboardList,
  Home,
  LayoutGrid,
  Settings,
  Users,
} from "lucide-react";

const menuItems = [
  { label: "대시보드", href: "/dashboard", icon: Home },
  { label: "선수 관리", href: "/players", icon: Users },
  { label: "경기 일정", href: "/matches", icon: ClipboardList },
  { label: "전술/포메이션", href: "/tactics", icon: LayoutGrid },
  { label: "통계", href: "/stats", icon: BarChart },
  { label: "스케줄", href: "/schedule", icon: Calendar },
  { label: "팀 설정", href: "/teamSetting", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-[240px] bg-[#F9FAFB] border-r border-gray-200 p-5 flex flex-col">
      {/* Logo */}
      <div className="text-lg font-semibold mb-8 flex text-center gap-2">
        ⚽ Team 98
      </div>
      {/* Menu */}
      <nav className="space-y-1 text-sm">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <MenuItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={<Icon size={18} />}
            />
          );
        })}
      </nav>
    </aside>
  );
}
