import ToastViewport from "@/components/common/ToastViewport";
import "./globals.css";
import localFont from "next/font/local";
import ConfirmDialog from "@/components/common/ConfirmDialog";

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
