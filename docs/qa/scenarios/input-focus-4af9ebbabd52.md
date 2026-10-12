---
id: input-focus
qa_status: untested
content_source: task_01 foundation
tests: [IT-004, IT-006, IT-007]
---
# Input interruption

Open the preparation app and intentionally start. Hold keyboard Right, blur/refocus, Resume; Right must remain clear until fresh keydown. Repeat using active gamepad jump then disconnect; expect paused/empty input. Hold touch Right, cancel pointer and rotate; expect clear action and retained pause. Test bridge may supply hardware samples only, never gameplay outcomes. Task-01 automated evidence belongs under `.compozy/tasks/super-arthur-world/evidence/task_01/`; independent QA records its own dated verdict later. Real mobile/gamepad hardware remains separate from injected browser samples.
