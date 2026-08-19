import ContentState from "@/components/common/ContentState";
import type { FinanceEmptyStateProps } from "@/types/finance-ui";

export default function FinanceEmptyState({
  message,
}: Readonly<FinanceEmptyStateProps>) {
  return (
    <ContentState
      variant="empty"
      title={message}
      description="다른 월을 선택하거나 새로운 거래를 등록해 보세요."
    />
  );
}
