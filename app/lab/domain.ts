import { soundTestRecords } from "./content";
import type {
  Prediction,
  ReceiverBand,
  SoundTestRecord,
  SoundTestSetup,
  VariableKey,
} from "./types";

const variableKeys: VariableKey[] = [
  "sourceId",
  "pathSampleId",
  "reductionTreatmentId",
  "placementId",
];

const variableLabels: Record<VariableKey, string> = {
  sourceId: "소리원 세기",
  pathSampleId: "전달 시료",
  reductionTreatmentId: "줄임 시료",
  placementId: "배치",
};

const bandOrder: ReceiverBand[] = [
  "very-low",
  "low",
  "medium",
  "high",
  "very-high",
];

export function getChangedVariables(
  baseline: SoundTestSetup,
  comparison: SoundTestSetup,
): VariableKey[] {
  return variableKeys.filter((key) => baseline[key] !== comparison[key]);
}

export function guardOneVariableChange(
  baseline: SoundTestSetup,
  comparison: SoundTestSetup,
) {
  const changed = getChangedVariables(baseline, comparison);
  if (changed.length === 0) {
    return {
      valid: false as const,
      changed,
      message: "비교하려면 한 가지를 바꿔요.",
    };
  }
  if (changed.length > 1) {
    return {
      valid: false as const,
      changed,
      message: "무엇 때문에 달라졌는지 알기 어려워요. 하나만 바꿔요.",
    };
  }
  return {
    valid: true as const,
    changed,
    message: `${variableLabels[changed[0]]}만 바뀌었어요.`,
  };
}

export function setupKey(setup: SoundTestSetup) {
  return [
    setup.sourceId,
    setup.pathSampleId,
    setup.reductionTreatmentId,
    setup.placementId,
  ].join("|");
}

const soundTestMap = new Map(
  soundTestRecords.map((item) => [setupKey(item), item]),
);

export function lookupSoundTest(setup: SoundTestSetup): SoundTestRecord {
  const found = soundTestMap.get(setupKey(setup));
  if (!found) {
    throw new Error("허용된 가상 시험 기록이 없어요. 다른 한 가지 조건을 골라 주세요.");
  }
  return found;
}

export function compareReceiverBands(
  baseline: ReceiverBand,
  comparison: ReceiverBand,
): Prediction {
  const difference =
    bandOrder.indexOf(comparison) - bandOrder.indexOf(baseline);
  if (difference < 0) return "lower";
  if (difference > 0) return "higher";
  return "same";
}

export function variableLabel(key: VariableKey) {
  return variableLabels[key];
}
