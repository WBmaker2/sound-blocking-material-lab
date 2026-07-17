# Elementary Usability Improvement A Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 초등학교 3~4학년 학생이 두 근거를 모두 고르고, 쉬운 말로 결과를 읽고, 모바일에서도 다음 행동을 놓치지 않도록 개선안 A를 구현한다.

**Architecture:** 기존 `SoundLabApp`의 화면 상태 머신과 정적 미션 데이터를 유지한다. 근거 선택 상태만 단일 문자열에서 문자열 배열로 바꾸고, 완료 여부는 현재 미션의 근거 목록에서 파생한다. 표현·결과 순서·오류 색상은 기존 컴포넌트와 CSS 계층 안에서 수정하며 실제 측정값처럼 보이는 새 데이터나 외부 장치를 추가하지 않는다.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, CSS, vinext/Next.js

---

## Task 1: 학생 흐름 회귀 테스트를 먼저 추가한다

**Files:**
- Modify: `tests/app.test.tsx`

- [ ] `enterFirstEvidenceStage()` 테스트 도우미를 추가한다. 첫 미션에서 올바른 한 요소 선택, 예측, 결과 공개까지 실제 버튼을 클릭한다.
- [ ] 두 근거가 체크박스로 보이고 하나만 선택하면 `맞는 근거가 하나 더 있어요.` 안내가 나타나는 테스트를 작성한다.
- [ ] 두 근거와 모형 한계 확인을 모두 마쳐야 `비교 기록하기` 버튼이 활성화되는 테스트를 작성한다.
- [ ] 잘못된 두 요소 선택 카드에는 오류 클래스가 붙고, 표의 변경 행은 성공용 초록색 클래스가 아닌 변경용 클래스를 유지하는 테스트를 작성한다.
- [ ] 결과 화면에 `① 기준 보기 → ② 비교 보기 → ③ 달라진 점 확인` 순서와 모바일 이동 안내가 존재하는 테스트를 작성한다.
- [ ] 쉬운 핵심 용어와 2026-07-18 업데이트 내역을 확인하는 테스트를 작성한다.
- [ ] Run: `npm run test:unit -- tests/app.test.tsx`
  - Expected: 새 요구사항 테스트가 실패한다.

## Task 2: 근거를 모두 고르는 상태와 기록 구조를 구현한다

**Files:**
- Modify: `app/lab/types.ts`
- Modify: `app/components/SoundLabApp.tsx`
- Modify: `app/components/MissionWorkspace.tsx`
- Modify: `app/components/FinalRecord.tsx`

- [ ] `MissionRecord`에 `evidence: string[]`를 추가한다.
- [ ] `SoundLabApp`의 근거 상태를 `selectedEvidence: string[]`로 바꾸고 단계 초기화 시 빈 배열로 되돌린다.
- [ ] 근거 체크는 함수형 상태 갱신으로 토글하고, 현재 단계의 모든 근거가 들어 있는지를 렌더링 중 파생한다.
- [ ] 기록 저장 시 근거 배열의 복사본을 저장한다.
- [ ] 근거 선택 UI를 라디오에서 체크박스로 바꾸고 제목을 `맞는 근거를 모두 찾아요`로 바꾼다.
- [ ] 하나만 골랐을 때 친절한 안내를 보여 주고, 모든 근거와 모형 한계를 확인해야 기록 버튼을 활성화한다.
- [ ] 최종 기록에는 각 비교에서 확인한 두 근거를 읽을 수 있게 표시한다.
- [ ] Run: `npm run test:unit -- tests/app.test.tsx`
  - Expected: 근거 선택 관련 테스트가 통과한다.

## Task 3: 초등학생용 표현과 모형 한계 문장을 적용한다

