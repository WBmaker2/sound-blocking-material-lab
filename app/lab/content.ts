import type {
  Mission,
  ReceiverBand,
  SoundTestRecord,
  SoundTestSetup,
} from "./types";

const modelLimitNote =
  "이 가상 시험 안에서만 비교해요. 실제 재료의 성능이나 안전을 뜻하지 않아요.";

const record = (
  id: string,
  setup: SoundTestSetup,
  receiverBand: ReceiverBand,
  activePathSegments: string[],
  openGapIds: string[] = [],
): SoundTestRecord => ({
  id,
  ...setup,
  activePathSegments,
  openGapIds,
  receiverBand,
  comparisonClaim: "이 가상 시험에서 조건을 비교한 기록이에요.",
  modelLimitNote,
});

const path = (
  sample: string,
  reduction?: string,
  gap?: boolean,
): string[] => [
  "떨리는 소리원",
  sample,
  ...(reduction ? [reduction] : []),
  ...(gap ? ["열린 틈 경로"] : []),
  "가상 수신기",
];

export const soundTestRecords: SoundTestRecord[] = [
  record(
    "weak-a-none-standard",
    { sourceId: "weak", pathSampleId: "sample-a", reductionTreatmentId: "none", placementId: "standard" },
    "low",
    path("전달 시료 A"),
  ),
  record(
    "strong-a-none-standard",
    { sourceId: "strong", pathSampleId: "sample-a", reductionTreatmentId: "none", placementId: "standard" },
    "high",
    path("전달 시료 A"),
  ),
  record(
    "weak-air-none-standard",
    { sourceId: "weak", pathSampleId: "air", reductionTreatmentId: "none", placementId: "standard" },
    "medium",
    path("공기 통로"),
  ),
  record(
    "weak-b-none-standard",
    { sourceId: "weak", pathSampleId: "sample-b", reductionTreatmentId: "none", placementId: "standard" },
    "high",
    path("전달 시료 B"),
  ),
  record(
    "strong-b-none-standard",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "none", placementId: "standard" },
    "very-high",
    path("전달 시료 B"),
  ),
  record(
    "strong-b-p-standard",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-p", placementId: "standard" },
    "medium",
    path("전달 시료 B", "줄임 시료 P"),
  ),
  record(
    "strong-b-q-standard",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-q", placementId: "standard" },
    "low",
    path("전달 시료 B", "줄임 시료 Q"),
  ),
  record(
    "strong-a-q-open-gap",
    { sourceId: "strong", pathSampleId: "sample-a", reductionTreatmentId: "sample-q", placementId: "open-gap" },
    "medium",
    path("전달 시료 A", "줄임 시료 Q", true),
    ["edge-gap"],
  ),
  record(
    "strong-a-q-reduced-gap",
    { sourceId: "strong", pathSampleId: "sample-a", reductionTreatmentId: "sample-q", placementId: "reduced-gap" },
    "low",
    path("전달 시료 A", "줄임 시료 Q"),
  ),
  record(
    "strong-b-none-open-gap",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "none", placementId: "open-gap" },
    "very-high",
    path("전달 시료 B", undefined, true),
    ["edge-gap"],
  ),
  record(
    "strong-b-p-open-gap",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-p", placementId: "open-gap" },
    "high",
    path("전달 시료 B", "줄임 시료 P", true),
    ["edge-gap"],
  ),
  record(
    "strong-b-q-open-gap",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-q", placementId: "open-gap" },
    "medium",
    path("전달 시료 B", "줄임 시료 Q", true),
    ["edge-gap"],
  ),
  record(
    "strong-b-p-reduced-gap",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-p", placementId: "reduced-gap" },
    "low",
    path("전달 시료 B", "줄임 시료 P"),
  ),
  record(
    "strong-b-q-reduced-gap",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-q", placementId: "reduced-gap" },
    "very-low",
    path("전달 시료 B", "줄임 시료 Q"),
  ),
  record(
    "strong-c-p-open-gap",
    { sourceId: "strong", pathSampleId: "sample-c", reductionTreatmentId: "sample-p", placementId: "open-gap" },
    "medium",
    path("전달 시료 C", "줄임 시료 P", true),
    ["edge-gap"],
  ),
  record(
    "strong-c-q-open-gap",
    { sourceId: "strong", pathSampleId: "sample-c", reductionTreatmentId: "sample-q", placementId: "open-gap" },
    "low",
    path("전달 시료 C", "줄임 시료 Q", true),
    ["edge-gap"],
  ),
];

