import type {
  Mission,
  ReceiverBand,
  SoundTestRecord,
  SoundTestSetup,
} from "./types";

const modelLimitNote =
  "이 컴퓨터 모형 안에서만 비교해요. 실제 재료의 성능이나 안전을 뜻하지 않아요.";

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
  comparisonClaim: "이 컴퓨터 모형에서 바꾼 것을 비교한 기록이에요.",
  modelLimitNote,
});

const path = (
  sample: string,
  reduction?: string,
  gap?: boolean,
): string[] => [
  "소리 내는 곳",
  sample,
  ...(reduction ? [reduction] : []),
  ...(gap ? ["열린 틈"] : []),
  "소리 받는 곳",
];

export const soundTestRecords: SoundTestRecord[] = [
  record(
    "weak-a-none-standard",
    { sourceId: "weak", pathSampleId: "sample-a", reductionTreatmentId: "none", placementId: "standard" },
    "low",
    path("재료 모형 A"),
  ),
  record(
    "strong-a-none-standard",
    { sourceId: "strong", pathSampleId: "sample-a", reductionTreatmentId: "none", placementId: "standard" },
    "high",
    path("재료 모형 A"),
  ),
  record(
    "weak-air-none-standard",
    { sourceId: "weak", pathSampleId: "air", reductionTreatmentId: "none", placementId: "standard" },
    "medium",
    path("공기 길"),
  ),
  record(
    "weak-b-none-standard",
    { sourceId: "weak", pathSampleId: "sample-b", reductionTreatmentId: "none", placementId: "standard" },
    "high",
    path("재료 모형 B"),
  ),
  record(
    "strong-b-none-standard",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "none", placementId: "standard" },
    "very-high",
    path("재료 모형 B"),
  ),
  record(
    "strong-b-p-standard",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-p", placementId: "standard" },
    "medium",
    path("재료 모형 B", "덧댄 모형 P"),
  ),
  record(
    "strong-b-q-standard",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-q", placementId: "standard" },
    "low",
    path("재료 모형 B", "덧댄 모형 Q"),
  ),
  record(
    "strong-a-q-open-gap",
    { sourceId: "strong", pathSampleId: "sample-a", reductionTreatmentId: "sample-q", placementId: "open-gap" },
    "medium",
    path("재료 모형 A", "덧댄 모형 Q", true),
    ["edge-gap"],
  ),
  record(
    "strong-a-q-reduced-gap",
    { sourceId: "strong", pathSampleId: "sample-a", reductionTreatmentId: "sample-q", placementId: "reduced-gap" },
    "low",
    path("재료 모형 A", "덧댄 모형 Q"),
  ),
  record(
    "strong-b-none-open-gap",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "none", placementId: "open-gap" },
    "very-high",
    path("재료 모형 B", undefined, true),
    ["edge-gap"],
  ),
  record(
    "strong-b-p-open-gap",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-p", placementId: "open-gap" },
    "high",
    path("재료 모형 B", "덧댄 모형 P", true),
    ["edge-gap"],
  ),
  record(
    "strong-b-q-open-gap",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-q", placementId: "open-gap" },
    "medium",
    path("재료 모형 B", "덧댄 모형 Q", true),
    ["edge-gap"],
  ),
  record(
    "strong-b-p-reduced-gap",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-p", placementId: "reduced-gap" },
    "low",
    path("재료 모형 B", "덧댄 모형 P"),
  ),
  record(
    "strong-b-q-reduced-gap",
    { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-q", placementId: "reduced-gap" },
    "very-low",
    path("재료 모형 B", "덧댄 모형 Q"),
  ),
  record(
    "strong-c-p-open-gap",
    { sourceId: "strong", pathSampleId: "sample-c", reductionTreatmentId: "sample-p", placementId: "open-gap" },
    "medium",
    path("재료 모형 C", "덧댄 모형 P", true),
    ["edge-gap"],
  ),
  record(
    "strong-c-q-open-gap",
    { sourceId: "strong", pathSampleId: "sample-c", reductionTreatmentId: "sample-q", placementId: "open-gap" },
    "low",
    path("재료 모형 C", "덧댄 모형 Q", true),
    ["edge-gap"],
  ),
];

export const setupLabels = {
  sourceId: { weak: "작은 떨림", strong: "큰 떨림" },
  pathSampleId: {
    air: "공기 길",
    "sample-a": "재료 모형 A",
    "sample-b": "재료 모형 B",
    "sample-c": "재료 모형 C",
  },
  reductionTreatmentId: {
    none: "덧댄 모형 없음",
    "sample-p": "덧댄 모형 P",
    "sample-q": "덧댄 모형 Q",
  },
  placementId: {
    standard: "붙여 놓기",
    "open-gap": "틈이 열린 채",
    "reduced-gap": "틈을 줄여 놓기",
  },
} as const;

