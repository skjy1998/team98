import type { TeamMemberRole } from "@/types/player";

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
    <section className="rounded-xl border border-stone-200 p-3.5 sm:p-5">
      <div className="mb-3 sm:mb-4">
        <p className="text-xs font-semibold text-emerald-600 sm:text-sm">
          04 서비스 권한
        </p>
        <p className="mt-1 text-xs leading-5 text-stone-400 sm:text-sm">
          서비스 접근 권한을 설정해요. 회장과 운영진만 선수/일정/회비를 관리할
          수 있어요.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
        {permissionOptions.map((option) => {
          const isActive = role === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChangeRole(option.value)}
              className={[
                "flex h-11 items-center justify-center gap-1.5 rounded-xl border text-xs font-semibold transition sm:h-14 sm:gap-2 sm:text-sm",
                isActive
                  ? option.activeClassName
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50",
              ].join(" ")}
            >
              <span
                className={`h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5 ${option.dotClassName}`}
              />
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
