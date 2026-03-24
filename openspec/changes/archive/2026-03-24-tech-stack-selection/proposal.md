# Proposal: Tech Stack Selection & Project Scaffold

## Intent

Establish the foundational technology stack and initialize the project scaffold for Melodex — a browser-based music composition tool. The project is greenfield, so this change sets the baseline that all future features will build upon. The goal is to choose tools that support a rich audio/interactive UI while keeping the stack lean and maintainable for MVP scope.

## Scope

### In Scope
- Project initialization with `npm create vite@latest . -- --template react`
- Install all production dependencies: React 18, Tone.js, Tailwind CSS, shadcn/ui, Zustand
- Install all dev dependencies: Vitest, React Testing Library, ESLint v8, Prettier
- Configure Vite with `@/src` path alias
- Configure `jsconfig.json` for editor path alias support
- Configure Tailwind CSS + PostCSS pipeline
- Initialize shadcn/ui (`components.json`, `cn()` utility in `src/lib/utils.js`)
- Configure ESLint v8 + Prettier (`.eslintrc.cjs`, `.prettierrc`)
- Configure Vitest co-located in `vite.config.js`
- Create placeholder directories: `src/engine/`, `src/audio/`, `src/store/`, `src/types/`, `src/lib/`, `src/components/ui/`
- Set up GitHub Actions CI workflow (install → lint → test → build, fail-fast)
- Write a smoke test to verify the scaffold is wired correctly

### Out of Scope
- Any application feature implementation (engine, audio logic, UI components)
- Zustand store shape or field definitions
- Music domain types or utilities
- TypeScript migration or flat ESLint config (v9)
- Piano Roll or any other complex widget

## Approach

Bootstrap a Vite + React 18 project using vanilla JavaScript (no TypeScript). Install and configure all chosen libraries up-front so every subsequent change starts from a clean, consistent foundation. Use JSDoc annotations for documentation in lieu of TypeScript types. Manual shadcn/ui initialization is required because the v4 CLI is fully interactive and cannot be scripted.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `/` (root) | New | `package.json`, `vite.config.js`, `jsconfig.json`, `.eslintrc.cjs`, `.prettierrc`, `tailwind.config.js`, `postcss.config.js`, `components.json` |
| `src/` | New | React entry point, App shell, global CSS with Tailwind directives |
| `src/lib/` | New | `utils.js` with `cn()` helper (shadcn/ui requirement) |
| `src/engine/` | New | Placeholder directory (populated by future changes) |
| `src/audio/` | New | Placeholder directory |
| `src/store/` | New | Placeholder directory |
| `src/types/` | New | Placeholder directory |
| `src/components/ui/` | New | Placeholder directory for shadcn/ui components |
| `.github/workflows/ci.yml` | New | GitHub Actions CI pipeline |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Tone.js AudioContext blocked until user gesture | High | Call `Tone.start()` on first user interaction; document this constraint |
| shadcn/ui v4 CLI is fully interactive (not scriptable) | High | Perform manual setup: create `components.json` and `cn()` utility by hand |
| Piano Roll is a fully custom widget (no library) | Med | Deferred to a dedicated future change; placeholder directory only for now |
| Tailwind v4 alpha instability | Low | Pin to Tailwind v3 (stable); migrate to v4 when it reaches GA |

## Rollback Plan

This is a greenfield project. To roll back: delete the project directory entirely. No existing system is affected.

## Dependencies

- Node.js ≥ 18 (LTS) must be installed on the development machine and CI runner
- GitHub repository must exist for the Actions workflow to run

## Success Criteria

- [ ] `npm install` completes with no errors
- [ ] `npm run dev` starts the Vite dev server and renders the app in the browser
- [ ] `npm run lint` passes with no errors
- [ ] `npm run test` runs and the smoke test passes
- [ ] `npm run build` produces a valid `dist/` bundle
- [ ] GitHub Actions CI workflow runs end-to-end on push and all steps pass
