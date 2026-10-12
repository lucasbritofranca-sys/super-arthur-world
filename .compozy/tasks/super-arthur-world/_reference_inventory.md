# Reference coverage inventory

Date: 2026-10-11. This is a scope/audit ledger, not proof of exhaustive fidelity. The PRD's M-01–M-16 rows are required coverage and its user overrides take precedence.

## Primary inputs

- R-01: [Nintendo original manual, 32 pages](https://www.nintendo.co.jp/clvs/manuals/common/pdf/CLV-P-SAAAE.pdf), visually inspectable primary source. It explicitly leaves some surprises undisclosed.
- R-02: [Nintendo condensed manual, 11 pages](https://www.nintendo.com/es-es/games/oms/snes-classic/manuals/super-mario-world/manual.pdf), searchable controls and high-level rules.
- R-03: User's interview answers in `_idea.md`, binding for this game's adaptations.

## Confidence and ownership

| PRD family | Current evidence | Required next verification | Stories |
|---|---|---|---|
| M-01 | R-02 actions; tuning not specified | Verify variable height, spin/bounce and collision interactions | US-007, US-020 |
| M-02 | R-02 slope and triangle actions | Verify entry conditions and corner behavior | US-008 |
| M-03 | R-02 water actions | Verify carried-object/transition behavior | US-009 |
| M-04 | R-02 climb/fence actions | Verify side changes and attack boundaries | US-010 |
| M-05 | R-02 traversal/camera actions | Audit vertical/scrolling cases | US-011, US-019 |
| M-06 | R-01/R-02 power/reserve families | Specify damage, timers and simultaneous events | US-012, US-013 |
| M-07 | R-02 flight actions | Measure or justify movement defaults against quality references | US-014 |
| M-08 | R-01/R-02 mount families | Audit target eligibility and variant combinations | US-015 |
| M-09 | R-01/R-02 object actions | Audit ownership, timers and required-item recovery | US-016 |
| M-10 | R-01 block/switch families | Audit variants, timing and materialization | US-017, US-018 |
| M-11 | Coverage targets awaiting detailed reference evidence | Verify platform/environment variants; write original behavior contracts | US-019 |
| M-12 | Coverage targets, not an exhaustive original enemy census | Verify attack × enemy matrix with reproducible examples | US-020 |
| M-13 | Coverage targets, not proof of original boss parity | Verify named arena/attack families and original equivalent design | US-021 |
| M-14 | R-01/R-02 reward/HUD/bonus families | Resolve score chains and unusual reward interactions | US-022–US-024 |
| M-15 | R-01/R-02 checkpoint/exit families; R-03 overrides | Validate own checkpoint/death/reset contracts | US-025–US-028 |
| M-16 | R-01 map/secret/switch families; cosmetic target requires audit | Validate exact graph and cosmetic-only transformation | US-028, US-029, US-031 |

## Explicit adaptations

Single-player only; original identity/content; Brazilian fantasy and restrained art; 24 levels; three difficulty profiles and selected Game Over scopes; checkpoints in every mode; six slots; optional account synchronization; accumulation of special collectibles; 100% includes those collectibles; autosave at checkpoint/exit and manual conflict choice. Do not treat differences here as accidental reference bugs.

## Audit completion contract

During Techspec research, add source/repository revision and reproducible example for uncertain interactions, then map each required family to its specific behavior contracts and owning tests/tasks. Source evidence and an author-chosen equivalent are different categories. If legal reference gameplay evidence is unavailable, disclose that measurement limitation and validate the explicitly specified original behavior; do not pretend a video or original game was inspected.

Do not obtain or distribute game ROMs/assets to fill this ledger. Original art/music/levels are already selected. No testing claim can establish complete fidelity merely from the current manuals or this table.
