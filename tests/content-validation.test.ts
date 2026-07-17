import { describe, expect, it } from "vitest";
import { missions, soundTestRecords } from "../app/lab/content";
import { getChangedVariables } from "../app/lab/domain";
import { validateLearningContent } from "../app/lab/validate-content";

describe("학습 콘텐츠 불변 조건", () => {
  it("안내 1개와 고정 미션 5개를 제공한다", () => {
    expect(missions).toHaveLength(5);
    expect(missions.map((mission) => mission.id)).toEqual([
      "source-strength-one-variable",
      "different-path-samples",
      "reduction-sample-comparison",
      "open-gap-path",
      "two-step-quiet-room-redesign",
    ]);
  });

  it("모든 일반 비교 선택지는 정확히 한 요소만 바뀐다", () => {
    for (const mission of missions) {
      for (const step of mission.steps) {
        for (const option of step.options.filter((item) => !item.teachingTrap)) {
          expect(getChangedVariables(step.baseline, option.setup)).toHaveLength(1);
        }
      }
    }
  });

  it("모든 기록은 활성 경로와 상대 단계를 가진다", () => {
    for (const record of soundTestRecords) {
      expect(record.activePathSegments.length).toBeGreaterThan(0);
      expect(record.receiverBand).toMatch(
        /^(very-low|low|medium|high|very-high)$/,
      );
    }
  });

  it("학생 콘텐츠에는 수치 성능·실제 제품·완전 차단 주장이 없다", () => {
    expect(validateLearningContent()).toEqual([]);
  });
});
