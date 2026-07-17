type AppHeaderProps = {
  missionLabel: string;
  stageLabel: string;
  progress: number;
  onOpenGuide: () => void;
  onOpenTeacher: () => void;
  onOpenUpdates: () => void;
  onRestart: () => void;
};

export function AppHeader({
  missionLabel,
  stageLabel,
  progress,
  onOpenGuide,
  onOpenTeacher,
  onOpenUpdates,
  onRestart,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <button className="brand-button" type="button" onClick={onRestart}>
        <span className="brand-mark" aria-hidden="true">
          <span className="brand-liquid" />
        </span>
        <span>
          <strong>소리 차단 재료 연구소</strong>
          <small>차단은 완전한 무음을 뜻하지 않아요</small>
        </span>
      </button>

      <div className="header-progress" aria-label={`진행: ${missionLabel}, ${stageLabel}`}>
        <span>{missionLabel}</span>
        <span aria-hidden="true" className="progress-divider" />
        <strong>{stageLabel}</strong>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <nav className="utility-nav" aria-label="도움말 메뉴">
        <button type="button" onClick={onOpenGuide}>활동 방법</button>
        <button type="button" onClick={onOpenTeacher}>교사용</button>
        <button type="button" onClick={onOpenUpdates}>업데이트 내역</button>
      </nav>
    </header>
  );
}
