import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FinalRecord } from "../app/components/FinalRecord";
import { SoundLabApp } from "../app/components/SoundLabApp";

function enterFirstMission() {
  fireEvent.click(screen.getByRole("button", { name: "연구 시작" }));
  for (const checkbox of screen.getAllByRole("checkbox")) {
    fireEvent.click(checkbox);
  }
  fireEvent.click(screen.getByRole("button", { name: "가상 시험 시작" }));
  fireEvent.click(screen.getByRole("button", { name: "떨림 시작" }));
  fireEvent.click(screen.getByRole("button", { name: "미션 1 시작" }));
}

function enterFirstEvidenceStage() {
  enterFirstMission();
  fireEvent.click(
    screen.getByRole("radio", { name: /강한 떨림으로 바꾸기/ }),
  );
  fireEvent.click(screen.getByRole("button", { name: "예측하러 가기" }));
  fireEvent.click(screen.getByRole("radio", { name: "높아짐" }));
  fireEvent.click(screen.getByRole("button", { name: "가상 시험 보기" }));
  fireEvent.click(
    screen.getByRole("button", { name: "결과와 근거 비교하기" }),
  );
}

describe("소리 차단 재료 연구소", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it("시작 화면에서 모형과 안전 확인 전에는 미션으로 들어가지 않는다", () => {
    render(<SoundLabApp />);

    expect(
      screen.getByRole("heading", {
        name: "소리가 지나가는 길과 줄어드는 조건을 비교해요",
      }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "연구 시작" }));
    expect(
      screen.getByRole("heading", { name: "모형과 안전을 먼저 확인해요" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "가상 시험 시작" }),
    ).toBeDisabled();
  });

  it("세 가지 안내를 확인하면 안내 활동으로 이동한다", () => {
    render(<SoundLabApp />);
    fireEvent.click(screen.getByRole("button", { name: "연구 시작" }));

    for (const checkbox of screen.getAllByRole("checkbox")) {
      fireEvent.click(checkbox);
    }
    fireEvent.click(screen.getByRole("button", { name: "가상 시험 시작" }));

    expect(
      screen.getByRole("heading", { name: "안내 활동: 떨림에서 시작해요" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/dB/)).not.toBeInTheDocument();
  });

  it("안내 활동 뒤 첫 미션에서 두 요소 변경을 막는다", () => {
    render(<SoundLabApp />);
    enterFirstMission();

    fireEvent.click(
      screen.getByRole("radio", {
        name: /강한 떨림과 시료 B 함께 바꾸기/,
      }),
    );

    expect(
      screen.getByText("무엇 때문에 달라졌는지 알기 어려워요. 하나만 바꿔요."),
    ).toBeInTheDocument();
    expect(screen.getByText("지금은 2가지가 바뀌었어요.")).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /강한 떨림과 시료 B 함께 바꾸기/ }).closest("label"),
    ).toHaveClass("error");
    expect(screen.getAllByText("바뀜")[0].closest("tr")).toHaveClass("changed-row");
    expect(screen.getAllByText("바뀜")[0].closest("tr")).not.toHaveClass("valid");
    expect(
      screen.getByRole("button", { name: "예측하러 가기" }),
    ).toBeDisabled();
  });

  it("한 요소 선택과 예측 뒤에만 경로와 결과를 공개한다", () => {
    render(<SoundLabApp />);
    enterFirstMission();
    fireEvent.click(
      screen.getByRole("radio", { name: /강한 떨림으로 바꾸기/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: "예측하러 가기" }));

    expect(screen.queryByText("크게 전달됨")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "높아짐" }));
    fireEvent.click(screen.getByRole("button", { name: "가상 시험 보기" }));
    expect(screen.getAllByText("크게 전달됨").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/떨리는 소리원 → 전달 시료 A/).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText("① 기준 보기 → ② 비교 보기 → ③ 달라진 점 확인"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("아래로 내려 비교 조건도 살펴봐요."),
    ).toBeInTheDocument();
  });

  it("맞는 근거 두 개와 모형 한계를 모두 확인해야 비교를 기록한다", () => {
    render(<SoundLabApp />);
    enterFirstEvidenceStage();

    expect(
      screen.getByRole("heading", { name: "맞는 근거를 모두 찾아요" }),
    ).toBeInTheDocument();
    const evidenceChecks = screen.getAllByRole("checkbox").filter((item) =>
      item.closest("label")?.classList.contains("evidence-card"),
    );
    expect(evidenceChecks).toHaveLength(2);
    expect(screen.getByRole("button", { name: "다음 미션으로" })).toBeDisabled();

    fireEvent.click(evidenceChecks[0]);
    expect(screen.getByText("맞는 근거가 하나 더 있어요.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음 미션으로" })).toBeDisabled();

    fireEvent.click(evidenceChecks[1]);
    expect(screen.getByRole("button", { name: "다음 미션으로" })).toBeDisabled();
    fireEvent.click(
      screen.getByRole("checkbox", {
        name: /이 결과는 이 가상 시험 안에서만 비교해요/,
      }),
    );
    expect(screen.getByRole("button", { name: "다음 미션으로" })).toBeEnabled();
  });

  it("학생용 결과 용어와 최신 업데이트 내역을 보여 준다", () => {
    render(<SoundLabApp />);
    enterFirstMission();
    fireEvent.click(
      screen.getByRole("radio", { name: /강한 떨림으로 바꾸기/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: "예측하러 가기" }));

    expect(
      screen.getByRole("heading", { name: "수신기가 받은 소리 단계는 어떻게 될까요?" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "업데이트 내역" }));
    expect(screen.getByText("2026-07-18")).toBeInTheDocument();
  });

  it("새 화면과 비교 단계로 이동할 때 맨 위로 스크롤한다", () => {
    render(<SoundLabApp />);
    vi.mocked(window.scrollTo).mockClear();

    fireEvent.click(screen.getByRole("button", { name: "연구 시작" }));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });

  it("진행 중 처음으로 돌아가기 전에 확인한다", () => {
    render(<SoundLabApp />);
    enterFirstMission();

    fireEvent.click(
      screen.getByRole("button", {
        name: "소리 차단 재료 연구소 차단은 완전한 무음을 뜻하지 않아요",
      }),
    );

    expect(
      screen.getByRole("dialog", { name: "처음부터 다시 할까요?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "같은 길, 다른 떨림" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "계속 연구하기" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "소리 차단 재료 연구소 차단은 완전한 무음을 뜻하지 않아요",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "처음부터 다시 하기" }));
    expect(
      screen.getByRole("heading", {
        name: "소리가 지나가는 길과 줄어드는 조건을 비교해요",
      }),
    ).toBeInTheDocument();
  });

  it("비교 단계가 진행될 때 진행률 값이 증가한다", () => {
    render(<SoundLabApp />);
    enterFirstMission();
    const setupProgress = Number(
      screen.getByRole("progressbar").getAttribute("aria-valuenow"),
    );

    fireEvent.click(
      screen.getByRole("radio", { name: /강한 떨림으로 바꾸기/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: "예측하러 가기" }));
    const predictionProgress = Number(
      screen.getByRole("progressbar").getAttribute("aria-valuenow"),
    );

    expect(predictionProgress).toBeGreaterThan(setupProgress);
  });

  it("최종 기록에 확인한 근거 두 개를 모두 남긴다", () => {
    render(
      <FinalRecord
        records={[{
          missionId: "source-strength-one-variable",
          missionTitle: "같은 길, 다른 떨림",
          changedLabel: "소리원 세기",
          prediction: "higher",
          result: "higher",
          remainingPath: "시료를 지나는 경로가 남음",
          evidence: ["소리원 떨림 세기만 달라졌어요.", "높낮이와 경로는 그대로예요."],
          modelLimitChecked: true,
        }]}
        onRepeat={vi.fn()}
        onSafety={vi.fn()}
        onRestart={vi.fn()}
      />,
    );

    expect(
      screen.getByText("소리원 떨림 세기만 달라졌어요."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("높낮이와 경로는 그대로예요."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("소리원 떨림 세기만 달라졌어요.").closest("td"),
    ).toHaveAttribute("data-label", "확인한 근거");
  });
});
