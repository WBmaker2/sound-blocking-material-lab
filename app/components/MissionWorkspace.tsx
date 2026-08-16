import { receiverLabels, sizeChangeLabels } from "../lab/content";
import { variableLabel } from "../lab/domain";
import type {
  Mission,
  MissionStep,
  Prediction,
  SoundTestRecord,
  StepOption,
  VariableKey,
} from "../lab/types";
import { ReceiverMeter, SoundPathDiagram } from "./SoundPathDiagram";
import { SetupComparison } from "./SetupComparison";

export type MissionStage = "setup" | "prediction" | "reveal" | "evidence";

type MissionWorkspaceProps = {
  mission: Mission;
  step: MissionStep;
  stage: MissionStage;
  selectedOption?: StepOption;
  guardMessage: string;
  changedCount: number;
  canContinueSetup: boolean;
  prediction?: Prediction;
  selectedEvidence: string[];
  evidenceComplete: boolean;
  limitChecked: boolean;
  baselineRecord?: SoundTestRecord;
  comparisonRecord?: SoundTestRecord;
  result?: Prediction;
  changedVariable?: VariableKey;
  onSelectOption: (id: string) => void;
  onContinueSetup: () => void;
  onPrediction: (prediction: Prediction) => void;
  onReveal: () => void;
  onOpenEvidence: () => void;
  onEvidence: (evidence: string) => void;
  onLimitChecked: (checked: boolean) => void;
  onComplete: () => void;
  completeLabel: string;
};

