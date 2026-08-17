import BoardPageClient from "@/components/board/BoardPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "게시판 | SquadFlow",
  description: "팀 공지와 게시물을 확인하고 이야기를 나누세요.",
};

export default function BoardPage() {
  return <BoardPageClient />;
}
