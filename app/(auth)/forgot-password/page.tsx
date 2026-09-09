import PasswordResetRequestPageClient from "@/components/auth/PasswordResetRequestPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "비밀번호 찾기 | SquadFlow",
  description: "이메일로 비밀번호 재설정 링크를 요청하세요.",
};

export default function ForgotPasswordPage() {
  return <PasswordResetRequestPageClient />;
}
