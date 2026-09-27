---
title: 'Tasks: Melodex Minimalist Design'
change: melodex-minimalist-design
phase: tasks
date: 2026-03-27
status: in-progress
---

# Tasks: Melodex Minimalist Design

> Change: `melodex-minimalist-design`
> Total tasks: 41 (T0: 5, Slice 1: 6, Slice 2: 10, Slice 3: 8, Slice 4: 5, Slice 5: 7)
> Status: in-progress (T0 ✅, Slice 1 ✅, Slice 2 ✅, Slice 3 ✅, Slice 4 ✅, Slice 5 pending)
> Created: 2026-03-27
> Last apply batch: Slice 4 complete — 2026-09-27

---

## T0: Pre-requisites — shadcn & dependency installs

- [x] **T0.1** [S] Install shadcn `tabs` component

- Command: `npx shadcn@latest add tabs`
- Creates: `src/components/ui/tabs.jsx`, installs `@radix-ui/react-tabs`
- Deps: none

- [x] **T0.2** [S] Install shadcn `select` component

- Command: `npx shadcn@latest add select`
- Creates: `src/components/ui/select.jsx`, installs `@radix-ui/react-select`
- Deps: none

- [x] **T0.3** [S] Install shadcn `badge` component

- Command: `npx shadcn@latest add badge`
- Creates: `src/components/ui/badge.jsx`
- Deps: none

- [x] **T0.4** [S] Install shadcn `separator` component

- Command: `npx shadcn@latest add separator`
- Creates: `src/components/ui/separator.jsx`, installs `@radix-ui/react-separator`
- Deps: none

- [x] **T0.5** [S] Install Tone.js

- Command: `npm install tone`
- Effect: adds `tone` to `package.json`
- Deps: none (was already present at v15.1.22)

---

## Slice 1: Foundation — CSS variables, dark mode, AppLayout, Header ✅ DONE

**T1.1** ✅ [S] Modify `src/index.css` — add melody/harmony tokens + override --primary

- What: In `:root` block add `--melody: 239 84% 67%` (indigo-500) and `--harmony: 263 70% 60%` (violet-400); override `--primary: 239 84% 67%` and `--primary-foreground: 0 0% 100%`. Repeat same additions in `.dark` block.
- Deps: none
- Covers: FR-10.5 (dark mode tokens), FR-10.8 (color token consistency)

**T1.2** ✅ [S] Modify `tailwind.config.js` — add melody and harmony color utilities

- What: In `theme.extend.colors`, add two entries: `melody: 'hsl(var(--melody))'` and `harmony: 'hsl(var(--harmony))'`
- Effect: enables `bg-melody`, `fill-melody`, `text-melody`, `bg-harmony`, etc. as Tailwind classes
- Deps: T1.1
- Covers: FR-10.8 (CSS token usable in Tailwind for SVG fills, backgrounds)

**T1.3** ✅ [S] Modify `src/main.jsx` — add dark class before React mount

- What: Add `document.documentElement.classList.add('dark')` as the FIRST statement before `createRoot(...)` to prevent FOUC
- Deps: T1.1
- Covers: FR-10.5 (dark mode default, prevents flash of light mode)

**T1.4** ✅ [S] Create `src/components/layout/AppLayout.jsx`

- What: Pure layout wrapper; renders `<div className="max-w-[600px] mx-auto px-4 py-6 flex flex-col gap-6">{children}</div>`; no store dependency; accepts `children` prop
- Deps: none
- Covers: FR-10.1 (application container)

**T1.5** ✅ [M] Create `src/components/layout/Header.jsx`

- What: `<header className="h-12 flex items-center justify-between px-4">`; left: "Melodex" text (`font-semibold text-lg`); right: theme toggle `<button>` (`w-11 h-11 flex items-center justify-center rounded-md`) with `<Sun>` or `<Moon>` icon from `lucide-react` (swap based on isDarkMode); reads `isDarkMode` and `toggleDarkMode` directly from `useMelodexStore`
- Deps: T2.6 (store must exist — cross-slice dep)
- Covers: FR-10.2 (header logo + toggle), FR-10.6 (theme toggle behavior), FR-10.7 (44px tap target)

