import { setupLabels } from "../lab/content";
import { getChangedVariables } from "../lab/domain";
import type { SoundTestSetup } from "../lab/types";

const rows = [
  ["sourceId", "소리 내는 곳"],
  ["pathSampleId", "재료 모형"],
  ["reductionTreatmentId", "덧댄 모형"],
  ["placementId", "놓는 방법"],
] as const;

export function SetupComparison({
  baseline,
  comparison,
  invalid = false,
}: {
  baseline: SoundTestSetup;
  comparison?: SoundTestSetup;
  invalid?: boolean;
}) {
  const changed = comparison ? getChangedVariables(baseline, comparison) : [];
  return (
    <div className={invalid ? "setup-table-wrap invalid-comparison" : "setup-table-wrap"}>
      <table className="setup-table">
        <caption>그대로 둔 것과 바꾼 것</caption>
        <thead>
          <tr>
            <th scope="col">항목</th>
            <th scope="col">기준</th>
            <th scope="col">비교</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([key, label]) => {
            const changedHere = changed.includes(key);
            return (
              <tr className={changedHere ? "changed-row" : ""} key={key}>
                <th scope="row">{label}</th>
                <td>{setupLabels[key][baseline[key] as never]}</td>
                <td>
                  {comparison ? setupLabels[key][comparison[key] as never] : "선택 전"}
                  {changedHere && <span className="changed-label">바뀜</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
