import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FinalRecord } from "../app/components/FinalRecord";
import { SoundLabApp } from "../app/components/SoundLabApp";

function enterFirstMission() {
  fireEvent.click(screen.getByRole("button", { name: "활동 시작" }));
  for (const checkbox of screen.getAllByRole("checkbox")) {
    fireEvent.click(checkbox);
  }
  fireEvent.click(screen.getByRole("button", { name: "모형 활동 시작" }));
  fireEvent.click(screen.getByRole("button", { name: "떨림 시작" }));
  fireEvent.click(screen.getByRole("button", { name: "미션 1 시작" }));
}

function enterFirstEvidenceStage() {
  enterFirstMission();
  fireEvent.click(
    screen.getByRole("radio", { name: /큰 떨림으로 바꾸기/ }),
  );
  fireEvent.click(screen.getByRole("button", { name: "먼저 생각하기" }));
  fireEvent.click(screen.getByRole("radio", { name: "커짐" }));
  fireEvent.click(screen.getByRole("button", { name: "모형 실험 보기" }));
  fireEvent.click(
    screen.getByRole("button", { name: "결과와 왜 그런지 살펴보기" }),
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
        name: "소리가 지나가는 길을 찾아봐요",
      }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "활동 시작" }));
    expect(
      screen.getByRole("heading", { name: "컴퓨터 모형과 약속을 먼저 봐요" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "모형 활동 시작" }),
    ).toBeDisabled();
  });

  it("세 가지 안내를 확인하면 안내 활동으로 이동한다", () => {
    render(<SoundLabApp />);
    fireEvent.click(screen.getByRole("button", { name: "활동 시작" }));

    for (const checkbox of screen.getAllByRole("checkbox")) {
      fireEvent.click(checkbox);
    }
    fireEvent.click(screen.getByRole("button", { name: "모형 활동 시작" }));

    expect(
      screen.getByRole("heading", { name: "연습: 떨림에서 시작해요" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/dB/)).not.toBeInTheDocument();
  });

  it("안내 활동 뒤 첫 미션에서 두 요소 변경을 막는다", () => {
    render(<SoundLabApp />);
    enterFirstMission();

    fireEvent.click(
      screen.getByRole("radio", {
        name: /큰 떨림과 재료 모형 B 함께 바꾸기/,
      }),
    );

    expect(
      screen.getByText("무엇 때문인지 알기 어려워요. 한 가지만 바꿔요."),
    ).toBeInTheDocument();
    expect(screen.getByText("지금은 2가지가 바뀌었어요.")).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /큰 떨림과 재료 모형 B 함께 바꾸기/ }).closest("label"),
    ).toHaveClass("error");
    expect(screen.getAllByText("바뀜")[0].closest("tr")).toHaveClass("changed-row");
    expect(screen.getAllByText("바뀜")[0].closest("tr")).not.toHaveClass("valid");
    expect(
      screen.getByRole("button", { name: "먼저 생각하기" }),
    ).toBeDisabled();
  });

  it("한 요소 선택과 예측 뒤에만 경로와 결과를 공개한다", () => {
    render(<SoundLabApp />);
    enterFirstMission();
    fireEvent.click(
      screen.getByRole("radio", { name: /큰 떨림으로 바꾸기/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: "먼저 생각하기" }));

    expect(screen.queryByText("크게 표시됨")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "커짐" }));
    fireEvent.click(screen.getByRole("button", { name: "모형 실험 보기" }));
    expect(screen.getAllByText("크게 표시됨").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/소리 내는 곳 → 재료 모형 A/).length,
    ).toBeGreaterThan(0);
    expect([...document.querySelectorAll(".apparatus.is-active")].map((node) => node.getAttribute("data-wave-band"))).toEqual(["low", "high"]);
    expect(document.querySelectorAll(".wave-particle")).toHaveLength(26);
    expect(
      screen.getByText("① 그대로 둔 것 보기 → ② 바꾼 것 보기 → ③ 달라진 점 찾기"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("아래로 내려 바꾼 것도 살펴봐요."),
    ).toBeInTheDocument();
  });

  it("맞는 근거 두 개와 모형 한계를 모두 확인해야 비교를 기록한다", () => {
    render(<SoundLabApp />);
    enterFirstEvidenceStage();

    expect(
      screen.getByRole("heading", { name: "왜 그런지 보여 주는 단서를 찾아요" }),
    ).toBeInTheDocument();
    const evidenceChecks = screen.getAllByRole("checkbox").filter((item) =>
      item.closest("label")?.classList.contains("evidence-card"),
    );
    expect(evidenceChecks).toHaveLength(2);
    expect(screen.getByRole("button", { name: "다음 미션으로" })).toBeDisabled();

    fireEvent.click(evidenceChecks[0]);
    expect(screen.getByText("맞는 단서가 하나 더 있어요.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음 미션으로" })).toBeDisabled();

    fireEvent.click(evidenceChecks[1]);
    expect(screen.getByRole("button", { name: "다음 미션으로" })).toBeDisabled();
    fireEvent.click(
      screen.getByRole("checkbox", {
        name: /이 결과는 이 컴퓨터 모형 안에서만 비교해요/,
      }),
    );
    expect(screen.getByRole("button", { name: "다음 미션으로" })).toBeEnabled();
  });

  it("학생용 결과 용어와 최신 업데이트 내역을 보여 준다", () => {
    render(<SoundLabApp />);
    enterFirstMission();
    fireEvent.click(
      screen.getByRole("radio", { name: /큰 떨림으로 바꾸기/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: "먼저 생각하기" }));

    expect(
      screen.getByRole("heading", { name: "소리 받는 곳의 크기 표시는 어떻게 될까요?" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "업데이트 내역" }));
    expect(screen.getByText("2026-08-16")).toBeInTheDocument();
    expect(screen.getAllByText("2026-08-15")).toHaveLength(2);
  });

  it("새 화면과 비교 단계로 이동할 때 맨 위로 스크롤한다", () => {
    render(<SoundLabApp />);
    vi.mocked(window.scrollTo).mockClear();

    fireEvent.click(screen.getByRole("button", { name: "활동 시작" }));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });

  it("진행 중 처음으로 돌아가기 전에 확인한다", () => {
    render(<SoundLabApp />);
    enterFirstMission();

    fireEvent.click(
      screen.getByRole("button", {
        name: "소리 차단 재료 연구소 소리가 완전히 사라진다는 뜻은 아니에요",
      }),
    );

    expect(
      screen.getByRole("dialog", { name: "처음부터 다시 할까요?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "같은 길, 다른 떨림" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "계속하기" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "소리 차단 재료 연구소 소리가 완전히 사라진다는 뜻은 아니에요",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "처음부터 하기" }));
    expect(
      screen.getByRole("heading", {
        name: "소리가 지나가는 길을 찾아봐요",
      }),
    ).toBeInTheDocument();
  });

  it("헤더의 홈 화면 버튼으로 처음 화면 이동을 확인한다", () => {
    render(<SoundLabApp />);
    enterFirstMission();

    fireEvent.click(screen.getByRole("button", { name: "홈 화면으로 이동" }));

    expect(screen.getByRole("dialog", { name: "처음부터 다시 할까요?" })).toBeInTheDocument();
  });

  it("비교 단계가 진행될 때 진행률 값이 증가한다", () => {
    render(<SoundLabApp />);
    enterFirstMission();
    const setupProgress = Number(
      screen.getByRole("progressbar").getAttribute("aria-valuenow"),
    );

    fireEvent.click(
      screen.getByRole("radio", { name: /큰 떨림으로 바꾸기/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: "먼저 생각하기" }));
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
          changedLabel: "소리 내는 곳",
          prediction: "higher",
          result: "higher",
          remainingPath: "재료 모형을 지나는 길이 남음",
          evidence: ["소리 내는 곳의 떨림만 달라졌어요.", "높낮이와 길은 그대로예요."],
          modelLimitChecked: true,
        }]}
        onRepeat={vi.fn()}
        onSafety={vi.fn()}
        onRestart={vi.fn()}
      />,
    );

    expect(
      screen.getByText("소리 내는 곳의 떨림만 달라졌어요."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("높낮이와 길은 그대로예요."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("소리 내는 곳의 떨림만 달라졌어요.").closest("td"),
    ).toHaveAttribute("data-label", "찾은 단서");
  });
});