**Files:**
- Modify: `app/components/StartAndSafety.tsx`
- Modify: `app/components/TutorialScreen.tsx`
- Modify: `app/components/SoundPathDiagram.tsx`
- Modify: `app/components/MissionWorkspace.tsx`
- Modify: `app/components/FinalRecord.tsx`
- Modify: `app/lab/content.ts`

- [ ] `상대 감지 단계`를 `수신기가 받은 소리 단계`로 바꾸고 `이 앱 안에서만 서로 비교하는 단계예요.` 도움말을 붙인다.
- [ ] `시험 신호`, `수치 측정`, `상대 결과`, `한 요소 통제`처럼 교사 중심 표현을 떨림·결과·한 가지만 바꾸기 표현으로 바꾼다.
- [ ] 시작 화면의 안전 확인 세 문장을 각각 한 개념만 담도록 짧게 바꾼다.
- [ ] 근거 단계의 모형 한계 확인은 짧은 체크 문장과 별도 설명으로 나눈다.
- [ ] 최종 기록 도입 문장을 `정답 개수보다, 한 가지만 바꾸고 소리 길을 살핀 과정을 모았어요.`로 바꾼다.
- [ ] `updateHistory` 첫 항목에 2026-07-18 개선 내역을 추가한다.
- [ ] Run: `npm run validate:content`
  - Expected: 금지 표현 없이 콘텐츠 검증이 통과한다.

## Task 4: 오류 상태와 결과 읽기 순서를 시각적으로 구분한다

**Files:**
- Modify: `app/components/SetupComparison.tsx`
- Modify: `app/components/MissionWorkspace.tsx`
- Modify: `app/styles/lab.css`
- Modify: `app/styles/responsive.css`
- Modify: `app/styles/screens.css`

- [ ] 잘못된 두 요소 선택 카드에 별도 오류 클래스를 붙이고 `지금은 2가지가 바뀌었어요.` 문장을 먼저 보여 준다.
- [ ] 비교 표의 변경 행을 주황 계열로 바꿔 성공용 초록과 구별한다.
- [ ] 결과 화면 상단에 세 단계 읽기 순서를 추가하고 두 장치 카드를 `1. 기준 조건`, `2. 비교 조건`으로 표시한다.
- [ ] 첫 카드 다음에 `아래로 내려 비교 조건도 살펴봐요.` 안내를 넣고 작은 화면에서만 보이게 한다.
- [ ] 결과 표 제목을 `받은 소리 결과`, `달라진 결과`로 통일한다.
- [ ] 최종 기록의 근거 열과 가로 스크롤 영역을 모바일에서도 읽을 수 있게 스타일링한다.
- [ ] Run: `npm run test:unit -- tests/app.test.tsx`
  - Expected: 오류 및 읽기 순서 테스트가 통과한다.

## Task 5: 전체 품질 게이트와 실제 브라우저 흐름을 검증한다

**Files:**
- Verify only

- [ ] Run: `npm run typecheck`
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] 개발 서버를 실행하고 데스크톱과 375×812 화면에서 시작→안전→안내→첫 비교→근거 2개→최종 기록 흐름을 확인한다.
- [ ] 브라우저 콘솔 오류, 가로 문서 넘침, 44px 미만 주요 터치 대상이 없는지 확인한다.
- [ ] 변경된 React 파일을 `react-best-practices` 기준으로 다시 검토한다.

## Task 6: 변경 이력과 공개 사이트를 갱신한다

**Files:**
- Verify: `.openai/hosting.json`

- [ ] `git diff --check`와 `git status --short`로 변경 범위를 확인한다.
- [ ] 구현 문서, 테스트, 코드를 하나의 기능 커밋으로 커밋한다.
- [ ] 기존 Sites 프로젝트에 새 버전을 배포한다.
- [ ] 공개 접근 권한을 유지하고 배포 URL의 HTTP 200 및 핵심 새 문구를 확인한다.
- [ ] 최종 보고에 구현 내용, 검증 결과, 커밋, 공개 주소를 함께 남긴다.
