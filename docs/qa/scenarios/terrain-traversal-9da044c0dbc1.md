---
id: terrain-traversal
qa_status: untested
content_source: task_02 deterministic terrain arena
tests: [UT-006, UT-007, UT-008, UT-009, UT-010, UT-011, UT-012, UT-013, UT-014, UT-027, UT-049, UT-050, UT-056, UT-057, UT-062, IT-008, IT-013, IT-023]
---
# Terrain traversal and safe movement

Start the actual arena, walk and run across the two slopes, jump with short and long holds, spin, crouch/slide downhill and verify the camera follows without moving the actor. Enter water without new jump edges; swim, leave and repeat. Climb rope/vine/fence, detach by jump, change fence side at a gate and repeat action edges during its lock. Enter a directional pipe/door with the permitted key descriptor and verify one actor, destination support, inventory and camera.

Run the authored small fixtures for top-only upward/downward crossing, underside and high-face slopes, full-cycle moving/falling/guided/rotating/balance carries, fast swept surfaces, opposing crushers and a lift into a ceiling. A lethal crush produces one UUID event and stops further movement. Invalid/embedded spawn/transfer geometry must fail before gameplay. Safe restarts restore supported geometry and use distinct attempt event identities. Repeat the same fixed input trace at 30/60/120 render rates, including bounded 250ms stalls.

Scoped task-02 automated evidence lives under `.compozy/tasks/super-arthur-world/evidence/task_02/`. Hardware injection and test fixture loading do not replace the simulation, solver, platform system, transfers or Phaser camera. Desktop keyboard and emulated-mobile touch journeys are real renderer checks; physical devices and complete-game combinations remain independent QA. Forms, mount/flight and combat extend the collision gate in task 03 before content authoring. The QA status remains untested for the task-08/09 independent scenario verdict.