export const receiverLabels: Record<ReceiverBand, string> = {
  "very-low": "아주 작게 표시됨",
  low: "작게 표시됨",
  medium: "중간으로 표시됨",
  high: "크게 표시됨",
  "very-high": "아주 크게 표시됨",
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
    focus: "높낮이와 길은 그대로 두고, 소리 내는 곳의 떨림만 바꿔요.",
    fixedConditions: ["같은 높낮이", "재료 모형 A", "덧댄 모형 없음", "붙여 놓기"],
    steps: [
      {
        id: "source-strength",
        title: "소리 내는 곳 하나만 바꾸기",
        question: "큰 떨림으로 바꾸면 소리 받는 곳의 크기는 어떻게 될까요?",
        baseline: { sourceId: "weak", pathSampleId: "sample-a", reductionTreatmentId: "none", placementId: "standard" },
        allowedVariable: "sourceId",
        options: [
          { id: "strong-only", label: "큰 떨림으로 바꾸기", description: "소리 내는 곳만 바꿔요.", setup: { sourceId: "strong", pathSampleId: "sample-a", reductionTreatmentId: "none", placementId: "standard" } },
          { id: "two-at-once", label: "큰 떨림과 재료 모형 B 함께 바꾸기", description: "두 가지를 바꾸면 무엇 때문인지 알기 어려워요.", setup: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "none", placementId: "standard" }, teachingTrap: true },
        ],
        evidenceOptions: ["소리 내는 곳의 떨림만 달라졌어요.", "높낮이와 길은 그대로예요."],
      },
    ],
  },
  {
    id: "different-path-samples",
    number: 2,
    title: "여러 물질을 지나가는 길",
    focus: "소리가 공기 길과 여러 재료 모형을 지나 소리 받는 곳에 닿는지 살펴봐요.",
    fixedConditions: ["작은 떨림", "덧댄 모형 없음", "붙여 놓기", "같은 거리"],
    steps: [
      {
        id: "path-sample",
        title: "재료 모형 하나만 바꾸기",
        question: "공기 길에 재료 모형을 놓으면 무엇이 달라질까요?",
        baseline: { sourceId: "weak", pathSampleId: "air", reductionTreatmentId: "none", placementId: "standard" },
        allowedVariable: "pathSampleId",
        options: [
          { id: "path-a", label: "재료 모형 A 놓기", description: "얇고 단단한 판 모형이에요.", setup: { sourceId: "weak", pathSampleId: "sample-a", reductionTreatmentId: "none", placementId: "standard" } },
          { id: "path-b", label: "재료 모형 B 놓기", description: "층이 보이는 판 모형이에요.", setup: { sourceId: "weak", pathSampleId: "sample-b", reductionTreatmentId: "none", placementId: "standard" } },
        ],
        evidenceOptions: ["공기 길과 재료 모형 모두 소리가 지나는 길이 남아 있어요.", "이 모형 결과만으로 실제 재료의 순서를 정할 수 없어요."],
      },
    ],
  },
  {
    id: "reduction-sample-comparison",
    number: 3,
    title: "같은 길에 덧댄 모형 놓기",
    focus: "다른 것은 그대로 두고 덧댄 모형만 바꿔요.",
    fixedConditions: ["큰 떨림", "재료 모형 B", "붙여 놓기", "같은 높낮이"],
    steps: [
      {
        id: "reduction-sample",
        title: "덧댄 모형 하나만 바꾸기",
        question: "덧댄 모형을 놓으면 소리 받는 곳의 크기는 어떻게 될까요?",
        baseline: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "none", placementId: "standard" },
        allowedVariable: "reductionTreatmentId",
        options: [
          { id: "sample-p", label: "덧댄 모형 P 놓기", description: "교차 무늬 모형이에요.", setup: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-p", placementId: "standard" } },
          { id: "sample-q", label: "덧댄 모형 Q 놓기", description: "점 무늬 모형이에요.", setup: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-q", placementId: "standard" } },
        ],
        evidenceOptions: ["덧댄 모형이 소리가 지나는 길에 놓였어요.", "한 모형이 모든 상황에서 늘 제일 좋다고 할 수 없어요."],
      },
    ],
  },
  {
    id: "open-gap-path",
    number: 4,
    title: "열린 틈 살펴보기",
    focus: "재료가 같아도 놓는 자리와 남은 틈을 함께 살펴봐요.",
    fixedConditions: ["큰 떨림", "재료 모형 A", "덧댄 모형 Q", "같은 거리"],
    steps: [
      {
        id: "gap-placement",
        title: "놓는 방법 하나만 바꾸기",
        question: "같은 재료로 열린 틈을 줄이면 무엇이 달라질까요?",
        baseline: { sourceId: "strong", pathSampleId: "sample-a", reductionTreatmentId: "sample-q", placementId: "open-gap" },
        allowedVariable: "placementId",
        options: [
          { id: "reduced-gap", label: "틈을 줄여 놓기", description: "재료는 그대로 두고 놓는 방법만 바꿔요.", setup: { sourceId: "strong", pathSampleId: "sample-a", reductionTreatmentId: "sample-q", placementId: "reduced-gap" } },
        ],
        evidenceOptions: ["열린 틈이 줄었어요.", "가장 작게 표시되어도 소리가 사라졌다는 뜻은 아니에요."],
      },
    ],
  },
  {
    id: "two-step-quiet-room-redesign",
    number: 5,
    title: "조용한 방 다시 만들기",
    focus: "두 번 비교하되, 매번 한 가지만 바꿔요.",
    fixedConditions: ["큰 떨림", "같은 높낮이", "같은 거리", "재료 모형만 사용"],
    steps: [
      {
        id: "redesign-reduction",
        title: "첫 번째 비교: 덧댄 모형 고르기",
        question: "처음에 덧댄 모형 하나를 놓아 볼까요?",
        baseline: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "none", placementId: "open-gap" },
        allowedVariable: "reductionTreatmentId",
        options: [
          { id: "redesign-p", label: "덧댄 모형 P 놓기", description: "틈이 열린 채인 것은 그대로예요.", setup: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-p", placementId: "open-gap" } },
          { id: "redesign-q", label: "덧댄 모형 Q 놓기", description: "틈이 열린 채인 것은 그대로예요.", setup: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-q", placementId: "open-gap" } },
        ],
        evidenceOptions: ["덧댄 모형 하나만 놓았어요.", "열린 틈은 아직 남아 있어요."],
      },
      {
        id: "redesign-gap",
        title: "두 번째 비교: 남은 길 살피기",
        question: "다음에는 놓는 방법이나 재료 모형 중 하나만 바꿔 볼까요?",
        baseline: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-q", placementId: "open-gap" },
        allowedVariable: "placementId",
        options: [
          { id: "redesign-gap-q", label: "틈을 줄여 놓기", description: "앞에서 고른 덧댄 모형은 그대로예요.", setup: { sourceId: "strong", pathSampleId: "sample-b", reductionTreatmentId: "sample-q", placementId: "reduced-gap" } },
          { id: "redesign-path-q", label: "재료 모형 C로 바꾸기", description: "놓는 방법과 덧댄 모형은 그대로예요.", setup: { sourceId: "strong", pathSampleId: "sample-c", reductionTreatmentId: "sample-q", placementId: "open-gap" } },
        ],
        evidenceOptions: ["비교할 때마다 한 가지만 바꿨어요.", "더 작게 표시되어도 실제 안전을 뜻하지 않아요."],
      },
    ],
  },
];

export const updateHistory = [
  {
    date: "2026-08-15",
    title: "초등학생용 쉬운 말과 안내 문장 개선",
    detail: "어려운 과학 말을 익숙한 말로 바꾸고, 미션 질문·단서·기록표를 한 번에 읽기 쉽게 고쳤어요.",
  },
  {
    date: "2026-08-15",
    title: "소리 파동 시각화와 이동 애니메이션 고도화",
    detail: "도착한 소리 크기에 따라 파동 막대 높이와 속도가 달라지고, 시작·연습·결과 화면에서 같은 흐름을 읽도록 개선했어요.",
  },
  {
    date: "2026-07-18",
    title: "초등학생용 단서와 결과 화면 개선",
    detail: "맞는 단서를 모두 고르게 바꾸고, 어려운 말을 줄였으며, 오류 색과 모바일 결과 읽기 순서를 더 분명하게 만들었어요.",
  },
  {
    date: "2026-07-17",
    title: "학생 흐름과 모바일 화면 개선",
    detail: "화면을 옮겨 다니기 쉽도록 순서와 진행 표시, 휴대폰 화면을 고쳤어요.",
  },
  {
    date: "2026-07-17",
    title: "첫 교육용 버전 구현",
    detail: "연습 1개와 5개 미션, 한 가지만 바꾸기, 열린 틈 살피기, 기록하기를 만들었어요.",
  },
  {
    date: "2026-07-17",
    title: "기획 기준 반영",
    detail: "재료 모형과 소리 크기 표시가 실제 측정값이 아니라는 점을 쉽게 적었어요.",
  },
];
