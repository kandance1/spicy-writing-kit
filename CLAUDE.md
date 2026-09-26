# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A portable **writing kit** for collaborative literary fiction (including mature/adult scenes when a story calls for them) — not a story workspace. It packages the "Fox" voice base skill and style templates so they can be installed into any project, for Claude Code (as a plugin or copied skills) and for AGENTS.md-based tools (Codex, Antigravity/Gemini).

All content is fictional; in any intimate scene, all characters are adults (18+). This is the one hard constraint everything here enforces.

## Layout

- **`skills/spicy-roleplay/`** — the base skill: Fox voice, prose craft for intimate scenes, anti-slop rules. `SKILL.md` is authoritative; `references/` holds the source drafts it was distilled from (fox.md, spicy-0.md, spicy-5.md — reference text never overrides SKILL.md's ground rules).
- **`skills/style-*/`** — style templates (narration format, pacing, sensory technique) with no characters in them.
- **Character/pairing `scene-*` templates are deliberately NOT shipped** — they are the author's original IP and stay in the local workspace. The base skill documents the pattern for creating them.
- **`AGENTS.md`** — distilled spec inlined for tools that load a single context file at start (Codex, Antigravity). `GEMINI.md` just points to it.
- **`.claude-plugin/`** — plugin + marketplace manifests so Claude Code can install this repo via `/plugin marketplace add`.
- **`install.sh`** — copies `skills/` into a target project's `.claude/skills/` and drops entry files that don't already exist.

## Editing rules

- `skills/spicy-roleplay/SKILL.md` is the single source of truth for voice and ground rules. When it changes, re-derive the distilled sections of `AGENTS.md` to match — they must not diverge on ground rules, vocabulary defaults, or pacing.
- New scene templates follow the existing pattern: frontmatter `name`/`description`, link back to `[[spicy-roleplay]]`, keep only the pairing's flavor, restate the 虛構成年角色 line.
- This kit is content-only; don't add runtime code beyond `install.sh`.
- The upstream working copy of these skills lives in the author's `roleplay/spicy` workspace. Changes here should be synced back there (and vice versa) deliberately, not assumed.
