import type { MatchPlayersPerSide } from "@/types/match";
import type { FormationName } from "@/types/tactics";
import { formationTemplate } from "@/data/formationTemplates";
import { RotateCcw, Save } from "lucide-react";
import TacticsPresetControls from "./TacticsPresetControls";
import TacticsPlayerCountSelect from "./TacticsPlayerCountSelect";
import TacticsFormationSelect from "./TacticsFormationSelect";

interface TacticsToolbarBaseProps {
  formation: FormationName;
  formationOptions?: FormationName[];
  onChangeFormation: (value: FormationName) => void;
  onReset: () => void;
  canManage: boolean;
}

interface ManualTacticsToolbarProps extends TacticsToolbarBaseProps {
  saveMode: "manual";
  presetName: string;
  onChangePresetName: (value: string) => void;
  savedPresets: { id: string; name: string }[];
  selectedPresetId: string;
  onLoadPreset: (presetId: string) => void;
  onSave: () => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}

interface AutoTacticsToolbarProps extends TacticsToolbarBaseProps {
  saveMode: "auto";
  playerCountState?: {
    options: readonly MatchPlayersPerSide[];
    value: MatchPlayersPerSide;
    onChange: (value: MatchPlayersPerSide) => void;
    isSaving?: boolean;
  };
}

type TacticsToolbarProps = ManualTacticsToolbarProps | AutoTacticsToolbarProps;

export default function TacticsToolbar(props: Readonly<TacticsToolbarProps>) {
  const { formation, formationOptions, onChangeFormation, onReset, canManage } =
    props;

  const availableFormationOptions =
    formationOptions ?? (Object.keys(formationTemplate) as FormationName[]);

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 md:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          {props.saveMode === "auto" && props.playerCountState && (
            <TacticsPlayerCountSelect
              options={props.playerCountState.options}
              value={props.playerCountState.value}
              onChange={props.playerCountState.onChange}
              isSaving={props.playerCountState.isSaving}
              canManage={canManage}
            />
          )}
          <TacticsFormationSelect
            formation={formation}
            options={availableFormationOptions}
            onChange={onChangeFormation}
            canManage={canManage}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              disabled={!canManage}
              className={`inline-flex h-14 items-center gap-2 rounded-xl border px-5 text-sm font-medium transition ${
                canManage
                  ? "border-stone-200 text-stone-600 hover:bg-stone-50"
                  : "border-stone-200 bg-stone-100 text-stone-400"
              }`}
            >
              <RotateCcw className="h-4 w-4" />
              초기화
            </button>

            {props.saveMode === "auto" && (
              <div className="inline-flex h-14 items-center gap-2 rounded-xl bg-emerald-50 px-5 text-sm font-medium text-emerald-700">
                <Save className="h-4 w-4" />
                자동 저장됨
              </div>
            )}
          </div>
        </div>

        {props.saveMode === "manual" && (
          <TacticsPresetControls
            presetName={props.presetName}
            onChangePresetName={props.onChangePresetName}
            savedPresets={props.savedPresets}
            selectedPresetId={props.selectedPresetId}
            onLoadPreset={props.onLoadPreset}
            onSave={props.onSave}
            onDelete={props.onDelete}
            canManage={canManage}
          />
        )}
      </div>
    </div>
  );
}
