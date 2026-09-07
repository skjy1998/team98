import LoginPageClient from "@/components/auth/LoginPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 | SquadFlow",
  description: "계정에 로그인하고 팀 관리 서비스를 이용하세요.",
};

export default function LoginPage() {
  return <LoginPageClient />;
}
