"use client";

import { useEffect, useMemo, useState } from "react";
import { compareReceiverBands, guardOneVariableChange, lookupSoundTest, variableLabel } from "../lab/domain";
import { missions } from "../lab/content";
import type { MissionRecord, MissionStep, Prediction, SoundTestSetup, StepOption } from "../lab/types";
import { AppDialogs, type DialogKind } from "./AppDialogs";
import { AppHeader } from "./AppHeader";
import { FinalRecord } from "./FinalRecord";
import { MissionWorkspace, type MissionStage } from "./MissionWorkspace";
import { SafetyScreen, StartScreen } from "./StartAndSafety";
import { TutorialScreen } from "./TutorialScreen";

type Screen = "start" | "safety" | "tutorial" | "mission" | "final";

const stageProgressIndex: Record<MissionStage, number> = {
  setup: 0,
  prediction: 1,
  reveal: 2,
  evidence: 3,
};

export function resolveMissionStep(
  step: MissionStep,
  previousSetup?: SoundTestSetup,
): MissionStep {
  if (step.id !== "redesign-gap" || !previousSetup) return step;
  return {
    ...step,
    baseline: previousSetup,
    allowedVariable: "placementId",
    options: step.options.map((option) => {
      const changesPath = option.id.includes("path");
      return {
        ...option,
        setup: changesPath
          ? { ...previousSetup, pathSampleId: "sample-c" }
          : { ...previousSetup, placementId: "reduced-gap" },
      };
    }),
  };
}

