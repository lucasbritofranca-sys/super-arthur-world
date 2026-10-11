# Compozy skills for Super Arthur World

Installed on 2026-10-11 into `.agents/skills/` using the Codex skill-installer helper. Only skill folders and their bundled resources were installed; no Compozy runtime was installed.

Source repository: https://github.com/compozy/compozy

Requested source directory: https://github.com/compozy/compozy/tree/main/.agents/skills

Pinned revision: `c9965f022bd4460b104b4cea996da995c093abcd`

Pinned directory: https://github.com/compozy/compozy/tree/c9965f022bd4460b104b4cea996da995c093abcd/.agents/skills

The pinned repository's MIT license and copyright notice are preserved in [docs/licenses/compozy.txt](licenses/compozy.txt), verified against its `LICENSE` at that revision.

## Why this revision

Current `main` no longer contains `cy-create-prd` and `cy-create-techspec`. Commit `d5ff80056f55abe9ea1266e9cd336294a7a6e861` unified them into `cy-create-spec` on 2026-08-15. The pinned revision is its first parent and preserves the separate interviews requested by the user. `cy-create-techpsec` in the request is interpreted as `cy-create-techspec`.

The complete selected workflow comes from the same revision to avoid mixing separate-spec and unified-spec contracts.

## Installed skills

- cy-create-prd
- cy-create-techspec
- cy-create-tasks
- cy-execute-task
- cy-final-verify
- cy-fix-reviews
- cy-loop-tasks
- cy-review-round
- cy-spec-peer-review
- cy-spec-preflight
- cy-tasks-tail-qa-pair
- cy-web-docs-impact
- cy-workflow-memory
- deep-review

## Codex adaptation

Upstream files are preserved. Project instructions in `AGENTS.md` override Compozy runtime assumptions: use Codex App subagents for execution, independent review and fixes. Do not install Compozy, Herdr or runtime-specific model tooling. Preserve the document contracts, interviews, dependency graph, traceability and validation requirements.

Local skills are available on the next turn; if discovery does not refresh, reopen the project or restart Codex.

Official discovery documentation: https://learn.chatgpt.com/docs/build-skills

## Integration verification

Supabase project listing, Vercel team listing and GitHub authenticated profile retrieval succeeded on 2026-10-11 through the connected integrations. The interviews selected a dedicated Free Supabase project in the existing organization and a public `super-arthur-world` repository. Game-specific provisioning and migrations remain pending. The advertised Supabase cost/confirmation tools returned UNAVAILABLE; a separate dashboard login is being used as a provisioning fallback, without inventing a successful creation.

Official MCP references:

- https://supabase.com/docs/guides/ai-tools/mcp
- https://vercel.com/docs/agent-resources/vercel-mcp

The connected integrations provide platform access in this chat; no duplicate project MCP configuration was added.
