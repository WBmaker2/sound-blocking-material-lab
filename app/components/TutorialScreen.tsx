import { SoundPathDiagram } from "./SoundPathDiagram";

const tutorialSetup = {
  sourceId: "weak",
  pathSampleId: "sample-a",
  reductionTreatmentId: "none",
  placementId: "standard",
} as const;

type TutorialScreenProps = {
  vibrating: boolean;
  onToggle: () => void;
  onContinue: () => void;
};

export function TutorialScreen({ vibrating, onToggle, onContinue }: TutorialScreenProps) {
  return (
    <main className="tutorial-screen">
      <div className="section-heading">
        <h1>안내 활동: 떨림에서 시작해요</h1>
        <p>소리원이 멈춘 때와 떨리는 때를 번갈아 살펴보세요.</p>
      </div>

      <section className="tutorial-card">
        <div className="tutorial-controls">
          <span className={vibrating ? "status-dot active" : "status-dot"} />
          <div>
            <strong>{vibrating ? "소리원이 떨림 중이에요" : "소리원이 멈춰 있어요"}</strong>
            <p>{vibrating ? "시험 신호의 전달 경로가 시작됐어요." : "아직 시험 신호가 시작되지 않았어요."}</p>
          </div>
          <button className="secondary-button" type="button" onClick={onToggle}>
            {vibrating ? "떨림 멈추기" : "떨림 시작"}
          </button>
        </div>
        <SoundPathDiagram setup={tutorialSetup} label="안내 장치" active={vibrating} />
      </section>

      <aside className="model-note">
        이 모형에서는 소리원의 떨림이 시작되어야 시험 신호가 전달돼요. 실제 물체 관찰을 대신하지는 않아요.
      </aside>
      <button className="primary-button" type="button" disabled={!vibrating} onClick={onContinue}>
        미션 1 시작
      </button>
    </main>
  );
}
