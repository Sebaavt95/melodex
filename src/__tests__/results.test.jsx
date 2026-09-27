/**
 * Slice 5 component tests — Results + Playback (TDD: RED phase first)
 * Tests for: TableView, PianoRoll, ViewTabs, PlaybackControls, ResultsSection
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ─── Audio mock ───────────────────────────────────────────────────────────────
const mockPlayMelody = vi.fn();
const mockPlayBoth = vi.fn();
const mockStopPlayback = vi.fn();

vi.mock('@/audio', () => ({
  playMelody: (...args) => mockPlayMelody(...args),
  playBoth: (...args) => mockPlayBoth(...args),
  stopPlayback: (...args) => mockStopPlayback(...args),
}));

// ─── Store mock helpers ───────────────────────────────────────────────────────

const makeStore = (overrides = {}) => ({
  melodyNotes: ['C', 'D', 'E'],
  harmonyNotes: ['E', 'F', 'G'],
  resultsViewTab: 'table',
  isPlaying: false,
  playbackMode: null,
  setResultsViewTab: vi.fn(),
  setIsPlaying: vi.fn(),
  ...overrides,
});

let storeState = makeStore();

vi.mock('@/store', () => ({
  useMelodexStore: (selector) => selector(storeState),
}));

// Lazy imports after mocks
const { default: TableView } = await import('../components/results/TableView');
const { default: PianoRoll } = await import('../components/results/PianoRoll');
const { default: ViewTabs } = await import('../components/results/ViewTabs');
const { default: PlaybackControls } = await import('../components/playback/PlaybackControls');
const { default: ResultsSection } = await import('../components/results/ResultsSection');

// ─── Helper: reset store state before each test ───────────────────────────────
beforeEach(() => {
  storeState = makeStore();
  vi.clearAllMocks();
});

// =============================================================================
// T5.1 — TableView
// =============================================================================
describe('TableView', () => {
  it('renders a table with 3 columns: #, Melody, Harmony', () => {
    render(<TableView />);
    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Melody')).toBeInTheDocument();
    expect(screen.getByText('Harmony')).toBeInTheDocument();
  });

  it('renders one row per note pair', () => {
    render(<TableView />);
    // 3 pairs: C/E, D/F, E/G → rows with index 1, 2, 3
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders melody notes in the table', () => {
    render(<TableView />);
    // Melody notes: C, D, E — but these appear once each in text
    // Use getAllByText to handle duplicates (E is in both melody and harmony)
    const cCells = screen.getAllByText('C');
    expect(cCells.length).toBeGreaterThanOrEqual(1);
    const dCells = screen.getAllByText('D');
    expect(dCells.length).toBeGreaterThanOrEqual(1);
  });

  it('renders harmony notes in the table', () => {
    render(<TableView />);
    // Harmony notes: E, F, G — F and G are unique to harmony
    expect(screen.getByText('F')).toBeInTheDocument();
    expect(screen.getByText('G')).toBeInTheDocument();
  });

  it('renders correct row count matching melodyNotes length', () => {
    storeState = makeStore({ melodyNotes: ['C', 'D'], harmonyNotes: ['E', 'F'] });
    render(<TableView />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
  });

  it('renders colored melody dot (inline style with --melody)', () => {
    const { container } = render(<TableView />);
    // Check for inline style containing --melody
    const dots = container.querySelectorAll('span[style*="--melody"]');
    expect(dots.length).toBeGreaterThanOrEqual(1);
  });

  it('renders colored harmony dot (inline style with --harmony)', () => {
    const { container } = render(<TableView />);
    const dots = container.querySelectorAll('span[style*="--harmony"]');
    expect(dots.length).toBeGreaterThanOrEqual(1);
  });
});

// =============================================================================
// T5.2 — PianoRoll
// =============================================================================
describe('PianoRoll', () => {
  it('renders an SVG element', () => {
    const { container } = render(<PianoRoll />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders a container with overflow-x-auto', () => {
    const { container } = render(<PianoRoll />);
    // The outer div should have overflow-x-auto
    const scrollContainer = container.querySelector('[class*="overflow-x-auto"]');
    expect(scrollContainer).toBeInTheDocument();
  });

  it('renders melody note rects with fill referencing --melody', () => {
    const { container } = render(<PianoRoll />);
    const rects = container.querySelectorAll('rect[fill*="--melody"]');
    // Should have 3 melody rects for 3 notes
    expect(rects.length).toBe(3);
  });

  it('renders harmony note rects with fill referencing --harmony', () => {
    const { container } = render(<PianoRoll />);
    const rects = container.querySelectorAll('rect[fill*="--harmony"]');
    expect(rects.length).toBe(3);
  });

  it('renders step number labels in the header row', () => {
    render(<PianoRoll />);
    // Step numbers 1, 2, 3 for 3-note melody
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders note label texts on y-axis', () => {
    render(<PianoRoll />);
    // The deduped note set from ['C','D','E'] melody + ['E','F','G'] harmony
    // = unique notes: C, D, E, F, G — all should appear as labels
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument();
    expect(screen.getByText('G')).toBeInTheDocument();
  });

  it('has touch-action pan-x on container', () => {
    const { container } = render(<PianoRoll />);
    // The outer div wrapping the SVG must have touchAction pan-x (set via style prop)
    const scrollContainer = container.querySelector('div');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer.style.touchAction).toBe('pan-x');
  });
});

// =============================================================================
// T5.3 — ViewTabs
// =============================================================================
describe('ViewTabs', () => {
  it('renders "Table" tab trigger', () => {
    render(<ViewTabs />);
    expect(screen.getByRole('tab', { name: /table/i })).toBeInTheDocument();
  });

  it('renders "Piano Roll" tab trigger', () => {
    render(<ViewTabs />);
    expect(screen.getByRole('tab', { name: /piano roll/i })).toBeInTheDocument();
  });

  it('shows table tab content when resultsViewTab is "table"', () => {
    storeState = makeStore({ resultsViewTab: 'table' });
    render(<ViewTabs />);
    // TableView renders the # header
    expect(screen.getByText('#')).toBeInTheDocument();
  });

  it('shows piano roll content when resultsViewTab is "roll"', () => {
    storeState = makeStore({ resultsViewTab: 'roll' });
    const { container } = render(<ViewTabs />);
    // PianoRoll renders an SVG
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('calls setResultsViewTab when a tab trigger is clicked', async () => {
    const user = userEvent.setup();
    storeState = makeStore({ resultsViewTab: 'table' });
    render(<ViewTabs />);
    await user.click(screen.getByRole('tab', { name: /piano roll/i }));
    expect(storeState.setResultsViewTab).toHaveBeenCalledWith('roll');
  });
});

// =============================================================================
// T5.4 — PlaybackControls
// =============================================================================
describe('PlaybackControls', () => {
  it('renders "▶ Melody" button when not playing', () => {
    render(<PlaybackControls />);
    // Both buttons exist — at least one contains "Melody"
    const buttons = screen.getAllByRole('button');
    const melodyBtn = buttons.find(
      (b) => b.textContent.trim() === '▶ Melody',
    );
    expect(melodyBtn).toBeInTheDocument();
  });

  it('renders "▶ Melody + Harmony" button when not playing', () => {
    render(<PlaybackControls />);
    const buttons = screen.getAllByRole('button');
    const bothBtn = buttons.find((b) => b.textContent.includes('Harmony'));
    expect(bothBtn).toBeInTheDocument();
  });

  it('calls setIsPlaying and playMelody when ▶ Melody is clicked', async () => {
    const user = userEvent.setup();
    render(<PlaybackControls />);
    // Find the "▶ Melody" button specifically (not the "▶ Melody + Harmony" one)
    const buttons = screen.getAllByRole('button');
    const melodyBtn = buttons.find(
      (b) => b.textContent.includes('Melody') && !b.textContent.includes('Harmony'),
    );
    await user.click(melodyBtn);
    expect(storeState.setIsPlaying).toHaveBeenCalledWith(true, 'melody');
    expect(mockPlayMelody).toHaveBeenCalledWith(storeState.melodyNotes, expect.any(Function));
  });

  it('calls setIsPlaying and playBoth when ▶ Melody + Harmony is clicked', async () => {
    const user = userEvent.setup();
    render(<PlaybackControls />);
    const buttons = screen.getAllByRole('button');
    const bothBtn = buttons.find((b) => b.textContent.includes('Harmony'));
    await user.click(bothBtn);
    expect(storeState.setIsPlaying).toHaveBeenCalledWith(true, 'both');
    expect(mockPlayBoth).toHaveBeenCalledWith(
      storeState.melodyNotes,
      storeState.harmonyNotes,
      expect.any(Function),
    );
  });

  it('shows ⏹ Stop buttons when isPlaying is true', () => {
    storeState = makeStore({ isPlaying: true });
    render(<PlaybackControls />);
    const stopButtons = screen.getAllByRole('button', { name: /stop/i });
    // Both buttons should show Stop when playing
    expect(stopButtons.length).toBe(2);
  });

  it('calls stopPlayback and setIsPlaying(false) when Stop is clicked', async () => {
    const user = userEvent.setup();
    storeState = makeStore({ isPlaying: true });
    render(<PlaybackControls />);
    const stopButtons = screen.getAllByRole('button', { name: /stop/i });
    await user.click(stopButtons[0]);
    expect(mockStopPlayback).toHaveBeenCalled();
    expect(storeState.setIsPlaying).toHaveBeenCalledWith(false);
  });
});

// =============================================================================
// T5.5 — ResultsSection
// =============================================================================
describe('ResultsSection', () => {
  it('renders nothing when harmonyNotes is null', () => {
    storeState = makeStore({ harmonyNotes: null });
    const { container } = render(<ResultsSection />);
    expect(container.firstChild).toBeNull();
  });

  it('renders when harmonyNotes is not null', () => {
    storeState = makeStore({ harmonyNotes: ['E', 'F', 'G'] });
    render(<ResultsSection />);
    // Should show the Results label
    expect(screen.getByText(/results/i)).toBeInTheDocument();
  });

  it('renders ViewTabs inside ResultsSection', () => {
    storeState = makeStore({ harmonyNotes: ['E', 'F', 'G'] });
    render(<ResultsSection />);
    expect(screen.getByRole('tab', { name: /table/i })).toBeInTheDocument();
  });

  it('renders PlaybackControls inside ResultsSection', () => {
    storeState = makeStore({ harmonyNotes: ['E', 'F', 'G'] });
    render(<ResultsSection />);
    // PlaybackControls has two buttons — find the melody-only one
    const buttons = screen.getAllByRole('button');
    const melodyBtn = buttons.find((b) => b.textContent.trim() === '▶ Melody');
    expect(melodyBtn).toBeInTheDocument();
  });
});
