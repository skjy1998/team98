import PasswordUpdatePageClient from "@/components/auth/PasswordUpdatePageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "새 비밀번호 설정 | SquadFlow",
  description: "새로운 비밀번호를 설정하고 계정을 복구하세요.",
};

export default function ResetPasswordPage() {
  return <PasswordUpdatePageClient />;
}
