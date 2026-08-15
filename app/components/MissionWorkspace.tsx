import { predictionLabels, receiverLabels } from "../lab/content";
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
        <div className="fixed-condition-list" aria-label="그대로 둘 조건">
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
              <legend>비교 조건 선택</legend>
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
              예측하러 가기
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
            <p className="step-label">결과를 보기 전 첫 생각</p>
            <h2 id="prediction-title">수신기가 받은 소리 단계는 어떻게 될까요?</h2>
            <fieldset className="prediction-options">
              <legend>예측 선택</legend>
              {(["lower", "same", "higher"] as Prediction[]).map((item) => (
                <label className={prediction === item ? "prediction-card selected" : "prediction-card"} key={item}>
                  <input
                    type="radio"
                    name="prediction"
                    aria-label={predictionLabels[item]}
                    checked={prediction === item}
                    onChange={() => props.onPrediction(item)}
                  />
                  <strong>{predictionLabels[item]}</strong>
                  <small>{item === "lower" ? "더 작게 전달될 것 같아요" : item === "higher" ? "더 크게 전달될 것 같아요" : "비슷하게 전달될 것 같아요"}</small>
                </label>
              ))}
            </fieldset>
            <p className="neutral-note">예측은 점수가 아니에요. 결과와 비교할 첫 생각이에요.</p>
            <button className="primary-button gi-pulse" type="button" disabled={!prediction} onClick={props.onReveal}>
              가상 시험 보기
            </button>
          </div>
        </section>
      )}

      {stage === "reveal" && selectedOption && baselineRecord && comparisonRecord && result && (
        <section className="reveal-stage" aria-labelledby="reveal-title">
          <div className="section-heading compact">
            <p className="step-label">경로와 받은 소리 결과</p>
            <h2 id="reveal-title">한 가지만 바꾼 뒤 어떤 길이 남았는지 확인해요</h2>
          </div>
          <p className="result-reading-order">① 기준 보기 → ② 비교 보기 → ③ 달라진 점 확인</p>
          <div className="apparatus-comparison">
            <div>
              <SoundPathDiagram setup={step.baseline} record={baselineRecord} label="1. 기준 조건" active />
              <ReceiverMeter band={baselineRecord.receiverBand} />
            </div>
            <p className="mobile-result-cue">아래로 내려 비교 조건도 살펴봐요.</p>
            <div>
              <SoundPathDiagram setup={selectedOption.setup} record={comparisonRecord} label="2. 비교 조건" active />
              <ReceiverMeter band={comparisonRecord.receiverBand} />
            </div>
          </div>
          <div className="result-strip" aria-live="polite">
            <div><span>바꾼 것 1개</span><strong>{variableLabel(changedVariable ?? step.allowedVariable)}</strong></div>
            <div><span>기준 결과</span><strong>{receiverLabels[baselineRecord.receiverBand]}</strong></div>
            <div><span>비교 결과</span><strong>{receiverLabels[comparisonRecord.receiverBand]}</strong></div>
            <div><span>달라진 결과</span><strong>{predictionLabels[result]}</strong></div>
          </div>
          <aside className="model-note">화면의 파동 표시는 소리가 전달되는 길을 이해하기 위한 가상 표시예요.</aside>
          <button className="primary-button gi-pulse" type="button" onClick={props.onOpenEvidence}>결과와 근거 비교하기</button>
        </section>
      )}

      {stage === "evidence" && selectedOption && baselineRecord && comparisonRecord && result && (
        <section className="evidence-stage" aria-labelledby="evidence-title">
          <div className="section-heading compact">
            <p className="step-label">증거 비교하기</p>
            <h2 id="evidence-title">맞는 근거를 모두 찾아요</h2>
          </div>
          <div className="evidence-ledger">
            <div><span>바뀐 것 1개</span><strong>{variableLabel(changedVariable ?? step.allowedVariable)}</strong></div>
            <div><span>그대로인 것 3개</span><strong>높낮이·거리·다른 조건</strong></div>
            <div><span>남아 있는 경로</span><strong>{comparisonRecord.openGapIds.length ? "열린 틈 경로가 남음" : "시료를 지나는 경로가 남음"}</strong></div>
            <div><span>달라진 결과</span><strong>{predictionLabels[result]}</strong></div>
          </div>
          <fieldset className="evidence-options">
            <legend>맞는 근거 모두 선택</legend>
            {step.evidenceOptions.map((item) => (
              <label className={selectedEvidence.includes(item) ? "evidence-card selected" : "evidence-card"} key={item}>
                <input type="checkbox" checked={selectedEvidence.includes(item)} onChange={() => props.onEvidence(item)} />
                <span>{item}</span>
              </label>
            ))}
          </fieldset>
          {selectedEvidence.length === 1 && !evidenceComplete ? (
            <p className="evidence-hint" aria-live="polite">맞는 근거가 하나 더 있어요.</p>
          ) : null}
          <label className="limit-check">
            <input type="checkbox" checked={limitChecked} onChange={(event) => props.onLimitChecked(event.target.checked)} />
            <span>
              <strong>이 결과는 이 가상 시험 안에서만 비교해요.</strong>
              <small>소리가 완전히 없어졌거나 실제로 안전하다는 뜻은 아니에요.</small>
            </span>
          </label>
          {prediction && (
            <p className="reflection-note">
              {prediction === result ? "예측과 결과가 같았어요. 이제 남은 경로까지 근거로 연결했어요." : "예상과 달라도 괜찮아요. 남아 있는 경로를 보고 근거를 다시 살폈어요."}
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
