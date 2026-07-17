import { setupLabels } from "../lab/content";
import { getChangedVariables } from "../lab/domain";
import type { SoundTestSetup } from "../lab/types";

const rows = [
  ["sourceId", "소리원"],
  ["pathSampleId", "전달 시료"],
  ["reductionTreatmentId", "줄임 시료"],
  ["placementId", "배치"],
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
        <caption>기준 조건과 비교 조건</caption>
        <thead>
          <tr>
            <th scope="col">조건</th>
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
