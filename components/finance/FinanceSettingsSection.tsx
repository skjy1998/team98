import { FeeType, FineRule } from "@/types/finance";
import { useState } from "react";

interface FinanceSettingsSectionProps {
  dueDay: number;
  setDueDay: (value: number) => void;
  feeTypes: FeeType[];
  setFeeTypes: React.Dispatch<React.SetStateAction<FeeType[]>>;
  fineRules: FineRule[];
  setFineRules: React.Dispatch<React.SetStateAction<FineRule[]>>;
}

export default function FinanceSettingsSection({
  dueDay,
  setDueDay,
  feeTypes,
  setFeeTypes,
  fineRules,
  setFineRules,
}: Readonly<FinanceSettingsSectionProps>) {
  const [isAddingFeeType, setIsAddingFeeType] = useState(false);
  const [feeTypeName, setFeeTypeName] = useState("");
  const [feeTypeDescription, setFeeTypeDescription] = useState("");
  const [feeTypeAmount, setFeeTypeAmount] = useState(30000);

  const [isAddingFineRule, setIsAddingFineRule] = useState(false);
  const [fineRuleName, setFineRuleName] = useState("");
  const [fineRuleTrigger, setFineRuleTrigger] = useState("late");
  const [fineRuleAmount, setFineRuleAmount] = useState(5000);

  const [editingFeeTypeId, setEditingFeeTypeId] = useState<string | null>(null);
  const [editingFeeAmount, setEditingFeeAmount] = useState("");

  const fineTriggerLabel: Record<string, string> = {
    late: "지각",
    absence: "무단 결석",
    noshow: "미투표",
  };

  const handleCancelFeeType = () => {
    setIsAddingFeeType(false);
    setFeeTypeName("");
    setFeeTypeDescription("");
    setFeeTypeAmount(30000);
  };

  const handleSaveFeeType = () => {
    if (!feeTypeName.trim() || feeTypeAmount <= 0) {
      return;
    }

    setFeeTypes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: feeTypeName.trim(),
        description: feeTypeDescription.trim(),
        amount: feeTypeAmount,
      },
    ]);

    handleCancelFeeType();
  };

  const handleDeleteFeeType = (feeTypeId: string) => {
    setFeeTypes((prev) => prev.filter((feeType) => feeType.id !== feeTypeId));
  };

  const handleCancelFineRule = () => {
    setIsAddingFineRule(false);
    setFineRuleName("");
    setFineRuleTrigger("late");
    setFineRuleAmount(5000);
  };

  const handleStartEditFeeType = (feeTypeId: string, amount: number) => {
    setEditingFeeTypeId(feeTypeId);
    setEditingFeeAmount(String(amount));
  };

  const handleCancelEditFeeType = () => {
    setEditingFeeTypeId(null);
    setEditingFeeAmount("");
  };

  const handleSaveEditFeeType = (feeTypeId: string) => {
    const nextAmount = Number(editingFeeAmount);

    if (nextAmount <= 0) {
      return;
    }

    setFeeTypes((prev) =>
      prev.map((feeType) =>
        feeType.id === feeTypeId ? { ...feeType, amount: nextAmount } : feeType,
      ),
    );

    handleCancelEditFeeType();
  };

  const handleSaveFineRule = () => {
    if (!fineRuleName.trim() || fineRuleAmount <= 0) {
      return;
    }

    setFineRules((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: fineRuleName.trim(),
        trigger: fineRuleTrigger,
        amount: fineRuleAmount,
      },
    ]);

    handleCancelFineRule();
  };

  const handleDeleteFineRule = (ruleId: string) => {
    setFineRules((prev) => prev.filter((rule) => rule.id !== ruleId));
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <p className="text-lg font-semibold text-stone-900">회비 설정</p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-stone-500">
              납부 기준일
            </p>
            <select
              value={dueDay}
              onChange={(event) => setDueDay(Number(event.target.value))}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-5 py-4 text-base font-semibold text-stone-900 outline-none focus:border-orange-300"
            >
              {Array.from({ length: 28 }, (_, index) => index + 1).map(
                (day) => (
                  <option key={day} value={day}>
                    매월 {day}일
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-stone-500">회비 기준</p>

            {isAddingFeeType && (
              <div className="mb-4 rounded-xl border border-orange-200 bg-white px-5 py-5 shadow-sm">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="mb-2 text-sm font-medium text-stone-500">
                      유형 이름
                    </p>
                    <input
                      value={feeTypeName}
                      onChange={(event) => setFeeTypeName(event.target.value)}
                      placeholder="예: 일반"
                      className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300"
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-stone-500">
                      설명
                    </p>
                    <input
                      value={feeTypeDescription}
                      onChange={(event) =>
                        setFeeTypeDescription(event.target.value)
                      }
                      placeholder="예: 월 회비"
                      className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300"
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-stone-500">
                      금액
                    </p>
                    <input
                      type="number"
                      value={feeTypeAmount}
                      onChange={(event) =>
                        setFeeTypeAmount(Number(event.target.value) || 0)
                      }
                      placeholder="30000"
                      className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300"
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelFeeType}
                    className="rounded-xl px-4 py-3 text-base font-medium text-stone-500 transition hover:bg-stone-100"
                  >
                    취소
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveFeeType}
                    className="rounded-xl bg-orange-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-orange-600"
                  >
                    저장
                  </button>
                </div>
              </div>
            )}

            {feeTypes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-5 py-10 text-center text-sm text-stone-400">
                등록된 회비 유형이 없습니다
              </div>
            ) : (
              <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
                {feeTypes.map((feeType, index) => (
                  <div key={feeType.id}>
                    <div className="flex items-center justify-between px-5 py-5">
                      <div>
                        <p className="text-base font-semibold text-stone-900">
                          {feeType.name}{" "}
                          {feeType.description && (
                            <span className="text-stone-400">
                              ({feeType.description})
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {editingFeeTypeId === feeType.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              autoFocus
                              type="number"
                              value={editingFeeAmount}
                              onChange={(event) =>
                                setEditingFeeAmount(event.target.value)
                              }
                              onBlur={() => handleSaveEditFeeType(feeType.id)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  handleSaveEditFeeType(feeType.id);
                                }
                                if (event.key === "Escape") {
                                  handleCancelEditFeeType();
                                }
                              }}
                              className="w-32 rounded-xl border border-stone-200 bg-white px-3 py-2 text-right text-2xl font-semibold text-stone-900 outline-none focus:border-orange-300"
                            />
                            <span className="text-lg font-semibold text-stone-500">
                              원
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleStartEditFeeType(feeType.id, feeType.amount)
                            }
                            className="text-3xl font-semibold text-stone-900 transition hover:text-orange-500"
                          >
                            {feeType.amount.toLocaleString()}원
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteFeeType(feeType.id)}
                          className="text-xl text-stone-400 transition hover:text-stone-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {index < feeTypes.length - 1 && (
                      <div className="border-t border-stone-100" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsAddingFeeType(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-5 py-4 text-base font-semibold text-stone-700 shadow-sm transition hover:bg-stone-100"
          >
            + 회비 유형 추가
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-stone-900">벌금 규칙</p>
            <p className="mt-1 text-sm text-stone-400">
              경기 완료 시 자동으로 벌금이 부과됩니다
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingFineRule(true)}
            className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-base font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50"
          >
            + 추가
          </button>
        </div>

        {isAddingFineRule && (
          <div className="rounded-xl border border-orange-200 bg-white px-5 py-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="mb-2 text-sm font-medium text-stone-500">
                  규칙 이름
                </p>
                <input
                  value={fineRuleName}
                  onChange={(event) => setFineRuleName(event.target.value)}
                  placeholder="예: 지각비"
                  className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-stone-500">
                  트리거
                </p>
                <select
                  value={fineRuleTrigger}
                  onChange={(event) => setFineRuleTrigger(event.target.value)}
                  className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none focus:border-orange-300"
                >
                  <option value="late">지각</option>
                  <option value="absence">무단 결석</option>
                  <option value="noshow">미투표</option>
                </select>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-stone-500">금액</p>
                <input
                  type="number"
                  value={fineRuleAmount}
                  onChange={(event) =>
                    setFineRuleAmount(Number(event.target.value) || 0)
                  }
                  placeholder="5000"
                  className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelFineRule}
                className="rounded-xl px-4 py-3 text-base font-medium text-stone-500 transition hover:bg-stone-100"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleSaveFineRule}
                className="rounded-xl bg-orange-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-orange-600"
              >
                저장
              </button>
            </div>
          </div>
        )}

        {fineRules.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-5 py-10 text-center text-sm text-stone-400">
            등록된 벌금 규칙이 없습니다
          </div>
        ) : (
          <div className="space-y-3">
            {fineRules.map((rule) => (
              <div
                key={rule.id}
                className="rounded-xl border border-stone-200 bg-white px-5 py-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-stone-900">
                      {rule.name}{" "}
                      <span className="text-stone-400">
                        ({fineTriggerLabel[rule.trigger]})
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-3xl font-semibold text-rose-500">
                      {rule.amount.toLocaleString()}원
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDeleteFineRule(rule.id)}
                      className="text-xl text-rose-400 transition hover:text-rose-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
