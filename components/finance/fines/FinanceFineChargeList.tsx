import type { FineCharge } from "@/types/finance";
import FinanceFineChargeItem from "./FinanceFineChargeItem";

interface FinanceFineChargeListProps {
  fineCharges: FineCharge[];
  canManage: boolean;
  deleteFineCharge: (fineChargeId: string) => Promise<boolean>;
  onChangeFineChargeStatus: (
    charge: FineCharge,
    nextStatus: FineCharge["status"],
  ) => Promise<boolean>;
}

export default function FinanceFineChargeList({
  fineCharges,
  canManage,
  deleteFineCharge,
  onChangeFineChargeStatus,
}: Readonly<FinanceFineChargeListProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white">
      {fineCharges.length === 0 ? (
        <div className="p-10 text-center text-sm text-stone-500">
          아직 생성된 벌금 내역이 없어요.
        </div>
      ) : (
        <div className="divide-y divide-stone-200">
          {fineCharges.map((charge) => (
            <FinanceFineChargeItem
              key={charge.id}
              charge={charge}
              canManage={canManage}
              onDelete={deleteFineCharge}
              onChangeStatus={onChangeFineChargeStatus}
            />
          ))}
        </div>
      )}
    </section>
  );
}
