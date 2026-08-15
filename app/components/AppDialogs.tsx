"use client";

import { useEffect, useRef } from "react";
import { updateHistory } from "../lab/content";

export type DialogKind = "guide" | "teacher" | "updates" | "restart" | null;

type AppDialogsProps = {
  kind: DialogKind;
  onClose: () => void;
  onConfirmRestart: () => void;
};

export function AppDialogs({ kind, onClose, onConfirmRestart }: AppDialogsProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!kind) return;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [kind, onClose]);

  if (!kind) return null;

  const titles = {
    guide: "활동 방법",
    teacher: "교사용 안내",
    updates: "업데이트 내역",
    restart: "처음부터 다시 할까요?",
  };

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="app-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dialog-header">
          <h2 id="dialog-title">{titles[kind]}</h2>
          {kind !== "restart" && (
            <button ref={closeButtonRef} type="button" onClick={onClose}>
              닫기
            </button>
          )}
        </div>

        {kind === "guide" && (
          <ol className="dialog-list">
            <li>그대로 둔 것과 바꿀 것을 먼저 읽어요.</li>
            <li>바꿀 때는 한 가지만 바꿔요.</li>
            <li>결과를 보기 전에 먼저 생각해요.</li>
            <li>소리가 지난 길을 보고 단서를 골라요.</li>
          </ol>
        )}

        {kind === "teacher" && (
          <div className="dialog-copy">
            <p>재료 모형과 소리 크기 표시는 실제 재료를 잰 수치나 제품 성능이 아닙니다.</p>
            <p>먼저 생각한 답보다 한 가지만 바꾸고 남은 길을 설명하는 과정을 살펴봐 주세요.</p>
            <p>실제 활동은 작은 소리와 안전한 재료를 사용해 선생님이 지켜보는 가운데 진행해 주세요.</p>
            <p>새로고침하면 학생의 기록은 처음으로 돌아갑니다.</p>
          </div>
        )}

        {kind === "updates" && (
          <div className="update-list">
            {updateHistory.map((item) => (
              <article key={`${item.date}-${item.title}`}>
                <time dateTime={item.date}>{item.date}</time>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        )}

        {kind === "restart" && (
          <div className="restart-dialog-copy">
            <p>지금까지 고른 기록이 모두 사라져요.</p>
            <p>잘못 눌렀다면 계속하기를 눌러 주세요.</p>
            <div className="restart-dialog-actions">
              <button ref={closeButtonRef} className="secondary-button" type="button" onClick={onClose}>
                계속하기
              </button>
              <button className="danger-button" type="button" onClick={onConfirmRestart}>
                처음부터 하기
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
