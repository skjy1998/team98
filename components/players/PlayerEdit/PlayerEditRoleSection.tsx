import type { PlayerRole } from "@/types/player";

interface PlayerEditRoleSectionProps {
  role: PlayerRole;
  onChangeRole: (value: PlayerRole) => void;
}

const roleOptions: {
  value: PlayerRole;
  label: string;
  dotClassName: string;
  activeClassName: string;
}[] = [
  {
    value: "captain",
    label: "주장",
    dotClassName: "bg-emerald-400",
    activeClassName: "border-emerald-300 bg-emerald-50 text-emerald-700",
  },
  {
    value: "viceCaptain",
    label: "부주장",
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

export default function PlayerEditRoleSection({
  role,
  onChangeRole,
}: Readonly<PlayerEditRoleSectionProps>) {
  return (
    <section className="rounded-xl border border-stone-200 p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-emerald-600">03 팀 역할</p>
        <p className="mt-1 text-sm text-stone-400">
          주장은 한 명만 지정할 수 있어요.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {roleOptions.map((option) => {
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