export function MissionWorkspace(props: MissionWorkspaceProps) {
  const {
    mission,
    step,
    stage,
    selectedOption,
    guardMessage,
    changedCount,
    canContinueSetup,
    prediction,
    selectedEvidence,
    evidenceComplete,
    limitChecked,
    baselineRecord,
    comparisonRecord,
    result,
    changedVariable,
  } = props;

  return (
    <main className="mission-screen">
      <section className="mission-intro">
        <div>
          <span className="mission-number" aria-hidden="true">{mission.number}</span>
          <div>
            <h1>{mission.title}</h1>
            <p>{mission.focus}</p>
          </div>
        </div>
        <div className="fixed-condition-list" aria-label="그대로 둘 것">
          <strong>그대로 둘 것</strong>
          <ul>{mission.fixedConditions.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      {stage === "setup" && (
        <section className="workspace-grid setup-stage" aria-labelledby="step-title">
          <div className="choice-panel">
            <p className="step-label">{step.title}</p>
            <h2 id="step-title">{step.question}</h2>
            <fieldset className="option-list">
              <legend>바꿀 것 고르기</legend>
              {step.options.map((option) => {
                const isSelected = selectedOption?.id === option.id;
                const className = isSelected
                  ? `option-card selected${canContinueSetup ? "" : " error"}`
                  : "option-card";
                return (
                  <label className={className} key={option.id}>
                    <input
                      type="radio"
                      name="comparison-option"
                      value={option.id}
                      checked={selectedOption?.id === option.id}
                      onChange={() => props.onSelectOption(option.id)}
                    />
                    <span>
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </span>
                  </label>
                );
              })}
            </fieldset>
            {selectedOption && (
              <p className={canContinueSetup ? "guard-message valid" : "guard-message error"} aria-live="polite">
                {changedCount > 1 ? (
                  <>
                    <strong>지금은 {changedCount}가지가 바뀌었어요.</strong>
                    <span>{guardMessage}</span>
                  </>
                ) : guardMessage}
              </p>
            )}
            <button className="primary-button gi-pulse" type="button" disabled={!canContinueSetup} onClick={props.onContinueSetup}>
              먼저 생각하기
            </button>
          </div>
          <SetupComparison
            baseline={step.baseline}
            comparison={selectedOption?.setup}
            invalid={Boolean(selectedOption && !canContinueSetup)}
          />
        </section>
      )}

      {stage === "prediction" && selectedOption && (
        <section className="prediction-stage" aria-labelledby="prediction-title">
          <SetupComparison baseline={step.baseline} comparison={selectedOption.setup} />
          <div className="prediction-panel">
            <p className="step-label">결과를 보기 전 먼저 생각하기</p>
            <h2 id="prediction-title">소리 받는 곳의 크기 표시는 어떻게 될까요?</h2>
            <fieldset className="prediction-options">
              <legend>소리 크기 표시의 변화 고르기</legend>
              {(["lower", "same", "higher"] as Prediction[]).map((item) => (
                <label className={prediction === item ? "prediction-card selected" : "prediction-card"} key={item}>
                  <input
                    type="radio"
                    name="prediction"
                    aria-label={sizeChangeLabels[item]}
                    checked={prediction === item}
                    onChange={() => props.onPrediction(item)}
                  />
                  <strong>{sizeChangeLabels[item]}</strong>
                  <small>{item === "lower" ? "소리 크기 표시가 더 작을 것 같아요" : item === "higher" ? "소리 크기 표시가 더 클 것 같아요" : "소리 크기 표시가 비슷할 것 같아요"}</small>
                </label>
              ))}
            </fieldset>
            <p className="neutral-note">먼저 생각한 답은 점수가 아니에요. 결과와 비교해 봐요.</p>
            <button className="primary-button gi-pulse" type="button" disabled={!prediction} onClick={props.onReveal}>
              모형 실험 보기
            </button>
          </div>
        </section>
      )}

      {stage === "reveal" && selectedOption && baselineRecord && comparisonRecord && result && (
        <section className="reveal-stage" aria-labelledby="reveal-title">
          <div className="section-heading compact">
            <p className="step-label">소리가 지난 길과 결과 보기</p>
            <h2 id="reveal-title">한 가지만 바꾼 뒤 소리가 지난 길을 살펴봐요</h2>
          </div>
          <p className="result-reading-order">① 그대로 둔 것 보기 → ② 바꾼 것 보기 → ③ 달라진 점 찾기</p>
          <div className="apparatus-comparison">
            <div>
              <SoundPathDiagram setup={step.baseline} record={baselineRecord} label="1. 그대로 둔 것" active />
              <ReceiverMeter band={baselineRecord.receiverBand} />
            </div>
            <p className="mobile-result-cue">아래로 내려 바꾼 것도 살펴봐요.</p>
            <div>
              <SoundPathDiagram setup={selectedOption.setup} record={comparisonRecord} label="2. 바꾼 것" active />
              <ReceiverMeter band={comparisonRecord.receiverBand} />
            </div>
          </div>
          <div className="result-strip" aria-live="polite">
            <div><span>바꾼 것 1개</span><strong>{variableLabel(changedVariable ?? step.allowedVariable)}</strong></div>
            <div><span>처음 결과</span><strong>{receiverLabels[baselineRecord.receiverBand]}</strong></div>
            <div><span>바꾼 뒤 결과</span><strong>{receiverLabels[comparisonRecord.receiverBand]}</strong></div>
            <div><span>소리 크기 변화</span><strong>{sizeChangeLabels[result]}</strong></div>
          </div>
          <aside className="model-note">파동 막대는 소리가 지나가는 길을 이해하기 위한 컴퓨터 모형 표시예요.</aside>
          <button className="primary-button gi-pulse" type="button" onClick={props.onOpenEvidence}>결과와 왜 그런지 살펴보기</button>
        </section>
      )}

      {stage === "evidence" && selectedOption && baselineRecord && comparisonRecord && result && (
        <section className="evidence-stage" aria-labelledby="evidence-title">
          <div className="section-heading compact">
            <p className="step-label">왜 그런지 살펴보기</p>
            <h2 id="evidence-title">왜 그런지 보여 주는 단서를 찾아요</h2>
          </div>
          <div className="evidence-ledger">
            <div><span>바뀐 것 1개</span><strong>{variableLabel(changedVariable ?? step.allowedVariable)}</strong></div>
            <div><span>그대로 둔 것 3개</span><strong>높낮이·거리·다른 약속</strong></div>
            <div><span>남아 있는 길</span><strong>{comparisonRecord.openGapIds.length ? "열린 틈이 남아 있어요" : "재료 모형을 지나는 길이 남아 있어요"}</strong></div>
            <div><span>소리 크기 변화</span><strong>{sizeChangeLabels[result]}</strong></div>
          </div>
          <fieldset className="evidence-options">
            <legend>맞는 단서 모두 고르기</legend>
            {step.evidenceOptions.map((item) => (
              <label className={selectedEvidence.includes(item) ? "evidence-card selected" : "evidence-card"} key={item}>
                <input type="checkbox" checked={selectedEvidence.includes(item)} onChange={() => props.onEvidence(item)} />
                <span>{item}</span>
              </label>
            ))}
          </fieldset>
          {selectedEvidence.length === 1 && !evidenceComplete ? (
            <p className="evidence-hint" aria-live="polite">맞는 단서가 하나 더 있어요.</p>
          ) : null}
          <label className="limit-check">
            <input type="checkbox" checked={limitChecked} onChange={(event) => props.onLimitChecked(event.target.checked)} />
            <span>
              <strong>이 결과는 이 컴퓨터 모형 안에서만 비교해요.</strong>
              <small>소리가 완전히 없어졌거나 실제로 안전하다는 뜻은 아니에요.</small>
            </span>
          </label>
          {prediction && (
            <p className="reflection-note">
              {prediction === result ? "먼저 생각한 것과 결과가 같았어요. 남은 길까지 단서로 연결했어요." : "먼저 생각한 것과 달라도 괜찮아요. 남은 길을 보고 단서를 다시 살폈어요."}
            </p>
          )}
          <button className="primary-button gi-pulse" type="button" disabled={!evidenceComplete || !limitChecked} onClick={props.onComplete}>
            {props.completeLabel}
          </button>
        </section>
      )}
    </main>
  );
}