export const setupLabels = {
  sourceId: { weak: "약한 떨림", strong: "강한 떨림" },
  pathSampleId: {
    air: "공기 통로",
    "sample-a": "전달 시료 A",
    "sample-b": "전달 시료 B",
    "sample-c": "전달 시료 C",
  },
  reductionTreatmentId: {
    none: "줄임 시료 없음",
    "sample-p": "줄임 시료 P",
    "sample-q": "줄임 시료 Q",
  },
  placementId: {
    standard: "고정 배치",
    "open-gap": "열린 틈 배치",
    "reduced-gap": "틈을 줄인 배치",
  },
} as const;

export const receiverLabels: Record<ReceiverBand, string> = {
  "very-low": "매우 작게 전달됨",
  low: "작게 전달됨",
  medium: "가운데 정도로 전달됨",
  high: "크게 전달됨",
  "very-high": "매우 크게 전달됨",
};

export const predictionLabels = {
  lower: "낮아짐",
  same: "같음",
  higher: "높아짐",
} as const;

export const missions: Mission[] = [
  {
    id: "source-strength-one-variable",
    number: 1,
    title: "같은 길, 다른 떨림",
    focus: "같은 높낮이와 경로에서 소리원 떨림 세기만 비교해요.",
    fixedConditions: ["같은 높낮이", "전달 시료 A", "줄임 시료 없음", "고정 배치"],
    steps: [
      {
        id: "source-strength",
        title: "소리원 하나만 바꾸기",
        question: "강한 떨림으로 바꾸면 상대 감지 단계는 어떻게 될까요?",
        baseline: { sourceId: "weak", pathSampleId: "sample-a", reductionTreatmentId: "none", placementId: "standard" },
        allowedVariable: "sourceId",
        options: [
          { id: "strong-only", label: "강한 떨림으로 바꾸기", description: "소리원 세기만 바꿔요.", setup: { sourceId: "strong", pathSampleId: "sample-a", reductionTreatmentId: "none", placementId: "standard" } },
          { id: "two-at-once", label: "강한 떨림과 시료 B 함께 바꾸기", description: "두 요소가 함께 바뀌는지 확인해 보세요.", setup: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "none", placementId: "standard" }, teachingTrap: true },
        ],
        evidenceOptions: ["소리원 떨림 세기만 달라졌어요.", "높낮이와 경로는 그대로예요."],
      },
    ],
  },
  {
    id: "different-path-samples",
    number: 2,
    title: "여러 물질을 지나가는 길",
    focus: "소리가 공기와 여러 가상 시료를 지나 수신기에 닿는지 살펴봐요.",
    fixedConditions: ["약한 떨림", "줄임 시료 없음", "고정 배치", "같은 거리"],
    steps: [
      {
        id: "path-sample",
        title: "전달 시료 하나만 바꾸기",
        question: "공기 통로 대신 가상 시료를 놓으면 어떻게 달라질까요?",
        baseline: { sourceId: "weak", pathSampleId: "air", reductionTreatmentId: "none", placementId: "standard" },
        allowedVariable: "pathSampleId",
        options: [
          { id: "path-a", label: "전달 시료 A 놓기", description: "얇고 단단한 판 모형이에요.", setup: { sourceId: "weak", pathSampleId: "sample-a", reductionTreatmentId: "none", placementId: "standard" } },
          { id: "path-b", label: "전달 시료 B 놓기", description: "층이 보이는 판 모형이에요.", setup: { sourceId: "weak", pathSampleId: "sample-b", reductionTreatmentId: "none", placementId: "standard" } },
        ],
        evidenceOptions: ["공기와 가상 시료 모두 전달 경로가 남아 있어요.", "이 시험 결과를 모든 실제 재료의 순위로 정할 수 없어요."],
      },
    ],
  },
  {
    id: "reduction-sample-comparison",
    number: 3,
    title: "같은 길에 줄임 시료 덧대기",
    focus: "다른 조건은 고정하고 줄임 시료만 바꿔요.",
    fixedConditions: ["강한 떨림", "전달 시료 B", "고정 배치", "같은 높낮이"],
    steps: [
      {
        id: "reduction-sample",
        title: "줄임 시료 하나만 바꾸기",
        question: "줄임 시료를 덧대면 상대 감지 단계는 어떻게 될까요?",
        baseline: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "none", placementId: "standard" },
        allowedVariable: "reductionTreatmentId",
        options: [
          { id: "sample-p", label: "줄임 시료 P 덧대기", description: "교차 무늬 시료예요.", setup: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-p", placementId: "standard" } },
          { id: "sample-q", label: "줄임 시료 Q 덧대기", description: "점 무늬 시료예요.", setup: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-q", placementId: "standard" } },
        ],
        evidenceOptions: ["줄임 시료가 전달 경로에 놓였어요.", "한 시료가 모든 상황에서 늘 좋다고 정할 수 없어요."],
      },
    ],
  },
  {
    id: "open-gap-path",
    number: 4,
    title: "열린 틈 경보",
    focus: "재료가 같아도 놓인 위치와 남은 틈을 함께 살펴봐요.",
    fixedConditions: ["강한 떨림", "전달 시료 A", "줄임 시료 Q", "같은 거리"],
    steps: [
      {
        id: "gap-placement",
        title: "배치 하나만 바꾸기",
        question: "같은 재료로 열린 틈을 줄이면 어떻게 달라질까요?",
        baseline: { sourceId: "strong", pathSampleId: "sample-a", reductionTreatmentId: "sample-q", placementId: "open-gap" },
        allowedVariable: "placementId",
        options: [
          { id: "reduced-gap", label: "틈을 줄인 배치로 바꾸기", description: "재료는 그대로 두고 놓인 위치만 바꿔요.", setup: { sourceId: "strong", pathSampleId: "sample-a", reductionTreatmentId: "sample-q", placementId: "reduced-gap" } },
        ],
        evidenceOptions: ["열린 틈 경로가 줄었어요.", "가장 낮은 표시도 소리가 사라졌다는 뜻은 아니에요."],
      },
    ],
  },
  {
    id: "two-step-quiet-room-redesign",
    number: 5,
    title: "조용한 관찰실 재설계",
    focus: "두 번 비교하되, 매번 한 요소만 바꿔요.",
    fixedConditions: ["강한 떨림", "같은 높낮이", "같은 거리", "가상 시료만 사용"],
    steps: [
      {
        id: "redesign-reduction",
        title: "1차 비교: 줄임 시료 선택",
        question: "첫 번째로 줄임 시료 하나를 더해 볼까요?",
        baseline: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "none", placementId: "open-gap" },
        allowedVariable: "reductionTreatmentId",
        options: [
          { id: "redesign-p", label: "줄임 시료 P 더하기", description: "열린 틈 배치는 유지해요.", setup: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-p", placementId: "open-gap" } },
          { id: "redesign-q", label: "줄임 시료 Q 더하기", description: "열린 틈 배치는 유지해요.", setup: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-q", placementId: "open-gap" } },
        ],
        evidenceOptions: ["줄임 시료 하나만 더했어요.", "열린 틈 경로는 아직 남아 있어요."],
      },
      {
        id: "redesign-gap",
        title: "2차 비교: 남은 경로 살피기",
        question: "두 번째로 배치 또는 전달 시료 하나만 바꿔 볼까요?",
        baseline: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-q", placementId: "open-gap" },
        allowedVariable: "placementId",
        options: [
          { id: "redesign-gap-q", label: "틈을 줄인 배치로 바꾸기", description: "앞에서 고른 줄임 시료를 유지해요.", setup: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-q", placementId: "reduced-gap" } },
          { id: "redesign-path-q", label: "전달 시료 C로 바꾸기", description: "배치와 줄임 시료는 유지해요.", setup: { sourceId: "strong", pathSampleId: "sample-c", reductionTreatmentId: "sample-q", placementId: "open-gap" } },
        ],
        evidenceOptions: ["비교할 때마다 한 요소만 바꿨어요.", "더 작게 표시되어도 실제 안전을 뜻하지 않아요."],
      },
    ],
  },
];

export const updateHistory = [
  {
    date: "2026-07-17",
    title: "첫 교육용 버전 구현",
    detail: "안내 활동과 5개 미션, 한 변인 비교, 열린 틈 확인, 비교 기록을 만들었어요.",
  },
  {
    date: "2026-07-17",
    title: "기획 기준 반영",
    detail: "가상 시료와 상대 감지 단계의 한계를 학생용 문장으로 정리했어요.",
  },
];
