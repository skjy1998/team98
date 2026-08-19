import NotificationsPageClient from "@/components/notifications/NotificationPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "알림 | SquadFlow",
  description: "경기, 회비, 게시판과 팀 운영 알림을 확인하세요.",
};

export default function NotificationsPage() {
  return <NotificationsPageClient />;
}
