import SignupPageClient from "@/components/auth/SignupPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입 | SquadFlow",
  description: "계정을 만들고 팀 관리 서비스를 시작하세요.",
};

export default function SignupPage() {
  return <SignupPageClient />;
}
