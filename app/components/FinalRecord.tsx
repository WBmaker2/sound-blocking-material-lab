import { predictionLabels } from "../lab/content";
import type { MissionRecord } from "../lab/types";

type FinalRecordProps = {
  records: MissionRecord[];
  onRepeat: () => void;
  onSafety: () => void;
  onRestart: () => void;
};

export function FinalRecord({ records, onRepeat, onSafety, onRestart }: FinalRecordProps) {
  return (
    <main className="final-screen">
      <div className="section-heading">
        <h1>소리 전달 비교 기록</h1>
        <p>정답 수 대신 한 요소를 통제하고 경로를 확인한 과정을 모았어요.</p>
      </div>

      <div className="final-summary">
        <div><strong>{records.length}</strong><span>완료한 비교</span></div>
        <div><strong>한 요소씩</strong><span>조건을 바꾸었어요</span></div>
        <div><strong>경로 확인</strong><span>남은 길을 근거로 보았어요</span></div>
        <div><strong>모형 한계</strong><span>실제 성능이 아님을 확인했어요</span></div>
      </div>

      <div className="record-table-wrap">
        <table className="record-table">
          <caption>완료한 미션별 비교 기록</caption>
          <thead>
            <tr>
              <th scope="col">미션</th>
              <th scope="col">바꾼 요소</th>
              <th scope="col">예측</th>
              <th scope="col">상대 결과</th>
              <th scope="col">남은 경로</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={`${record.missionId}-${index}`}>
                <th scope="row">{record.missionTitle}</th>
                <td>{record.changedLabel}</td>
                <td>{predictionLabels[record.prediction]}</td>
                <td>{predictionLabels[record.result]}</td>
                <td>{record.remainingPath}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <aside className="model-note">
        이 가상 시험에서는 소리 전달이 줄었지만 완전한 무음이나 실제 안전을 뜻하지 않아요.
      </aside>
      <div className="final-actions">
        <button className="primary-button" type="button" onClick={onRepeat}>같은 연구 다시 하기</button>
        <button className="secondary-button" type="button" onClick={onSafety}>모형 다시 보기</button>
        <button className="text-button" type="button" onClick={onRestart}>처음으로</button>
      </div>
    </main>
  );
}
