import { describe, expect, it } from "vitest";
import {
  compareReceiverBands,
  getChangedVariables,
  guardOneVariableChange,
  lookupSoundTest,
} from "../app/lab/domain";
import { missions } from "../app/lab/content";
import { resolveMissionStep } from "../app/components/SoundLabApp";

const baseline = {
  sourceId: "weak",
  pathSampleId: "sample-a",
  reductionTreatmentId: "none",
  placementId: "standard",
} as const;

describe("한 변인 통제", () => {
  it("바뀐 요소 하나의 이름을 돌려준다", () => {
    const comparison = { ...baseline, sourceId: "strong" as const };

    expect(getChangedVariables(baseline, comparison)).toEqual(["sourceId"]);
    expect(guardOneVariableChange(baseline, comparison)).toEqual({
      valid: true,
      changed: ["sourceId"],
      message: "소리원 세기만 바뀌었어요.",
    });
  });

  it("같은 설정은 비교를 막는다", () => {
    expect(guardOneVariableChange(baseline, baseline)).toMatchObject({
      valid: false,
      changed: [],
      message: "비교하려면 한 가지를 바꿔요.",
    });
  });

  it("두 요소가 바뀌면 결과 공개를 막는다", () => {
    const comparison = {
      ...baseline,
      sourceId: "strong" as const,
      pathSampleId: "sample-b" as const,
    };

    expect(guardOneVariableChange(baseline, comparison)).toMatchObject({
      valid: false,
      changed: ["sourceId", "pathSampleId"],
      message: "무엇 때문에 달라졌는지 알기 어려워요. 하나만 바꿔요.",
    });
  });
});

describe("검수된 가상 시험 조회", () => {
  it("허용 조합의 경로와 상대 감지 단계를 그대로 돌려준다", () => {
    const record = lookupSoundTest(baseline);

    expect(record.receiverBand).toBe("low");
    expect(record.activePathSegments).toEqual([
      "떨리는 소리원",
      "전달 시료 A",
      "가상 수신기",
    ]);
    expect(record.modelLimitNote).toContain("가상 시험");
  });

  it("허용되지 않은 조합을 계산으로 추정하지 않는다", () => {
    expect(() =>
      lookupSoundTest({
        sourceId: "weak",
        pathSampleId: "sample-c",
        reductionTreatmentId: "sample-p",
        placementId: "reduced-gap",
      }),
    ).toThrowError(/허용된 가상 시험 기록이 없어요/);
  });

  it("상대 단계는 낮아짐·같음·높아짐으로만 비교한다", () => {
    expect(compareReceiverBands("high", "low")).toBe("lower");
    expect(compareReceiverBands("low", "low")).toBe("same");
    expect(compareReceiverBands("low", "high")).toBe("higher");
  });
});

describe("재설계 비교", () => {
  it("앞 비교를 기준으로 틈 또는 경로 중 하나만 바꾸게 만든다", () => {
    const previousSetup = {
      sourceId: "strong",
      pathSampleId: "sample-b",
      reductionTreatmentId: "sample-p",
      placementId: "open-gap",
    } as const;
    const step = resolveMissionStep(missions[4].steps[1], previousSetup);
    const gapOption = step.options.find((option) => option.id.includes("gap"));
    const pathOption = step.options.find((option) => option.id.includes("path"));

    expect(getChangedVariables(previousSetup, gapOption!.setup)).toEqual(["placementId"]);
    expect(getChangedVariables(previousSetup, pathOption!.setup)).toEqual(["pathSampleId"]);
  });
});
