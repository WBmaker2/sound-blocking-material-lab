type StartScreenProps = {
  onStart: () => void;
};

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <main className="start-screen">
      <section className="start-hero">
        <div className="hero-copy">
          <h1>소리가 지나가는 길을 찾아봐요</h1>
          <p>
            컴퓨터 모형에서 한 번에 한 가지만 바꾸고, 소리가 어디를
            지나가는지 살펴봐요.
          </p>
          <div className="hero-actions">
            <button className="primary-button gi-pulse" type="button" onClick={onStart}>
              활동 시작
            </button>
            <button className="secondary-button" type="button" onClick={onStart}>
              약속부터 보기
            </button>
          </div>
        </div>

        <div className="hero-apparatus" aria-label="컴퓨터 모형 장치 미리 보기">
          <div className="hero-source"><span /></div>
          <div className="hero-path" aria-hidden="true">
            {Array.from({ length: 9 }, (_, index) => <span key={index} />)}
          </div>
          <div className="hero-sample">A</div>
          <div className="hero-reduction">Q</div>
          <div className="hero-receiver"><span /></div>
          <p>떨림 → 재료 모형 → 덧댄 모형 → 소리 받는 곳</p>
        </div>
      </section>

      <section className="start-facts" aria-label="활동 정보">
        <div><strong>15~20분</strong><span>연습 1개 + 미션 5개</span></div>
        <div><strong>실제 소리 없음</strong><span>마이크와 오디오를 쓰지 않아요</span></div>
        <div><strong>점수 없음</strong><span>먼저 생각한 것과 결과를 비교해요</span></div>
        <div><strong>새로고침 시 초기화</strong><span>이름과 기록을 저장하지 않아요</span></div>
      </section>

      <aside className="model-note">
        소리 받는 곳의 크기 표시는 이 컴퓨터 모형 안에서만 비교해요. 실제로 잰 소리 크기는 아니에요.
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
    title: "파동은 소리가 가는 길을 그린 그림이에요",
    copy: "실제 소리를 그대로 보여 주는 건 아니에요.",
  },
  {
    title: "크기 표시는 이 앱 안에서만 비교해요",
    copy: "실제로 잰 값이나 제품 성능이 아니에요.",
  },
  {
    title: "가장 작은 표시도 완전한 무음은 아니에요",
    copy: "실제 소리 활동은 선생님과 함께 안전하게 해요.",
  },
];

export function SafetyScreen({ checked, onToggle, onContinue }: SafetyScreenProps) {
  return (
    <main className="safety-screen">
      <div className="section-heading">
        <h1>컴퓨터 모형과 약속을 먼저 봐요</h1>
        <p>세 가지 약속을 확인하면 활동을 시작할 수 있어요.</p>
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
        모형 활동 시작
      </button>
    </main>
  );
}
