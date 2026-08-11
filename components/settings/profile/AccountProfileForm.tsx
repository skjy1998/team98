import { useState } from "react";

interface AccountProfileFormProps {
  name: string;
  email: string;
  onSaveName: (name: string) => Promise<boolean>;
  onChangeEmail: (email: string) => Promise<boolean>;
}

export default function AccountProfileForm({
  name: initialName,
  email: initialEmail,
  onSaveName,
  onChangeEmail,
}: Readonly<AccountProfileFormProps>) {
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

  const handleSaveName = async () => {
    setSuccessMessage("");
    setIsSaving(true);

    const success = await onSaveName(name);

    setIsSaving(false);

    if (success) {
      setSuccessMessage("이름이 변경됐어요.");
    }
  };

  const handleChangeEmail = async () => {
    setEmailMessage("이메일이 변경됐어요.");
    setIsChangingEmail(true);

    const success = await onChangeEmail(email);

    setIsChangingEmail(false);

    if (success) {
      setEmailMessage(
        "이메일 변경 확인 메일을 보냈어요. 메일의 링크를 확인해 주세요.",
      );
    }
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">계정 정보</h2>
        <p className="mt-1 text-sm text-stone-400">
          가입할 때 등록한 이름과 이메일을 관리할 수 있어요.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label
            htmlFor="profile-name"
            className="mb-2 block text-sm font-medium text-stone-600"
          >
            이름
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            disabled={isSaving}
            onChange={(event) => setName(event.target.value)}
            className="h-12 w-full rounded-xl border border-stone-200 px-4 text-stone-800 outline-none transition focus:border-emerald-300 disabled:cursor-not-allowed disabled:bg-stone-100"
          />
        </div>
        <div>
          <label
            htmlFor="profile-email"
            className="mb-2 block text-sm font-medium text-stone-600"
          >
            이메일
          </label>
          <div className="flex gap-2">
            <input
              id="profile-email"
              type="email"
              value={email}
              disabled={isChangingEmail}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 min-w-0 flex-1 rounded-xl border border-stone-200 px-4 text-sm text-stone-800 outline-none transition focus:border-emerald-300 disabled:cursor-not-allowed disabled:bg-stone-100"
            />
            <button
              type="button"
              disabled={
                isChangingEmail ||
                !email.trim() ||
                email.trim().toLowerCase() === initialEmail.toLowerCase()
              }
              onClick={handleChangeEmail}
              className="h-12 shrink-0 rounded-xl border border-stone-200 px-4 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isChangingEmail ? "요청 중..." : "변경"}
            </button>
          </div>

          <p className="mt-2 text-xs text-stone-400">
            테스트 기간에는 이메일이 즉시 변경돼요.
          </p>

          {emailMessage && (
            <p className="mt-2 text-sm font-medium text-emerald-600">
              {emailMessage}
            </p>
          )}
        </div>

        {successMessage && (
          <p className="text-sm font-medium text-emerald-600">
            {successMessage}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            disabled={isSaving || !name.trim() || name.trim() === initialName}
            onClick={handleSaveName}
            className="h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "저장 중..." : "이름 저장"}
          </button>
        </div>
      </div>
    </section>
  );
}
