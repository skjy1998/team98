"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuProps {
  label: string;
  icon?: React.ReactNode;
  href: string;
}

export default function MenuItem({ label, icon, href }: Readonly<MenuProps>) {
  const pathname = usePathname();

  const isActive = pathname.startsWith(href);

  return (
    <Link href={href}>
      <div
        className={`
          flex items-center gap-3 px-2 py-4 rounded-lg hover:bg-gray-200 cursor-pointer transition
          ${isActive ? "text-green-500" : "text-gray-400 hover:text-green-500 hover:bg-gray-100"}`}
      >
        {icon}
        <span className="font-semibold">{label}</span>
      </div>
    </Link>
  );
}
