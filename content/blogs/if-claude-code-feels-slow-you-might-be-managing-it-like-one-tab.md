---
title: "If Claude Code Feels Slow, You Might Be Managing It Like One Tab"
slug: "if-claude-code-feels-slow-you-might-be-managing-it-like-one-tab"
description: "Claude Code starts feeling much faster when you stop treating it like a single tab. Notifications, parallel worktrees, and Unix-style prompt usage can turn it into a more scalable daily development workflow."
thumbnail: "/blog-thumbnails/claude-code-parallel-workflows.png"
tags:
  - "AI"
  - "Claude Code"
  - "Developer Tools"
  - "Productivity"
featured: false
draft: false
created_at: "2026-04-23T00:00:00+05:30"
updated_at: "2026-04-23T00:00:00+05:30"
---

If you think Claude Code is slow, it might just be because you are managing it like it is one browser tab.

I used to do the same thing.

Run one session. Wait. Switch tabs. Come back. Repeat.

That workflow works, but it does not scale very well.

For me, three things changed how useful Claude Code felt on a daily basis:

- Notifications.
- Parallel sessions using worktrees.
- Using it as a Unix-style utility.

If you use Claude Code regularly, this setup might be worth trying.

## 1. Set Up Notification Hooks

The first change is simple.

Open `~/.claude/settings.json` and set up a notification hook that calls your native notification command.

This way, you get notified when Claude finishes, needs permission, or is waiting for input.

By default, the hook can fire across notification types. If you only want it to fire for specific events, set the `matcher` field to one of these values:

- `permission_prompt`
- `idle_prompt`
- `auth_success`
- `elicitation_dialog`

That small change removes a lot of unnecessary checking.

Instead of constantly switching back to see whether Claude is done, you can let the system tell you when your attention is needed.

## 2. Run Parallel Sessions With Worktrees

The second change is bigger.

Instead of one Claude instance doing one task, you can spin up multiple isolated sessions.

One can work on a feature. Another can fix a bug. Another can review code.

Each session runs in its own worktree, so the changes stay isolated while still sharing the same repository history.

```bash
claude --worktree feature-auth
claude --worktree bugfix-123
```

A few underrated details make this even more useful:

- Worktrees share repo history but keep changes isolated.
- You can auto-copy files like `.env` using a `.worktreeinclude` file.
- Claude can clean up unused worktrees for you.
- Subagents can also run in parallel with their own worktrees.

This changes the mental model.

Claude Code stops being one long-running assistant and starts feeling more like a small pool of focused workers, each operating in its own lane.

## 3. Use Claude Code as a Unix-Style Utility

The third shift is using Claude Code in places where you would normally use a script, linter, or review command.

For example, suppose you want a lightweight typo reviewer for changes against `main`.

You can wire something like this into your package scripts:

```json
{
  "scripts": {
    "lint:claude": "claude -p 'you are a linter. please look at the changes vs. main and report any issues related to typos. report the filename and line number on one line, and a description of the issue on the second line. do not return any other text.'"
  }
}
```

This is not a replacement for deterministic tooling.

But it is useful for fuzzy checks where an LLM is actually good: awkward copy, typos, unclear wording, suspicious diffs, or code review passes that need judgment rather than strict rules.

The important part is to make the output constrained.

Tell it what role it is playing, what scope to inspect, and exactly what format to return.

## The Real Shift Is Mental

The biggest shift was not technical.

It was mental.

If you manage Claude Code like one tab, it will feel like one tab. You wait on it, check on it, and context-switch around it.

But once you add notifications, isolate parallel work with worktrees, and start calling it like a command-line utility, the workflow changes.

You stop waiting on one session.

You start scaling the way you use it.

So the real question is:

Are you still running one Claude session at a time, or have you started scaling it like this?
