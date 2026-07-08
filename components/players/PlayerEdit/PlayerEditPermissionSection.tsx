type TeamMemberRole = "owner" | "staff" | "member";

interface PlayerEditPermissionSectionProps {
  role: TeamMemberRole;
  onChangeRole: (value: TeamMemberRole) => void;
}

const permissionOptions: {
  value: TeamMemberRole;
  label: string;
  dotClassName: string;
  activeClassName: string;
}[] = [
  {
    value: "owner",
    label: "회장",
    dotClassName: "bg-rose-400",
    activeClassName: "border-rose-300 bg-rose-50 text-rose-700",
  },
  {
    value: "staff",
    label: "운영진",
    dotClassName: "bg-sky-400",
    activeClassName: "border-sky-300 bg-sky-50 text-sky-700",
  },
  {
    value: "member",
    label: "일반 회원",
    dotClassName: "bg-stone-400",
    activeClassName: "border-stone-300 bg-stone-100 text-stone-800",
  },
];

export default function PlayerEditPermissionSection({
  role,
  onChangeRole,
}: Readonly<PlayerEditPermissionSectionProps>) {
  return (
    <section className="rounded-xl border border-stone-200 p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-emerald-600">04 서비스 권한</p>
        <p className="mt-1 text-sm text-stone-400">
          팀 관리 권한을 설정할 수 있어요.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {permissionOptions.map((option) => {
          const isActive = role === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChangeRole(option.value)}
              className={[
                "flex h-14 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition",
                isActive
                  ? option.activeClassName
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50",
              ].join(" ")}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${option.dotClassName}`}
              />
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
