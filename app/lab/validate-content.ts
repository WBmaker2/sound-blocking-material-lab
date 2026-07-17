import { missions, soundTestRecords } from "./content";
import { getChangedVariables } from "./domain";

export function validateLearningContent(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const record of soundTestRecords) {
    if (ids.has(record.id)) errors.push(`중복 기록 ID: ${record.id}`);
    ids.add(record.id);
    if (record.activePathSegments.length === 0) {
      errors.push(`활성 경로 없음: ${record.id}`);
    }
    if (record.openGapIds.length > 0 && !record.activePathSegments.includes("열린 틈 경로")) {
      errors.push(`열린 틈 경로 설명 누락: ${record.id}`);
    }
  }

  for (const mission of missions) {
    for (const step of mission.steps) {
      for (const option of step.options.filter((item) => !item.teachingTrap)) {
        if (getChangedVariables(step.baseline, option.setup).length !== 1) {
          errors.push(`한 변인 비교 아님: ${mission.id}/${option.id}`);
        }
      }
    }
  }

  const studentContent = JSON.stringify({ missions, soundTestRecords });
  const forbiddenPatterns = [
    /\bdB\b/i,
    /\d+\s*데시벨/,
    /완전 차단/,
    /안전 보장/,
    /제품 등급/,
    /실제 브랜드/,
  ];
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(studentContent)) {
      errors.push(`금지 표현 발견: ${pattern.source}`);
    }
  }

  return errors;
}
