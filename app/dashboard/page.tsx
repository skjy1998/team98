import PageHeader from "@/components/PageHeader";

export const metadata: { title: string } = {
  title: "대시 보드",
};

export default function DashboardPage() {
  return (
    <PageHeader
      title="대시보드"
      description="팀의 최신 현황을 한눈에 확인하세요."
    />
  );
}
