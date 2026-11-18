# ExamArena BD — Mobile Student Dashboard v1

Status: DESIGN SPEC ONLY; not a deployed feature. Preserve current blue/white identity, existing quiz, academy, BCS planner, books, mock tests and bottom navigation until separately tested.

## Mobile layout (360–430px)
1. Sticky compact header: existing brand, notification, profile. No video buttons.
2. Personalized welcome: exam goal, days remaining, preparation level; prominent “আজকের পড়া শুরু করুন” CTA.
3. Today's study card: target minutes, 3 highest-priority tasks, progress bar, resume reading, revision and mini-test actions.
4. Exam journey: selectable BCS / jobs / admission / school / madrasa / diploma / IELTS. BCS stages Preli → Written → Viva → Recruitment guidance; stages must not promise a job.
5. Interactive book card: syllabus → chapter → lesson → worked examples → previous questions → explanation → practice; bookmarking and chapter completion.
6. Mock test / error notebook: practice by chapter, previous year, timed mock, review mistakes, retake weak topics.
7. Preparation insights: syllabus coverage, accuracy, weak topics, time spent; display only real measured data, no invented user counts or pass rates.
8. Premium preview: explain free versus paid capabilities; do not hide previously free features without approval.
9. Existing fixed bottom navigation remains intact until a separately approved migration.

## Study plan inputs
Goal, exam date or days remaining (including 1–2 days), daily available hours, starting level, completed chapters, target stage. Planner adapts to actual syllabus and available content; for short horizons prioritize high-yield revision and exam tactics, never claim full syllabus coverage.

## Design tokens
Primary #1B62D9; dark #102F69; surface #FFFFFF; page #F4F7FF; text #14264A; muted #5B6D89; border #D9E5F7. Use accessible contrast, Bengali typography, 44px minimum touch targets, reduced-motion support. Avoid large illustration hero above actionable content.

## Implementation order
A. Audit existing index.html sections, BCS planner, persistence, tests and backend connections.
B. Add dashboard markup/styles behind a non-disruptive route or feature flag; reuse existing data rather than duplicate it.
C. Wire planner and chapter progress to actual data, with explicit empty/error/loading states.
D. Test 360/390/430px, Samsung A07 and S23 Ultra, keyboard, sticky header/bottom navigation, refresh, back navigation, every CTA and existing quiz flows.
E. Verify build/tests and live deployment before claiming completion.

## Acceptance criteria
No video UI. No fake metrics. Existing content remains accessible. Dashboard works with no logged-in learner and with no progress data. Mobile controls do not overlap fixed navigation. A user can choose a goal, resume a chapter, complete a daily task and inspect the corresponding progress. Subscription boundaries are explicit and do not misrepresent features.