**T1.6** ✅ [M] Modify `src/App.jsx` — replace 9-line placeholder with 3-zone skeleton

- What: Import AppLayout + Header + zone placeholder `<div>`s; read `isDarkMode` from `useMelodexStore`; add `useEffect(() => { document.documentElement.classList.toggle('dark', isDarkMode) }, [isDarkMode])` to sync class on toggle; render `<AppLayout><Header /><div>{/* MelodyInput placeholder */}</div><div>{/* Controls placeholder */}</div><div>{/* Results placeholder */}</div></AppLayout>`
- Deps: T1.4, T1.5, T2.6 (cross-slice)
- Covers: FR-10.5 (dark mode reactive to store toggle)

---

## Slice 2: Engine + Store ✅ DONE

**T2.1** ✅ [S] Create `src/engine/pitchClasses.js`

- What: Export `CHROMATIC_NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']`; export `NOTE_TO_PC` object (17 entries: 12 sharps + 5 flat aliases: Db=1, Eb=3, Gb=6, Ab=8, Bb=10); export `noteToPC(note)` → number|null; export `pcToNote(pc)` → string (sharp preference); export `isValidNote(str)` → boolean
- Deps: none
- Covers: FR-12.1 (pitch class mapping, enharmonic equivalents)

**T2.2** ✅ [S] Create `src/engine/scales.js`

- What: Export `SCALE_PATTERNS = { major: [2,2,1,2,2,2,1], minor: [2,1,2,2,1,2,2] }`; export `generateScale(root, mode)` → string[7] (e.g. C major → ["C","D","E","F","G","A","B"]); export `getScaleDegree(notePC, scaleNotes)` → 0-6 or -1 if not in scale
- Deps: T2.1
- Covers: FR-12.2 (scale generation for all 24 keys)

**T2.3** ✅ [S] Create `src/engine/harmonize.js`

- What: Export `HARMONIZATION_TYPES = { 'thirds-up': {offset:2}, 'thirds-down': {offset:-2}, 'fifths': {offset:4}, 'sixths-up': {offset:5}, 'sixths-down': {offset:-5} }`; internal `harmonizeNote(note, scaleNotes, offset)` uses `((degree + offset) % 7 + 7) % 7` (handles negatives); chromatic notes (degree === -1) return original note unchanged; export `harmonize(melodyNotes, root, mode, type)` → string[] same length as input
- Deps: T2.1, T2.2
- Covers: FR-12.3 (diatonic interval calculation), FR-5.2 (harmonization execution)

**T2.4** ✅ [S] Create `src/engine/chordSuggestions.js`

- What: Stub file with comment: `// TODO v2: chord suggestion engine — deferred from melodex-minimalist-design change`
- Deps: none
- Covers: design decision (establishes file path for v2)

**T2.5** ✅ [S] Modify `src/engine/index.js` — barrel export

- What: Replace 1-line stub with: `export * from './pitchClasses'`, `export * from './scales'`, `export * from './harmonize'` (does NOT export chordSuggestions stub)
- Deps: T2.1, T2.2, T2.3
- Covers: enables `import { harmonize, isValidNote } from '@/engine'`

**T2.6** ✅ [M] Create `src/store/melodexStore.js` — full Zustand v5 store

- What: `export const useMelodexStore = create((set, get) => ({ ... }))` with:
  STATE: `melodyNotes: []`, `inputMode: 'text'`, `selectedKey: 'C'`, `selectedMode: 'major'`, `harmonizationType: 'thirds-up'`, `harmonyNotes: null`, `resultsViewTab: 'table'`, `isPlaying: false`, `playbackMode: null`, `isDarkMode: true`
  ACTIONS: `addNote(note)` (appends + resets harmonyNotes to null), `removeNote(index)` (filters by index + resets harmonyNotes), `removeLastNote()` (slice(0,-1) + resets), `clearMelody()` (empties both), `setInputMode(mode)`, `setSelectedKey(key, mode)` (resets harmonyNotes), `setHarmonizationType(type)` (resets harmonyNotes), `harmonize()` (guards empty, calls engine harmonize(), sets harmonyNotes), `setResultsViewTab(tab)`, `setIsPlaying(isPlaying, playbackMode)`, `toggleDarkMode()`
  KEY INVARIANT: any melody/key/type edit sets harmonyNotes = null
