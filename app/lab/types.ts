export type SourceId = "weak" | "strong";
export type PathSampleId = "air" | "sample-a" | "sample-b" | "sample-c";
export type ReductionTreatmentId = "none" | "sample-p" | "sample-q";
export type PlacementId = "standard" | "open-gap" | "reduced-gap";

export type ReceiverBand =
  | "very-low"
  | "low"
  | "medium"
  | "high"
  | "very-high";

export type Prediction = "lower" | "same" | "higher";
export type VariableKey = keyof SoundTestSetup;

export type SoundTestSetup = {
  sourceId: SourceId;
  pathSampleId: PathSampleId;
  reductionTreatmentId: ReductionTreatmentId;
  placementId: PlacementId;
};

export type SoundTestRecord = SoundTestSetup & {
  id: string;
  activePathSegments: string[];
  openGapIds: string[];
  receiverBand: ReceiverBand;
  comparisonClaim: string;
  modelLimitNote: string;
};

export type StepOption = {
  id: string;
  label: string;
  description: string;
  setup: SoundTestSetup;
  teachingTrap?: boolean;
};

export type MissionStep = {
  id: string;
  title: string;
  question: string;
  baseline: SoundTestSetup;
  allowedVariable: VariableKey;
  options: StepOption[];
  evidenceOptions: string[];
};

export type Mission = {
  id: string;
  number: number;
  title: string;
  focus: string;
  fixedConditions: string[];
  steps: MissionStep[];
};

export type MissionRecord = {
  missionId: string;
  missionTitle: string;
  changedLabel: string;
  prediction: Prediction;
  result: Prediction;
  remainingPath: string;
  modelLimitChecked: boolean;
};
