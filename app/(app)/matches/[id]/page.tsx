import MatchDetailPageClient from "@/components/matches/detail/MatchDetailPageClient";
import { Metadata } from "next";

interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "경기 상세 | SquadFlow",
    description: "경기 상세 정보와 투표, 전술, 기록을 확인하세요.",
  };
}

export default async function MatchDetailPage({
  params,
}: Readonly<MatchDetailPageProps>) {
  const { id } = await params;

  return <MatchDetailPageClient matchId={id} />;
}
