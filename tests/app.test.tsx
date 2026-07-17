import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SoundLabApp } from "../app/components/SoundLabApp";

describe("소리 차단 재료 연구소", () => {
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
    fireEvent.click(screen.getByRole("button", { name: "연구 시작" }));
    for (const checkbox of screen.getAllByRole("checkbox")) {
      fireEvent.click(checkbox);
    }
    fireEvent.click(screen.getByRole("button", { name: "가상 시험 시작" }));
    fireEvent.click(screen.getByRole("button", { name: "떨림 시작" }));
    fireEvent.click(screen.getByRole("button", { name: "미션 1 시작" }));

    fireEvent.click(
      screen.getByRole("radio", {
        name: /강한 떨림과 시료 B 함께 바꾸기/,
      }),
    );

    expect(
      screen.getByText("무엇 때문에 달라졌는지 알기 어려워요. 하나만 바꿔요."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "예측하러 가기" }),
    ).toBeDisabled();
  });

  it("한 요소 선택과 예측 뒤에만 경로와 결과를 공개한다", () => {
    render(<SoundLabApp />);
    fireEvent.click(screen.getByRole("button", { name: "연구 시작" }));
    for (const checkbox of screen.getAllByRole("checkbox")) {
      fireEvent.click(checkbox);
    }
    fireEvent.click(screen.getByRole("button", { name: "가상 시험 시작" }));
    fireEvent.click(screen.getByRole("button", { name: "떨림 시작" }));
    fireEvent.click(screen.getByRole("button", { name: "미션 1 시작" }));
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
  });
});
