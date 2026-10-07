---
name: desktop-handoff
description: Hand the current conversation off to a fresh Claude desktop session, offered as a task card the user starts locally or in the cloud.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Write a handoff summary of the current conversation so a fresh agent can continue the work. Instead of saving it, offer it as a new session with the `spawn_task` tool (`mcp__ccd_session__spawn_task`; load it with ToolSearch if only its name is listed):

- `title`: a short imperative name, under 60 characters (e.g. "Fix login bug"). It becomes the card heading and the new session's title.
- `tldr`: one or two plain sentences on what the next session will do.
- `prompt`: the handoff summary.

The user reviews the card and starts it locally (optionally in a fresh worktree) or in the cloud. If `spawn_task` is not available, start a cloud session directly with `create_session` (`mcp__claude-code-remote__create_session`) using the same title and prompt, and give the user the new session's ID.

The new session starts from a fresh checkout and does not see this session's uncommitted work. Before handing off, check `git status`: if there are uncommitted or unpushed changes the next session needs, ask the user whether to commit and push them first. Name the branch to continue on in the summary.

The prompt must stand on its own: use repository-relative paths, never absolute paths from this container, and stay under 32000 characters.

Include a "suggested skills" section in the summary, naming which skills the next agent should call the Skill tool for.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information, since the summary becomes the agent's prompt and is stored and shown on the card.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the summary accordingly.
