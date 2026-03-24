# Spec: Tech Stack Selection & Project Scaffold

## Purpose

Define requirements for initializing the Melodex project scaffold — folder structure, build tooling, linting/formatting, testing infrastructure, and CI pipeline. No application logic or music domain types are in scope.

---

## Requirements

### PSC — Project Scaffold

#### Requirement: PSC-1 — Placeholder Directories

The build system MUST create the following empty placeholder directories under `src/`: `engine/`, `audio/`, `store/`, `types/`, `lib/`, `components/ui/`, and `__tests__/`.

##### Scenario: Directories exist after setup

- GIVEN the project has been scaffolded
- WHEN any of the seven placeholder paths are inspected
- THEN each directory exists under `src/`

#### Requirement: PSC-2 — Entry Points

The project MUST include `index.html` at the root, `src/main.jsx` as the React mount point, and `src/App.jsx` as the application shell.

##### Scenario: App renders from entry points

- GIVEN `index.html`, `src/main.jsx`, and `src/App.jsx` are present
- WHEN `npm run dev` is executed
- THEN the Vite dev server starts and serves the app without errors

#### Requirement: PSC-3 — npm Scripts

`package.json` MUST define scripts: `dev`, `build`, `preview`, `test`, `test:watch`, `lint`, and `format`.

##### Scenario: All scripts are present

- GIVEN a freshly installed project
- WHEN `npm run <script>` is invoked for each of the seven scripts
- THEN each script is recognized by npm without "missing script" errors

---

### BTL — Build Tooling

#### Requirement: BTL-1 — Vite Configuration

`vite.config.js` MUST include: the `@vitejs/plugin-react` plugin, an `@/` path alias resolving to `src/`, and a Vitest `test` block with `environment: 'jsdom'` and `@testing-library/jest-dom` setup.

##### Scenario: Path alias resolves

- GIVEN `vite.config.js` is configured with `@/` alias
- WHEN a source file imports via `@/lib/utils`
- THEN Vite resolves the import without error

##### Scenario: Vitest test environment is jsdom

- GIVEN the Vitest block is configured with `environment: 'jsdom'`
- WHEN a test accesses `document` or `window`
- THEN the test runs without a "not defined" error

#### Requirement: BTL-2 — Production Build

Running `npm run build` MUST produce a `dist/` directory with no build errors.

##### Scenario: Build succeeds

- GIVEN all source files are in place
- WHEN `npm run build` is executed
- THEN the process exits 0 and `dist/` contains at least `index.html`

#### Requirement: BTL-3 — Tailwind CSS & PostCSS

`tailwind.config.js` and `postcss.config.js` MUST be present and correctly configured. Tailwind directives in the global CSS file MUST compile without errors.

##### Scenario: Tailwind classes apply at build time

- GIVEN Tailwind and PostCSS are configured
- WHEN `npm run build` is executed
- THEN the output CSS contains Tailwind utility classes

#### Requirement: BTL-4 — shadcn/ui Initialization

`components.json` MUST be present in the project root. A `cn()` utility MUST exist at `src/lib/utils.js`. The shadcn/ui Button component MUST be importable from `src/components/ui/button.jsx`.

##### Scenario: cn() utility is available

- GIVEN `src/lib/utils.js` exports `cn`
- WHEN a component imports `cn` from `@/lib/utils`
- THEN the import resolves and `cn('a', 'b')` returns a merged class string

##### Scenario: shadcn/ui Button is importable

- GIVEN `src/components/ui/button.jsx` exists
- WHEN it is imported in a source file
- THEN no module resolution error occurs

---

### LNT — Linting & Formatting

#### Requirement: LNT-1 — ESLint v8 Configuration

`.eslintrc.cjs` MUST be present and configure the `react` and `react-hooks` plugins. Test files under `src/__tests__/` MUST have the `jest` environment enabled via an override.

##### Scenario: Lint passes on clean scaffold

- GIVEN `.eslintrc.cjs` is configured
- WHEN `npm run lint` is executed on the initial scaffold
- THEN ESLint exits 0 with no errors or warnings

##### Scenario: Test file globals are recognized

- GIVEN the jest env override targets `src/__tests__/**`
- WHEN a test file uses `describe`, `it`, or `expect`
- THEN ESLint does not report "no-undef" errors

#### Requirement: LNT-2 — Prettier Configuration

`.prettierrc` MUST be present and set: `printWidth: 100`, `singleQuote: true`, `semi: true`, `trailingComma: "es5"`.

##### Scenario: Format command exits cleanly

- GIVEN `.prettierrc` is configured
- WHEN `npm run format` is executed
- THEN Prettier exits 0 and all files conform to the configured style

---

### TST — Testing Infrastructure

#### Requirement: TST-1 — Vitest + RTL Installed

Vitest and `@testing-library/react` MUST be listed in `devDependencies` and resolvable after `npm ci`.

##### Scenario: Test runner resolves dependencies

- GIVEN `npm ci` has completed
- WHEN `npm run test` is executed
- THEN Vitest starts without "Cannot find module" errors

#### Requirement: TST-2 — Smoke Test

`src/__tests__/smoke.test.js` MUST exist and render `<App />` using React Testing Library without throwing.

##### Scenario: Smoke test passes

- GIVEN the scaffold entry points are in place
- WHEN `npm run test` is executed
- THEN the smoke test passes and the suite exits 0

#### Requirement: TST-3 — Coverage Configuration

Vitest MUST be configured with `coverage.provider: 'v8'` so that `npm run test -- --coverage` collects coverage without additional setup.

##### Scenario: Coverage report generates

- GIVEN `coverage.provider` is set to `v8`
- WHEN `npm run test -- --coverage` is executed
- THEN a coverage report is produced with no configuration errors

---

### CI — CI Pipeline

#### Requirement: CI-1 — GitHub Actions Workflow

`.github/workflows/ci.yml` MUST exist and trigger on `push` to all branches and `pull_request` targeting `main`. It MUST use Node.js 20 LTS and execute these steps in order: `npm ci` → `lint` → `test` → `build`, with fail-fast behavior.

##### Scenario: Workflow file is valid YAML

- GIVEN `.github/workflows/ci.yml` is present
- WHEN the file is parsed as YAML
- THEN it is syntactically valid and contains the required trigger and job steps

##### Scenario: CI fails fast on lint error

- GIVEN the CI workflow is configured with fail-fast
- WHEN the lint step exits non-zero
- THEN subsequent steps (test, build) do not execute

#### Requirement: CI-2 — Lockfile Committed

`package-lock.json` MUST be present in the repository root so that `npm ci` can perform a deterministic install.

##### Scenario: npm ci succeeds with lockfile

- GIVEN `package-lock.json` is committed
- WHEN `npm ci` is executed in a clean environment
- THEN all dependencies install without errors and no lockfile mutation occurs

---

## Acceptance Criteria

| ID   | Criterion                                                                    |
|------|------------------------------------------------------------------------------|
| AC-1 | `npm run dev` starts without errors                                          |
| AC-2 | `npm run build` produces `dist/` with no errors                              |
| AC-3 | `npm run test` — all tests pass                                              |
| AC-4 | `npm run lint` — exits 0 with no errors                                      |
| AC-5 | `.github/workflows/ci.yml` exists and is valid YAML                         |
| AC-6 | All placeholder directories exist under `src/`                               |
| AC-7 | `src/components/ui/button.jsx` is importable without errors                  |
| AC-8 | `package-lock.json` is present in the repository root                        |
