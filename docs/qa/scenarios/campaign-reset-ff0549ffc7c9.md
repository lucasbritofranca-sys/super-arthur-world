---
id: campaign-reset
qa_status: untested
owner_task: task_04
last_report: null
---

# Campaign rewards, continuation and reset ownership

This scenario awaits the complete UI/content/persistence assembled by tasks 05–07 and the independent task-08/09 walk. Scoped task-04 Chromium fixtures already exercise the actual simulator/reducer boundary; they do not establish final player or cloud experience.

1. Create solo campaigns in two of the six slots. Choose Hard in one; lowering at the map succeeds, increasing requires a new campaign and active-phase requests cannot change rules.
2. Collect a medallion, reach a checkpoint, collect another and fall into a pit. One current life is spent, only the committed medallion survives, checkpoint timer/mechanics resume and already-earned lives are not restored from an older checkpoint.
3. Collect coins across 100 and complete a five-medallion set. Check one awarded life per unique set; replay never duplicates it. Pick up a power or lose it after a checkpoint, then exit: eligible final form/reserve/inventory persists, with current reward counters and temporary level effects cleared.
4. Start with 99 bonus stars and complete a first exit awarding one star. Play the real symbol stops; close/reopen during the bonus game, continue its remaining cells and verify one life reward per matching line. Replaying the completed exit must not relaunch the threshold reward.
5. Lose the last life in each mode. Easy erases only that phase, Classic the current world, Hard the entire campaign. Renewed lives are committed once before Continue; another occupied slot is unchanged. Relevant sanctuary flags and unique rewards disappear; Classic retains visited entrances while erased shortcuts and secret-network routes relock.
6. Discover the qualifying secret exit, traverse the ten network routes, visit the second secret world, then reset the first secret world in Classic. Its erased edges relock, but the previously visited second entrance remains available.
7. Observe separate 120/150/600 exploration denominators; 149 exits or 599 medallions cannot display 100%. Victory over the final boss ends the short story independently of full exploration. A scoped reset updates the percentage and cannot restore erased exits through cosmetics.

Evidence owner: `.compozy/tasks/super-arthur-world/evidence/task_04/`. Contract: task_04.md's 21 assigned IDs and `docs/qa/campaign-contract.md`. No save/cloud durability or production deployment is claimed by these domain tests.