export function SoundLabApp() {
  const [screen, setScreen] = useState<Screen>("start");
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [safetyChecks, setSafetyChecks] = useState([false, false, false]);
  const [vibrating, setVibrating] = useState(false);
  const [missionIndex, setMissionIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [stage, setStage] = useState<MissionStage>("setup");
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [prediction, setPrediction] = useState<Prediction>();
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [limitChecked, setLimitChecked] = useState(false);
  const [records, setRecords] = useState<MissionRecord[]>([]);
  const [previousSetup, setPreviousSetup] = useState<SoundTestSetup>();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [screen, missionIndex, stepIndex, stage]);

  const mission = missions[missionIndex];
  const rawStep = mission?.steps[stepIndex];
  const step = useMemo(
    () => rawStep ? resolveMissionStep(rawStep, previousSetup) : undefined,
    [rawStep, previousSetup],
  );
  const selectedOption = step?.options.find((option) => option.id === selectedOptionId);
  const guard = step && selectedOption
    ? guardOneVariableChange(step.baseline, selectedOption.setup)
    : undefined;
  const evidenceComplete = Boolean(
    step?.evidenceOptions.every((item) => selectedEvidence.includes(item)),
  );

  const testResult = useMemo(() => {
    if (!step || !selectedOption || !guard?.valid) return undefined;
    const baselineRecord = lookupSoundTest(step.baseline);
    const comparisonRecord = lookupSoundTest(selectedOption.setup);
    return {
      baselineRecord,
      comparisonRecord,
      result: compareReceiverBands(
        baselineRecord.receiverBand,
        comparisonRecord.receiverBand,
      ),
    };
  }, [guard?.valid, selectedOption, step]);

  const resetStep = () => {
    setStage("setup");
    setSelectedOptionId("");
    setPrediction(undefined);
    setSelectedEvidence([]);
    setLimitChecked(false);
  };

  const restart = () => {
    setScreen("start");
    setSafetyChecks([false, false, false]);
    setVibrating(false);
    setMissionIndex(0);
    setStepIndex(0);
    setRecords([]);
    setPreviousSetup(undefined);
    resetStep();
  };

  const requestRestart = () => {
    if (screen === "start") return;
    setDialog("restart");
  };

  const startMissions = () => {
    setMissionIndex(0);
    setStepIndex(0);
    setPreviousSetup(undefined);
    setRecords([]);
    setScreen("mission");
    resetStep();
  };

  const completeComparison = () => {
    if (
      !mission || !step || !selectedOption || !prediction || !testResult
      || !evidenceComplete || !limitChecked
    ) return;
    const remainingPath = testResult.comparisonRecord.openGapIds.length
      ? "열린 틈이 남음"
      : "재료 모형을 지나는 길이 남음";
    setRecords((current) => [
      ...current,
      {
        missionId: mission.id,
        missionTitle: mission.steps.length > 1 ? `${mission.title} · ${stepIndex + 1}차` : mission.title,
        changedLabel: variableLabel(guard!.changed[0]),
        prediction,
        result: testResult.result,
        remainingPath,
        evidence: [...selectedEvidence],
        modelLimitChecked: limitChecked,
      },
    ]);

    if (stepIndex < mission.steps.length - 1) {
      setPreviousSetup(selectedOption.setup);
      setStepIndex((current) => current + 1);
      resetStep();
      return;
    }

    if (missionIndex < missions.length - 1) {
      setMissionIndex((current) => current + 1);
      setStepIndex(0);
      setPreviousSetup(undefined);
      resetStep();
      return;
    }

    setScreen("final");
  };

  const missionLabel = screen === "mission" ? `미션 ${missionIndex + 1}/5` : screen === "final" ? "기록 완료" : "시작 전";
  const stageLabels: Record<Screen, string> = {
    start: "활동 소개",
    safety: "약속 확인",
    tutorial: "연습",
    mission: stage === "setup" ? "바꿀 것 고르기" : stage === "prediction" ? "먼저 생각하기" : stage === "reveal" ? "길과 결과" : "왜 그런지 찾기",
    final: "기록 보기",
  };
  const completedComparisons = missions
    .slice(0, missionIndex)
    .reduce((total, item) => total + item.steps.length, 0) + stepIndex;
  const missionProgress = Math.round(
    12 + ((completedComparisons * 4 + stageProgressIndex[stage] + 1) / 24) * 84,
  );
  const progress = screen === "start" ? 0 : screen === "safety" ? 6 : screen === "tutorial" ? 12 : screen === "final" ? 100 : missionProgress;

  return (
    <div className="app-shell">
      <AppHeader
        missionLabel={missionLabel}
        stageLabel={stageLabels[screen]}
        progress={progress}
        onOpenGuide={() => setDialog("guide")}
        onOpenTeacher={() => setDialog("teacher")}
        onOpenUpdates={() => setDialog("updates")}
        onGoHome={requestRestart}
        onRestart={requestRestart}
      />

      {screen === "start" && <StartScreen onStart={() => setScreen("safety")} />}
      {screen === "safety" && (
        <SafetyScreen
          checked={safetyChecks}
          onToggle={(index) => setSafetyChecks((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))}
          onContinue={() => setScreen("tutorial")}
        />
      )}
      {screen === "tutorial" && (
        <TutorialScreen vibrating={vibrating} onToggle={() => setVibrating((current) => !current)} onContinue={startMissions} />
      )}
      {screen === "mission" && mission && step && (
        <MissionWorkspace
          mission={mission}
          step={step}
          stage={stage}
          selectedOption={selectedOption as StepOption | undefined}
          guardMessage={guard?.message ?? ""}
          changedCount={guard?.changed.length ?? 0}
          canContinueSetup={Boolean(guard?.valid)}
          prediction={prediction}
          selectedEvidence={selectedEvidence}
          evidenceComplete={evidenceComplete}
          limitChecked={limitChecked}
          baselineRecord={testResult?.baselineRecord}
          comparisonRecord={testResult?.comparisonRecord}
          result={testResult?.result}
          changedVariable={guard?.valid ? guard.changed[0] : undefined}
          onSelectOption={setSelectedOptionId}
          onContinueSetup={() => setStage("prediction")}
          onPrediction={setPrediction}
          onReveal={() => setStage("reveal")}
          onOpenEvidence={() => setStage("evidence")}
          onEvidence={(item) => setSelectedEvidence((current) =>
            current.includes(item)
              ? current.filter((selected) => selected !== item)
              : [...current, item],
          )}
          onLimitChecked={setLimitChecked}
          onComplete={completeComparison}
          completeLabel={stepIndex < mission.steps.length - 1 ? "두 번째 비교로" : missionIndex < missions.length - 1 ? "다음 미션으로" : "기록 보기"}
        />
      )}
      {screen === "final" && (
        <FinalRecord records={records} onRepeat={startMissions} onSafety={() => setScreen("safety")} onRestart={restart} />
      )}

      <AppDialogs
        kind={dialog}
        onClose={() => setDialog(null)}
        onConfirmRestart={() => {
          restart();
          setDialog(null);
        }}
      />
    </div>
  );
}
