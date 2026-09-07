import ToastViewport from "@/components/common/ToastViewport";
import "./globals.css";
import localFont from "next/font/local";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SquadFlow",
  description:
    "아마추어 축구와 풋살팀의 경기, 선수, 전술, 회비를 관리하는 팀 운영 서비스입니다.",
};

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable}`}>
      <body className="bg-background text-foreground antialiased">
        {children}
        <ConfirmDialog />
        <ToastViewport />
      </body>
    </html>
  );
}
