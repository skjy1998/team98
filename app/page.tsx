import LandingPage from "@/components/landing/LandingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SquadFlow | 축구·풋살팀 운영 관리",
  description:
    "경기 일정, 투표, 출석, 전술, 기록과 회비를 한곳에서 관리하세요.",
};

export default function HomePage() {
  return <LandingPage />;
}