- Deps: T2.3 (imports harmonize from engine)
- Covers: FR-11.1 (state shape), FR-11.2 (inputMode), FR-3.2 (default C major), FR-4.2 (default thirds-up)

**T2.7** ✅ [S] Modify `src/store/index.js` — barrel export

- What: Replace stub with `export { useMelodexStore } from './melodexStore'`
- Deps: T2.6
- Covers: enables `import { useMelodexStore } from '@/store'`

**T2.8** ✅ [M] Create `src/audio/player.js` — Tone.js lazy-init singleton wrapper

- What: Constants: `PIANO_OCTAVE = 4`, `NOTE_DURATION = '8n'`, `NOTE_STEP_SEC = 0.45`; module-level `melodySynth` and `harmonySynth` singletons (null until first use); `getMelodySynth()` creates Tone.Synth with triangle oscillator on demand; `getHarmonySynth()` same but volume -6dB softer; `stopPlayback()` clears pending timeout; exports: `playNote(noteName)` (Tone.start() + triggerAttackRelease), `playMelody(notes, onDone)` (schedules notes at now + i\*0.45s offsets, setTimeout calls onDone), `playBoth(melodyNotes, harmonyNotes, onDone)` (same but both synths), `stopPlayback()`; every export calls `await Tone.start()` first
- Deps: T0.5 (Tone.js installed)
- Covers: FR-8.1 (melody playback), FR-8.2 (AudioContext init on gesture), FR-9.1 (melody+harmony), FR-9.2 (PIANO_OCTAVE=4)

**T2.9** ✅ [S] Modify `src/audio/index.js` — barrel export

- What: Replace stub with `export { playNote, playMelody, playBoth, stopPlayback } from './player'`
- Deps: T2.8

**T2.10** ✅ [S] Modify `src/types/index.js` — JSDoc type definitions

- What: Add JSDoc typedefs: `@typedef {{ note: string, onRemove: () => void }} NoteChipProps`, `@typedef {{ melody: string[], harmony: string[] }} HarmonizationResult`, `@typedef {('thirds-up'|'thirds-down'|'fifths'|'sixths-up'|'sixths-down')} HarmonizationType`
- Deps: none
- Covers: developer ergonomics for pure JS project

---

## Slice 3: Melody Input ✅ DONE

**T3.1** ✅ [S] Create `src/components/melody-input/NoteChip.jsx`

- What: `<div className="flex items-center gap-1 px-3 h-8 rounded-full text-sm bg-indigo-900/50 text-indigo-300">` renders note name + `<button>×</button>` (min 24px); props: `{ note: string, onRemove: () => void }`
- Deps: T1.1 (dark mode CSS)
- Covers: FR-1.2 (chip display), FR-1.3 (× remove button per chip)

**T3.2** ✅ [M] Create `src/components/melody-input/NoteChipsRow.jsx`

