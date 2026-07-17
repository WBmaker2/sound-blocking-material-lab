import { receiverLabels, setupLabels } from "../lab/content";
import type { ReceiverBand, SoundTestRecord, SoundTestSetup } from "../lab/types";

type SoundPathDiagramProps = {
  setup: SoundTestSetup;
  record?: SoundTestRecord;
  label: string;
  active?: boolean;
};

export function SoundPathDiagram({
  setup,
  record,
  label,
  active = false,
}: SoundPathDiagramProps) {
  const hasReduction = setup.reductionTreatmentId !== "none";
  const hasGap = setup.placementId === "open-gap";
  const reducedGap = setup.placementId === "reduced-gap";

  return (
    <figure className="path-figure">
      <figcaption>
        <strong>{label}</strong>
        <span>{setupLabels.sourceId[setup.sourceId]}</span>
      </figcaption>
      <div className={active ? "apparatus is-active" : "apparatus"}>
        <div className="apparatus-source">
          <span className="source-core" />
          <span className="vibration-ring ring-one" />
          <span className="vibration-ring ring-two" />
          <small>소리원</small>
        </div>
        <div className="apparatus-route" aria-hidden="true">
          {Array.from({ length: 11 }, (_, index) => <span key={index} />)}
        </div>
        <div className={`path-sample pattern-${setup.pathSampleId}`}>
          <strong>{setupLabels.pathSampleId[setup.pathSampleId]}</strong>
        </div>
        {hasReduction && (
          <div className={`reduction-sample pattern-${setup.reductionTreatmentId}`}>
            <strong>{setupLabels.reductionTreatmentId[setup.reductionTreatmentId]}</strong>
          </div>
        )}
        <div className={hasGap ? "gap gate-open" : reducedGap ? "gap gate-reduced" : "gap gate-standard"}>
          <span />
          <small>{setupLabels.placementId[setup.placementId]}</small>
        </div>
        <div className="apparatus-receiver">
          <span />
          <small>수신기</small>
        </div>
      </div>
      {record && (
        <p className="path-text">
          <strong>전달 경로:</strong> {record.activePathSegments.join(" → ")}
        </p>
      )}
    </figure>
  );
}

export function ReceiverMeter({ band }: { band: ReceiverBand }) {
  const order: ReceiverBand[] = ["very-high", "high", "medium", "low", "very-low"];
  const activeIndex = order.indexOf(band);
  return (
    <aside className="receiver-panel" aria-label={`받은 소리 결과: ${receiverLabels[band]}`}>
      <h3>받은 소리 결과</h3>
      <strong>{receiverLabels[band]}</strong>
      <div className="receiver-meter" aria-hidden="true">
        {order.map((item, index) => (
          <span className={index >= activeIndex ? "filled" : ""} key={item} />
        ))}
      </div>
      <p>이 앱 안에서만 서로 비교하는 단계예요.</p>
    </aside>
  );
}
