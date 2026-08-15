---
name: prime-context
description: Prime a session with repo, git, and structural context before non-trivial work on list-app. Use at the start of an implementation, debugging, or review task to capture branch/diff state, read the key docs, map the structure, and state a verification plan before editing.
---

# Prime Context

Run this before any non-trivial implementation, debugging, or review work so edits start from an accurate picture of the repo.

> React 19 + TypeScript + Vite single-page app (Tailwind v4 for styling) that lets a user build a grocery list and calls the Gemini API directly from the browser to estimate Woolworths vs Coles prices. No backend — `src/lib/gemini.ts` talks to the Gemini API using a key the user enters and that is stored in `localStorage`. Entry point is `src/main.tsx` → `src/App.tsx`; there is no `CLAUDE.md`, so `README.md` is the primary project doc.

## Gather

- Read `README.md` at the repo root (no `CLAUDE.md` currently exists).
- Capture git context up front:
  - `git status --short --branch`
  - current branch or detached HEAD
  - `git worktree list` (when relevant)
  - `git log --oneline -5`
- Inspect local changes / recent diffs relevant to the task before editing.
- Read `src/index.css` before any styling work — it's just `@import "tailwindcss"`, so styling conventions live in component `className` usage (Tailwind utility classes), not a theme file.
- Map the current structure with `git ls-files src` — components live flat in `src/components/` (`ApiKeyInput.tsx`, `GroceryList.tsx`, `ResultsTable.tsx`), Gemini API integration is isolated in `src/lib/gemini.ts`, and shared types are in `src/types.ts`.
- When the task touches the Gemini integration (`src/lib/gemini.ts`) or the API key flow (`src/components/ApiKeyInput.tsx`), be careful: the API key is user-supplied and stored client-side in `localStorage` — never log it, send it anywhere but the Gemini API, or hardcode a key.
- No deploy/IaC config exists in this repo (no `DEPLOY.md`, no infra folder) — it's a static Vite build (`dist/`).

## Report

Before making edits or stating findings, report:

- repo state and branch / worktree status
- recent change context (what the dirty files and last commits are doing)
- files / docs reviewed
- task-relevant modules or directories
- constraints identified: React 19 + TypeScript strict-ish setup (see `tsconfig.app.json`), Tailwind v4 utility-class styling only (no separate theme/config file to edit), Gemini API key is client-side only and must never be exfiltrated or logged
- a verification plan with narrow checks first

## Verify

There is no test suite in this repo. Verification means:

- `npm run lint` (ESLint via `eslint.config.js`) for code-quality checks
- `npm run dev` and view in the browser to confirm behavior (requires a Gemini API key entered in the app's API key field — get one from [Google AI Studio](https://aistudio.google.com/app/apikey))
- `npm run build` (`tsc -b && vite build`) to confirm the production build and type-check are clean

Run the narrowest applicable check first (lint) before firing up the dev server or doing a full build.