- What: Renders two rows: (1) `<div className="flex flex-wrap gap-1.5">` of `<NoteChip>` components; (2) action row with ⌫ Last button (`h-10`, disabled when `melodyNotes.length === 0`) and Clear button (`h-10`, disabled when empty); reads `melodyNotes` from store; calls `removeNote(index)` (with the note's array index), `removeLastNote()`, `clearMelody()`; uses shadcn `<Button variant="outline">`
- Deps: T3.1, T2.6
- Covers: FR-1.2 (chips row layout), FR-1.3 (individual removal), FR-1.4 (⌫ Last disabled when empty), FR-1.5 (Clear All disabled when empty)

**T3.3** ✅ [M] Create `src/components/melody-input/TextInput.jsx`

- What: `<textarea className="w-full min-h-[44px] rounded-md border bg-background px-3 py-2 text-sm resize-none">` with placeholder `"C D E F G A B"`; local `const [inputValue, setInputValue] = useState('')`; `processToken(token)`: if `token.trim()` empty → skip; normalize `token.toUpperCase()`; call `isValidNote(normalized)` → if valid call `store.addNote(normalized)`, either way clear field; `onKeyDown`: if key === ' ' preventDefault + processToken(inputValue); if key === 'Enter' preventDefault + processToken(inputValue); onChange: setInputValue; no error message for invalid (silent discard per FR-1.1)
- Deps: T2.1 (isValidNote), T2.6 (addNote)
- Covers: FR-1.1 (space/enter parsing, case-insensitive, invalid discard, empty discard)

**T3.4** ✅ [M] Create `src/components/piano/PianoKey.jsx`

- What: White key: `<button style={{touchAction:'none'}} className={cn('w-10 h-[110px] border border-slate-600 rounded-b-sm flex-shrink-0 transition-transform duration-75 active:scale-y-95', isMelodyActive && 'bg-indigo-400', isHarmonyActive && !isMelodyActive && 'bg-violet-400', !isMelodyActive && !isHarmonyActive && 'bg-slate-100 dark:bg-slate-200')} onPointerDown={() => onPress(note)} />`; Black key: same but `absolute top-0 w-[26px] h-[68px] z-10 bg-slate-800` (default), active colors `bg-indigo-500` / `bg-violet-500`; `style={{left: \`\${leftPx}px\`, touchAction:'none'}}`; Props: `{ note, isBlack, leftPx, isMelodyActive, isHarmonyActive, onPress }`
- Deps: T1.1
- Covers: FR-2.3 (press animation scale-y-95), FR-2.4 (melody indigo highlight), FR-2.5 (harmony violet highlight)

**T3.5** ✅ [M] Create `src/components/piano/Piano.jsx`

- What: `React.memo` wrapped; declare constants: `WHITE_KEYS = ['C','D','E','F','G','A','B']`, `BLACK_KEYS = [{note:'C#',leftPx:28},{note:'D#',leftPx:68},{note:'F#',leftPx:148},{note:'G#',leftPx:188},{note:'A#',leftPx:228}]`; container: `<div className="overflow-x-auto rounded-md border border-slate-700"><div className="relative flex w-[280px] h-[110px]">`; render white keys as flex row, black keys as absolute overlays; `handleKeyPress(note)`: calls `playNote(note)` from `@/audio` + calls `onKeyPress(note)`; compute `isMelodyActive` by checking if `activeMelodyNotes.includes(note)` (deduped display); Props: `{ activeMelodyNotes: string[], activeHarmonyNotes?: string[], onKeyPress: (note: string) => void }`
- Deps: T3.4, T2.8 (playNote for immediate audio feedback)
- Covers: FR-2.1 (1-octave 280×110 rendering), FR-2.2 (key press adds note), FR-2.4 (melody highlights, deduped), FR-2.5 (harmony highlights)

**T3.6** ✅ [M] Create `src/components/melody-input/InputModeTabs.jsx`

- What: shadcn `<Tabs value={inputMode} onValueChange={setInputMode}>`; two `<TabsTrigger>` values: "text" (label "Text") and "piano" (label "Piano"); Text tab content: `<TextInput />` then `<NoteChipsRow />`; Piano tab content: `<Piano activeMelodyNotes={melodyNotes} activeHarmonyNotes={harmonyNotes ?? []} onKeyPress={addNote} />`; reads `inputMode`, `melodyNotes`, `harmonyNotes`, `setInputMode`, `addNote` from `useMelodexStore`; switching tabs does NOT clear melody (store persists)
- Deps: T0.1 (tabs), T3.2, T3.3, T3.5, T2.6
- Covers: FR-11.2 (tab switching preserves melody), FR-2.4/FR-2.5 (piano sees current state)

**T3.7** ✅ [S] Create `src/components/melody-input/MelodyInputSection.jsx`

- What: `<section className="flex flex-col gap-3">`; section label `<p className="text-xs uppercase tracking-wider text-muted-foreground">Melody Input</p>`; renders `<InputModeTabs />`
- Deps: T3.6
- Covers: FR-10.2 (zone 1 layout wrapper)

**T3.8** ✅ [S] Modify `src/App.jsx` — wire Melody Input zone

- What: Replace melody input placeholder `<div>` with `<MelodyInputSection />`; add import
- Deps: T3.7, T1.6
- Covers: zone 1 wired into app shell

---

## Slice 4: Controls ✅ DONE

**T4.1** ✅ [S] Create `src/components/controls/KeySelector.jsx`

- What: shadcn `<Select value={\`\${selectedKey}-\${selectedMode}\`} onValueChange={...}>`; on change: parse value as `"C-major"`→ call`setSelectedKey('C', 'major')`; display trigger label: `\`\${selectedKey} \${selectedMode === 'major' ? 'Major' : 'Minor'}\``; render two `<SelectGroup>`: "Major" (12 items, values: 'C-major', 'C#-major', ...) and "Minor" (12 items, values: 'C-minor', ...); className: `w-full h-11 sm:w-auto`; reads `selectedKey`, `selectedMode` from store
- Deps: T0.2 (select), T2.6
- Covers: FR-3.1 (24 keys in dropdown), FR-3.2 (default C major displayed), FR-3.3 (no auto-harmonize on change — store action clears harmonyNotes but does not call harmonize())

**T4.2** ✅ [S] Create `src/components/controls/HarmonizationSelector.jsx`

- What: shadcn `<Select value={harmonizationType} onValueChange={setHarmonizationType}>`; 5 options: value='thirds-up' label='3rds up', 'thirds-down'/'3rds down', 'fifths'/'5ths', 'sixths-up'/'6ths up', 'sixths-down'/'6ths down'; className: `w-full h-11 sm:w-auto`; reads `harmonizationType` from store
- Deps: T0.2, T2.6
- Covers: FR-4.1 (5-type dropdown), FR-4.2 (default 3rds up), FR-4.3 (no auto-harmonize)

**T4.3** ✅ [S] Create `src/components/controls/HarmonizeButton.jsx`

- What: shadcn `<Button className="w-full h-12 sm:w-auto sm:h-11" disabled={melodyNotes.length === 0} onClick={harmonize}>Harmonize →</Button>`; reads `melodyNotes.length` and `harmonize` from store; disabled state is both visual and functional (no click when disabled)
- Deps: T2.6
- Covers: FR-5.1 (enabled/disabled state), FR-5.2 (triggers harmonize()), FR-5.3 (empty melody guard)

**T4.4** ✅ [M] Create `src/components/controls/ControlsSection.jsx`

- What: `<section className="flex flex-col gap-3">`; section label `<p className="text-xs uppercase tracking-wider text-muted-foreground">Key & Style</p>`; `<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-col gap-3 sm:flex-row sm:gap-2"><KeySelector /><HarmonizationSelector /></div><HarmonizeButton /></div>`
- Deps: T4.1, T4.2, T4.3
- Covers: FR-10.3 (mobile: stacked full-width), FR-10.4 (desktop: single row)

**T4.5** ✅ [S] Modify `src/App.jsx` — wire Controls zone

- What: Replace controls placeholder `<div>` with `<ControlsSection />`; add import
- Deps: T4.4, T3.8 (previous App.jsx state)
- Covers: zone 2 wired into app shell

---

## Slice 5: Results + Playback

**T5.1** [M] Create `src/components/results/TableView.jsx`

- What: `<div className="overflow-x-hidden"><table className="w-full text-sm border-collapse">`; header `<tr>`: `<th className="text-xs uppercase tracking-wider text-muted-foreground text-left py-2 px-3">` for "#", "Melody", "Harmony"; data rows `<tr className="border-t border-border" style={{minHeight:'44px'}}>`: `<td>{i+1}</td>`, `<td><span className="inline-block w-2 h-2 rounded-full mr-2" style={{background:'hsl(var(--melody))'}} />{note}</td>`, `<td><span ... style={{background:'hsl(var(--harmony))'}} />{note}</td>`; reads `melodyNotes` and `harmonyNotes` from store (non-null guaranteed by parent ResultsSection)
- Deps: T2.6, T1.1
- Covers: FR-6.1 (3-col table, rows min-h-44px, headers text-xs uppercase), FR-6.2 (indigo/violet colored dots)

**T5.2** [M] Create `src/components/results/PianoRoll.jsx`

- What: Constants: `LABEL_W=40`, `COL_W=44`, `ROW_H=24`, `HEADER_H=20`, `NOTE_PADDING=2`; `computeNoteRows(melodyNotes, harmonyNotes)` → deduplicated notes sorted by `noteToPC(b) - noteToPC(a)` (high→low); compute SVG dims: `totalW = LABEL_W + notes.length * COL_W`, `totalH = HEADER_H + noteRows.length * ROW_H`; render: step number `<text>` in header row; note label `<text>` on y-axis; horizontal grid `<line>` per row; melody `<rect fill="hsl(var(--melody))" fillOpacity={0.85} rx={3}>` at correct x/y; harmony `<rect fill="hsl(var(--harmony))" fillOpacity={0.75} rx={3}>`; container `<div className="overflow-x-auto" style={{touchAction:'pan-x'}}>`; reads from store
- Deps: T2.1 (noteToPC), T2.6, T1.2
- Covers: FR-7.1 (SVG structure, dimensions), FR-7.2 (melody indigo layer), FR-7.3 (harmony violet layer), FR-7.4 (touch-action pan-x)

**T5.3** [S] Create `src/components/results/ViewTabs.jsx`

- What: shadcn `<Tabs value={resultsViewTab} onValueChange={setResultsViewTab}>`; two triggers: "table"/"Table" and "roll"/"Piano Roll"; tab content: `<TableView />` or `<PianoRoll />`; full-width trigger row; reads `resultsViewTab` + `setResultsViewTab` from store
- Deps: T0.1, T5.1, T5.2, T2.6
- Covers: view switching between table and piano roll

**T5.4** [M] Create `src/components/playback/PlaybackControls.jsx`

- What: `<div className="flex gap-2">`; button 1 `<Button className="flex-1 h-12">`: when `!isPlaying` shows "▶ Melody", on click → `setIsPlaying(true,'melody')` + `playMelody(melodyNotes, () => setIsPlaying(false))`; button 2 `<Button className="flex-1 h-12">`: when `!isPlaying` shows "▶ Melody + Harmony", on click → `setIsPlaying(true,'both')` + `playBoth(melodyNotes, harmonyNotes, () => setIsPlaying(false))`; when `isPlaying === true`: both buttons show "⏹ Stop" and on click → `stopPlayback()` + `setIsPlaying(false)`; reads `melodyNotes`, `harmonyNotes`, `isPlaying` from store; imports `playMelody`, `playBoth`, `stopPlayback` from `@/audio`
- Deps: T2.6, T2.8 (player via barrel)
- Covers: FR-8.1 (melody playback), FR-8.3 (non-blocking UI, stop button), FR-9.1 (melody+harmony), FR-9.3 (only in results)

**T5.5** [M] Create `src/components/results/ResultsSection.jsx`

- What: Reads `harmonyNotes` from store; if `harmonyNotes === null` → return null (not rendered); first-render detection via `useRef(false)` — on first appearance apply `className="animate-in fade-in slide-in-from-bottom-2"`, subsequent renders no entrance class; renders: `<section>` with label "Results" + `<ViewTabs />` + `<PlaybackControls />`
- Deps: T5.3, T5.4, T2.6
- Covers: FR-5.4 (hidden until first harmonize, fade-in on first appearance, no re-animation on update), FR-9.3 (playback buttons inside results)

**T5.6** [S] Modify `src/App.jsx` — wire Results zone

- What: Replace results placeholder `<div>` with `<ResultsSection />`; add import
- Deps: T5.5, T4.5
- Covers: zone 3 wired; app is functionally complete

**T5.7** [M] Create `src/__tests__/engine.test.js` — unit tests for engine modules

- What: Using Vitest + describe/it/expect; test groups:
  pitchClasses: `noteToPC('C')===0`, `noteToPC('F#')===6`, `noteToPC('Db')===1`, `noteToPC('X')===null`, `isValidNote('A#')===true`, `isValidNote('H')===false`
  scales: `generateScale('C','major')` deep-equals `['C','D','E','F','G','A','B']`; `generateScale('A','minor')` deep-equals `['A','B','C','D','E','F','G']`; `getScaleDegree(noteToPC('E'), generateScale('C','major'))===2`; chromatic note returns -1
  harmonize: `harmonize(['C','D','E','F'],'C','major','thirds-up')` → `['E','F','G','A']`; B in C major thirds-up wraps to 'D'; chromatic `harmonize(['C#'],'C','major','thirds-up')` → `['C#']` (passthrough)
- Deps: T2.1, T2.2, T2.3
- Covers: FR-12.1, FR-12.2, FR-12.3 spec scenarios (noteToPC, scale generation, diatonic intervals, chromatic fallback)

---

## Summary

| Slice                    | Tasks  | Files Created                                                                             | Files Modified                                    |
| ------------------------ | ------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------- |
| T0 Pre-reqs              | 5      | 4 (shadcn CLI)                                                                            | 1 (package.json)                                  |
| Slice 1 Foundation       | 6      | 2 (AppLayout, Header)                                                                     | 3 (index.css, tailwind.config, main.jsx, App.jsx) |
| Slice 2 Engine+Store     | 10     | 7 (pitchClasses, scales, harmonize, chordSuggestions.stub, melodexStore, player, types)   | 3 (engine/index, store/index, audio/index)        |
| Slice 3 Melody Input     | 8      | 7 (NoteChip, NoteChipsRow, TextInput, PianoKey, Piano, InputModeTabs, MelodyInputSection) | 1 (App.jsx)                                       |
| Slice 4 Controls         | 5      | 4 (KeySelector, HarmonizationSelector, HarmonizeButton, ControlsSection)                  | 1 (App.jsx)                                       |
| Slice 5 Results+Playback | 7      | 6 (TableView, PianoRoll, ViewTabs, PlaybackControls, ResultsSection, engine.test.js)      | 1 (App.jsx)                                       |
| **Total**                | **41** | **30**                                                                                    | **10**                                            |

## Recommended Implementation Order

Note cross-slice dependencies that affect build order:

1. **T0 first** — install all CLI deps before any file work
2. **T1.1 → T1.4** can run in parallel (CSS + AppLayout have no cross-deps)
3. **T2.1 → T2.5** sequentially (engine chain: pitchClasses → scales → harmonize → barrel)
4. **T2.6 → T2.7** (store needs engine T2.3)
5. **T1.5 + T1.6** after T2.6 (Header + App.jsx wiring need store)
6. **T2.8 → T2.9** can run alongside engine tasks (Tone.js needs only T0.5)
7. **T3.x** after T2 complete
8. **T4.x** after T3.x (Controls zone can be built independently of Melody Input but wires after)
9. **T5.x** after T4.x (Results depends on store + engine being complete)

## Risks

| Risk                                                                                                                                                      | Task(s)    | Mitigation                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| Header (T1.5) and App.jsx (T1.6) have forward dep on Zustand store (T2.6) — must implement Slice 2 engine+store before finalizing Slice 1 layout          | T1.5, T1.6 | Implement T1.1–T1.4 first (CSS + AppLayout), then do T2.x, then return to T1.5–T1.6                                     |
| Piano (T3.5) needs audio player (T2.8) for key press feedback — T2.8 is in Slice 2                                                                        | T3.5       | Player is placed in Slice 2 (T2.8) to be available for Piano                                                            |
| tailwindcss-animate may not be installed — `animate-in fade-in` classes (used in T5.5) require it                                                         | T5.5       | Check `npm ls tailwindcss-animate`; if missing: `npm install tailwindcss-animate` + add to `tailwind.config.js` plugins |
| shadcn CLI interactive prompts may require `--yes` flag or specific version confirmation                                                                  | T0.1–T0.4  | Use `npx shadcn@latest add <component> --overwrite` if needed; verify components appear in `src/components/ui/`         |
| ResultsSection entrance animation (T5.5): `animate-in` from `tailwindcss-animate` does not re-trigger on prop changes — need useRef to track first render | T5.5       | Use `const hasShown = useRef(false)` — set on first non-null harmonyNotes render; apply className conditionally         |
