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
  isSaving: boolean;
  isDeleting: boolean;
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

  const isBusy =
    props.saveMode === "manual"
      ? props.isSaving || props.isDeleting
      : Boolean(props.playerCountState?.isSaving);
  const canEdit = canManage && !isBusy;

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3.5 sm:p-5">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div
          className={
            props.saveMode === "manual"
              ? "grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2 lg:flex lg:items-end lg:justify-between lg:gap-3"
              : "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"
          }
        >
          <div
            className={[
              "gap-3",
              props.saveMode === "auto" && props.playerCountState
                ? "grid grid-cols-2"
                : "flex flex-col",
              "lg:flex lg:flex-1",
            ].join(" ")}
          >
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
              canManage={canEdit}
            />
          </div>

          <div
            className={[
              "flex shrink-0 items-center justify-end gap-2",
              props.saveMode === "auto"
                ? "border-t border-stone-100 pt-3 lg:border-t-0 lg:pt-0"
                : "",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={onReset}
              disabled={!canEdit}
              aria-label="포메이션 초기화"
              className={`inline-flex h-12 w-12 items-center justify-center rounded-lg border text-xs font-medium transition sm:h-14 sm:w-auto sm:gap-2 sm:rounded-xl sm:px-5 sm:text-sm ${
                canEdit
                  ? "border-stone-200 text-stone-600 hover:bg-stone-50"
                  : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
              }`}
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">초기화</span>
            </button>

            {props.saveMode === "auto" && (
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-xs font-medium text-emerald-700 sm:w-auto sm:gap-2 sm:rounded-xl sm:px-5 sm:text-sm">
                <Save aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">자동 저장됨</span>
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
            isSaving={props.isSaving}
            isDeleting={props.isDeleting}
          />
        )}
      </div>
    </div>
  );
}
