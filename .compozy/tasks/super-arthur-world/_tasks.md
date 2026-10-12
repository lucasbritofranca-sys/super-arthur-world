---
schema_version: "compozy.tasks/v2"
workflow: super-arthur-world
graph:
  nodes:
    - id: task_01
      file: task_01.md
    - id: task_02
      file: task_02.md
    - id: task_03
      file: task_03.md
    - id: task_04
      file: task_04.md
    - id: task_05
      file: task_05.md
    - id: task_06
      file: task_06.md
    - id: task_07
      file: task_07.md
    - id: task_08
      file: task_08.md
    - id: task_09
      file: task_09.md
  edges:
    - from: task_01
      to: task_02
    - from: task_02
      to: task_03
    - from: task_03
      to: task_04
    - from: task_04
      to: task_05
    - from: task_04
      to: task_06
    - from: task_05
      to: task_07
    - from: task_06
      to: task_07
    - from: task_07
      to: task_08
    - from: task_08
      to: task_09
---

# Super Arthur World Task List

## MVP Boundary

Tasks 01–07 implement the entire confirmed PRD: all required mechanical families, 120 original levels, 12 worlds, six solo slots, three penalty modes, guest and optional Google account continuation. Tasks 08–09 prepare independent QA, execute it, correct failures and verify publication. No required content or behavior is deferred; no post-MVP scope is proposed. Multiplayer, copied Nintendo content, enterprise infrastructure and Compozy execution runtime remain outside scope.

This is an execution manifest for native Codex App delegation. User authorization for autonomous implementation, commits, push, integrations and deployment persists in AGENTS.md; no new approval loop is introduced. Complete the authoring audit of PRD, TechSpec, test contract and this task package before starting code. Actual platform authentication/provider access blockers remain concrete external dependencies, not a reason to omit account requirements or stall core tasks.

## Canonical Graph

The frontmatter graph is the sole authoritative dependency store. The table's Dependencies column is a read-only rendering of those edges, not a second editable graph. An edge requires verified completion before the consumer starts; root coordinates serialized fixes to shared contracts. Task 05 and task 06 may run concurrently after task 04, with bounded persistence-versus-content file ownership. They join at task 07.

| # | Title | Status | Complexity | Dependencies |
|---|---|---|---|---|
| 01 | [Browser Foundation, Shared Contracts and Input Adapters](task_01.md) | completed | high | - |
| 02 | [Deterministic Terrain, Traversal and Collision Gate](task_02.md) | completed | critical | task_01 |
| 03 | [Forms, Mounts, Objects, Combat and Boss Mechanics](task_03.md) | completed | critical | task_02 |
| 04 | [Campaign Progression, Rewards and Scoped Reset Reducers](task_04.md) | pending | critical | task_03 |
| 05 | [Transactional Saves, Google Accounts and Dedicated Integrations](task_05.md) | pending | critical | task_04 |
| 06 | [Original Assets and the Complete 120-Level Campaign](task_06.md) | pending | high | task_04 |
| 07 | [Complete Browser Experience, Accessibility and Integration Remediation](task_07.md) | pending | critical | task_05, task_06 |
| 08 | [QA Plan and Session Charters](task_08.md) | pending | high | task_07 |
| 09 | [Real-User QA Execution and Verified Publication](task_09.md) | pending | critical | task_08 |

## Types and Ownership

| Task | Type | Scope boundary | Assigned cases |
|---|---|---|---|
| task_01 | frontend | Browser Foundation, Shared Contracts and Input Adapters | 7 |
| task_02 | frontend | Deterministic Terrain, Traversal and Collision Gate | 18 |
| task_03 | frontend | Forms, Mounts, Objects, Combat and Boss Mechanics | 27 |
| task_04 | frontend | Campaign Progression, Rewards and Scoped Reset Reducers | 21 |
| task_05 | backend | Transactional Saves, Google Accounts and Dedicated Integrations | 43 |
| task_06 | frontend | Original Assets and the Complete 120-Level Campaign | 5 |
| task_07 | frontend | Complete Browser Experience, Accessibility and Integration Remediation | 28 |
| task_08 | qa-report | QA Plan and Session Charters | 0 |
| task_09 | qa-execution | Real-User QA Execution and Verified Publication | 4 |

There are 153 unique canonical cases: 65 unit, 73 integration and 15 end-to-end. Each belongs to exactly one task's Tests section. All complete public browser journeys belong to integration task 07, which joins saves and full content; earlier slices use real participating components in small fixtures. QA task 08 validates planning documents; task 09 owns release/report guards and reruns existing suites without duplicating ownership.

## Execution and Evidence

- Read all canonical artifacts and related ADRs before each slice; use cy-execute-task and cy-final-verify adapted to native Codex delegation.
- Task 02 must pass the base terrain/cadence gate; task 03 adds real growth/mount/flight and interaction coverage. Their combined gate must pass before task 06 expands the campaign. A failing gate triggers repair/reconsideration, never mechanical scope deletion.
- Keep one authoritative gameplay position writer in src/core; src/game adapts Phaser presentation, src/input samples hardware, src/persistence owns transactional I/O, and UI uses commands/view models.
- Each implementing agent receives bounded paths. A different agent reviews it; separate correction agents address findings and rerun affected evidence. Contract changes are coordinated serially, including during the parallel 05/06 wave.
- Use locked pnpm commands and ordinary browser/Supabase/GitHub/Vercel tools. Imported runtime-specific CLI/UDS/config.toml/model-router and absent QA/browser skills do not become dependencies.
- Maintain docs/qa/journeys, scenarios, charters, bugs and dated reports. Task 08 plans actual public journeys; task 09 executes independent native Playwright/browser QA with recorded browser/device/auth scope.
- Dedicated Supabase US$0 Free resource/provider access may be blocked; guest/core work continues. Missing real Google credentials is not a passed account flow and blocks full-scope release eligibility.
- Relevant unresolved bugs block deployment. Publish the verified revision only, then verify the actual Vercel URL/build identity through guest and account smoke; existing user authorization covers these actions.

## Authoring Audit

Check gap-free files/frontmatter, graph acyclicity, bounded ownership, every template section, all ADR links, every canonical test exactly once in Tests, no fabricated .resources checkout, no orphan scope and the trailing qa-report/high + qa-execution/critical pair. This document claims planning coverage only; no game test, resource provisioning or deploy has occurred merely because a task is listed.
