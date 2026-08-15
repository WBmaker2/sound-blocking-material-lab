type StartScreenProps = {
  onStart: () => void;
};

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <main className="start-screen">
      <section className="start-hero">
        <div className="hero-copy">
          <h1>소리가 지나가는 길과 줄어드는 조건을 비교해요</h1>
          <p>
            가상 시험 장치에서 한 번에 한 가지만 바꾸고, 떨림이 어떤 길을
            지나 수신기에 닿는지 살펴봐요.
          </p>
          <div className="hero-actions">
            <button className="primary-button gi-pulse" type="button" onClick={onStart}>
              연구 시작
            </button>
            <button className="secondary-button" type="button" onClick={onStart}>
              모형과 안전 먼저 보기
            </button>
          </div>
        </div>

        <div className="hero-apparatus" aria-label="가상 시험 장치 미리 보기">
          <div className="hero-source"><span /></div>
          <div className="hero-path" aria-hidden="true">
            {Array.from({ length: 9 }, (_, index) => <span key={index} />)}
          </div>
          <div className="hero-sample">A</div>
          <div className="hero-reduction">Q</div>
          <div className="hero-receiver"><span /></div>
          <p>떨림 → 전달 시료 → 줄임 시료 → 가상 수신기</p>
        </div>
      </section>

      <section className="start-facts" aria-label="활동 정보">
        <div><strong>15~20분</strong><span>안내 1개 + 미션 5개</span></div>
        <div><strong>실제 소리 없음</strong><span>마이크와 오디오를 쓰지 않아요</span></div>
        <div><strong>점수 없음</strong><span>예측과 근거를 비교해요</span></div>
        <div><strong>새로고침 시 초기화</strong><span>이름과 기록을 저장하지 않아요</span></div>
      </section>

      <aside className="model-note">
        수신기가 받은 소리 단계는 이 가상 장치 안에서만 비교해요. 실제로 잰 값이 아니에요.
      </aside>
    </main>
  );
}

type SafetyScreenProps = {
  checked: boolean[];
  onToggle: (index: number) => void;
  onContinue: () => void;
};

const safetyItems = [
  {
    title: "파동은 소리의 길을 보여 주는 그림이에요",
    copy: "실제 소리의 모습은 아니에요.",
  },
  {
    title: "단계는 이 앱 안에서만 비교해요",
    copy: "실제로 잰 값이나 제품 성능이 아니에요.",
  },
  {
    title: "낮은 단계도 완전한 무음은 아니에요",
    copy: "실제 활동은 선생님과 함께 작은 소리로 안전하게 해요.",
  },
];

export function SafetyScreen({ checked, onToggle, onContinue }: SafetyScreenProps) {
  return (
    <main className="safety-screen">
      <div className="section-heading">
        <h1>모형과 안전을 먼저 확인해요</h1>
        <p>세 가지 약속을 확인하면 가상 시험을 시작할 수 있어요.</p>
      </div>
      <div className="safety-list">
        {safetyItems.map((item, index) => (
          <label className={checked[index] ? "safety-item checked" : "safety-item"} key={item.title}>
            <input
              type="checkbox"
              checked={checked[index]}
              onChange={() => onToggle(index)}
            />
            <span className="check-mark" aria-hidden="true" />
            <span>
              <strong>{item.title}</strong>
              <small>{item.copy}</small>
            </span>
          </label>
        ))}
      </div>
      <button
        className="primary-button gi-pulse"
        type="button"
        disabled={!checked.every(Boolean)}
        onClick={onContinue}
      >
        가상 시험 시작
      </button>
    </main>
  );
}
