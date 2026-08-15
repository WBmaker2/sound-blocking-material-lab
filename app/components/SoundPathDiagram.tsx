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
  const waveBand: ReceiverBand = record?.receiverBand ?? (setup.sourceId === "strong" ? "high" : "medium");
  const waveDescription = record
    ? `${receiverLabels[waveBand]} · 막대 높이로 크기를 보여 줘요.`
    : "파동이 왼쪽에서 오른쪽으로 움직이는 컴퓨터 모형 표시예요.";

  return (
    <figure className="path-figure">
      <figcaption>
        <strong>{label}</strong>
        <span>{setupLabels.sourceId[setup.sourceId]}</span>
      </figcaption>
      <div
        className={active ? "apparatus is-active" : "apparatus"}
        data-wave-band={waveBand}
        role="img"
        aria-label={`${label}. ${waveDescription}`}
      >
        <div className="apparatus-source">
          <span className="source-core" />
          <span className="vibration-ring ring-one" />
          <span className="vibration-ring ring-two" />
          <small>소리 내는 곳</small>
        </div>
        <div className="apparatus-route" aria-hidden="true">
          <div className="wave-rail">
            {Array.from({ length: 13 }, (_, index) => (
              <span className="wave-particle" style={{ animationDelay: `${index * 80}ms` }} key={index} />
            ))}
          </div>
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
          <small>소리 받는 곳</small>
        </div>
      </div>
      <div className="wave-readout" aria-live="polite">
        <span className="wave-readout-swatch" aria-hidden="true" />
        <span>{waveDescription}</span>
      </div>
      {record && (
        <p className="path-text">
          <strong>소리가 지난 길:</strong> {record.activePathSegments.join(" → ")}
        </p>
      )}
    </figure>
  );
}

export function ReceiverMeter({ band }: { band: ReceiverBand }) {
  const order: ReceiverBand[] = ["very-high", "high", "medium", "low", "very-low"];
  const activeIndex = order.indexOf(band);
  return (
    <aside className="receiver-panel" aria-label={`소리 받는 곳에 도착한 크기: ${receiverLabels[band]}`}>
      <h3>도착한 소리 크기</h3>
      <strong>{receiverLabels[band]}</strong>
      <div className="receiver-meter" data-band={band} aria-hidden="true">
        {order.map((item, index) => (
          <span className={index >= activeIndex ? "filled" : ""} key={item} />
        ))}
      </div>
      <p>이 컴퓨터 모형 안에서만 비교해요.</p>
    </aside>
  );
}
