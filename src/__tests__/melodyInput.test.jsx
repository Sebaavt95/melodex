/**
 * Slice 3 component tests — Melody Input (TDD: RED phase first)
 * Tests for: NoteChip, NoteChipsRow, TextInput, PianoKey, Piano, InputModeTabs, MelodyInputSection
 */
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ─── Store mock helpers ───────────────────────────────────────────────────────

const makeStore = (overrides = {}) => ({
  melodyNotes: [],
  inputMode: 'text',
  harmonyNotes: null,
  addNote: vi.fn(),
  removeNote: vi.fn(),
  removeLastNote: vi.fn(),
  clearMelody: vi.fn(),
  setInputMode: vi.fn(),
  ...overrides,
});

let storeState = makeStore();

vi.mock('@/store', () => ({
  useMelodexStore: (selector) => selector(storeState),
}));

// Mute audio in tests
vi.mock('@/audio', () => ({
  playNote: vi.fn(),
  playMelody: vi.fn(),
  playBoth: vi.fn(),
  stopPlayback: vi.fn(),
}));

// Lazy imports after mocks
const { default: NoteChip } = await import('../components/melody-input/NoteChip');
const { default: NoteChipsRow } = await import('../components/melody-input/NoteChipsRow');
const { default: TextInput } = await import('../components/melody-input/TextInput');
const { default: PianoKey } = await import('../components/piano/PianoKey');
const { default: Piano } = await import('../components/piano/Piano');
const { default: InputModeTabs } = await import('../components/melody-input/InputModeTabs');
const { default: MelodyInputSection } = await import('../components/melody-input/MelodyInputSection');

// ─── Helper: reset store state before each test ───────────────────────────────
beforeEach(() => {
  storeState = makeStore();
});

// =============================================================================
// T3.1 — NoteChip
// =============================================================================
describe('NoteChip', () => {
  it('renders the note name', () => {
    render(<NoteChip note="C#" onRemove={vi.fn()} />);
    expect(screen.getByText('C#')).toBeInTheDocument();
  });

  it('renders a remove button (×)', () => {
    render(<NoteChip note="D" onRemove={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onRemove when × button is clicked', () => {
    const onRemove = vi.fn();
    render(<NoteChip note="E" onRemove={onRemove} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('renders different note names correctly', () => {
    const { rerender } = render(<NoteChip note="F#" onRemove={vi.fn()} />);
    expect(screen.getByText('F#')).toBeInTheDocument();
    rerender(<NoteChip note="Bb" onRemove={vi.fn()} />);
    expect(screen.getByText('Bb')).toBeInTheDocument();
  });
});

// =============================================================================
// T3.2 — NoteChipsRow
// =============================================================================
describe('NoteChipsRow', () => {
  it('renders a chip for each note in melodyNotes', () => {
    storeState = makeStore({ melodyNotes: ['C', 'D', 'E'] });
    render(<NoteChipsRow />);
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
  });

  it('renders no chips when melodyNotes is empty', () => {
    storeState = makeStore({ melodyNotes: [] });
    render(<NoteChipsRow />);
    // No note text visible
    expect(screen.queryByText(/^[A-G][b#]?$/)).not.toBeInTheDocument();
  });

  it('renders ⌫ Last and Clear buttons', () => {
    render(<NoteChipsRow />);
    expect(screen.getByRole('button', { name: /last/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('⌫ Last button is disabled when melody is empty', () => {
    storeState = makeStore({ melodyNotes: [] });
    render(<NoteChipsRow />);
    expect(screen.getByRole('button', { name: /last/i })).toBeDisabled();
  });

  it('Clear button is disabled when melody is empty', () => {
    storeState = makeStore({ melodyNotes: [] });
    render(<NoteChipsRow />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeDisabled();
  });

  it('⌫ Last button is enabled when melody has notes', () => {
    storeState = makeStore({ melodyNotes: ['G'] });
    render(<NoteChipsRow />);
    expect(screen.getByRole('button', { name: /last/i })).not.toBeDisabled();
  });

  it('Clear button is enabled when melody has notes', () => {
    storeState = makeStore({ melodyNotes: ['A', 'B'] });
    render(<NoteChipsRow />);
    expect(screen.getByRole('button', { name: /clear/i })).not.toBeDisabled();
  });

  it('calls removeLastNote when ⌫ Last is clicked', () => {
    const removeLastNote = vi.fn();
    storeState = makeStore({ melodyNotes: ['C', 'D'], removeLastNote });
    render(<NoteChipsRow />);
    fireEvent.click(screen.getByRole('button', { name: /last/i }));
    expect(removeLastNote).toHaveBeenCalledTimes(1);
  });

  it('calls clearMelody when Clear is clicked', () => {
    const clearMelody = vi.fn();
    storeState = makeStore({ melodyNotes: ['C'], clearMelody });
    render(<NoteChipsRow />);
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(clearMelody).toHaveBeenCalledTimes(1);
  });

  it('calls removeNote with correct index when chip × is clicked', () => {
    const removeNote = vi.fn();
    storeState = makeStore({ melodyNotes: ['C', 'D', 'E'], removeNote });
    render(<NoteChipsRow />);
    // Each chip has a × button with aria-label="Remove {note}"
    fireEvent.click(screen.getByRole('button', { name: 'Remove D' }));
    expect(removeNote).toHaveBeenCalledWith(1);
  });
});

// =============================================================================
// T3.3 — TextInput
// =============================================================================
describe('TextInput', () => {
  it('renders a textarea with the correct placeholder', () => {
    render(<TextInput />);
    expect(screen.getByPlaceholderText('C D E F G A B')).toBeInTheDocument();
  });

  it('adds a valid note when space is pressed', async () => {
    const addNote = vi.fn();
    storeState = makeStore({ addNote });
    render(<TextInput />);
    const textarea = screen.getByPlaceholderText('C D E F G A B');
    await userEvent.type(textarea, 'C ');
    expect(addNote).toHaveBeenCalledWith('C');
  });

  it('adds a valid note when Enter is pressed', async () => {
    const addNote = vi.fn();
    storeState = makeStore({ addNote });
    render(<TextInput />);
    const textarea = screen.getByPlaceholderText('C D E F G A B');
    await userEvent.type(textarea, 'D{Enter}');
    expect(addNote).toHaveBeenCalledWith('D');
  });

  it('normalizes note to uppercase before adding', async () => {
    const addNote = vi.fn();
    storeState = makeStore({ addNote });
    render(<TextInput />);
    const textarea = screen.getByPlaceholderText('C D E F G A B');
    await userEvent.type(textarea, 'c#{Enter}');
    expect(addNote).toHaveBeenCalledWith('C#');
  });

  it('silently discards invalid notes (no error message shown)', async () => {
    const addNote = vi.fn();
    storeState = makeStore({ addNote });
    render(<TextInput />);
    const textarea = screen.getByPlaceholderText('C D E F G A B');
    await userEvent.type(textarea, 'X{Enter}');
    expect(addNote).not.toHaveBeenCalled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('clears the text field after adding a valid note', async () => {
    const addNote = vi.fn();
    storeState = makeStore({ addNote });
    render(<TextInput />);
    const textarea = screen.getByPlaceholderText('C D E F G A B');
    await userEvent.type(textarea, 'E{Enter}');
    expect(textarea.value).toBe('');
  });

  it('clears the text field after discarding an invalid note', async () => {
    render(<TextInput />);
    const textarea = screen.getByPlaceholderText('C D E F G A B');
    await userEvent.type(textarea, 'Z{Enter}');
    expect(textarea.value).toBe('');
  });

  it('does nothing when Enter is pressed on empty input', async () => {
    const addNote = vi.fn();
    storeState = makeStore({ addNote });
    render(<TextInput />);
    const textarea = screen.getByPlaceholderText('C D E F G A B');
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(addNote).not.toHaveBeenCalled();
  });
});

// =============================================================================
// T3.4 — PianoKey
// =============================================================================
describe('PianoKey', () => {
  it('renders a white key button', () => {
    render(
      <PianoKey note="C" isBlack={false} leftPx={0} isMelodyActive={false} isHarmonyActive={false} onPress={vi.fn()} />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onPress with the note when clicked', () => {
    const onPress = vi.fn();
    render(
      <PianoKey note="E" isBlack={false} leftPx={0} isMelodyActive={false} isHarmonyActive={false} onPress={onPress} />
    );
    fireEvent.pointerDown(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledWith('E');
  });

  it('calls onPress with black key note', () => {
    const onPress = vi.fn();
    render(
      <PianoKey note="C#" isBlack={true} leftPx={28} isMelodyActive={false} isHarmonyActive={false} onPress={onPress} />
    );
    fireEvent.pointerDown(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledWith('C#');
  });

  it('renders with melody active state (does not crash)', () => {
    render(
      <PianoKey note="G" isBlack={false} leftPx={0} isMelodyActive={true} isHarmonyActive={false} onPress={vi.fn()} />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with harmony active state (does not crash)', () => {
    render(
      <PianoKey note="A" isBlack={false} leftPx={0} isMelodyActive={false} isHarmonyActive={true} onPress={vi.fn()} />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

// =============================================================================
// T3.5 — Piano
// =============================================================================
describe('Piano', () => {
  it('renders 7 white keys (C D E F G A B)', () => {
    render(
      <Piano activeMelodyNotes={[]} activeHarmonyNotes={[]} onKeyPress={vi.fn()} />
    );
    const buttons = screen.getAllByRole('button');
    // 7 white + 5 black = 12 keys
    expect(buttons).toHaveLength(12);
  });

  it('calls onKeyPress when a white key is pressed', () => {
    const onKeyPress = vi.fn();
    render(
      <Piano activeMelodyNotes={[]} activeHarmonyNotes={[]} onKeyPress={onKeyPress} />
    );
    // Piano renders keys — press the first one (C)
    fireEvent.pointerDown(screen.getAllByRole('button')[0]);
    expect(onKeyPress).toHaveBeenCalledWith('C');
  });

  it('calls onKeyPress with black key note when pressed', () => {
    const onKeyPress = vi.fn();
    render(
      <Piano activeMelodyNotes={[]} activeHarmonyNotes={[]} onKeyPress={onKeyPress} />
    );
    const buttons = screen.getAllByRole('button');
    // White keys: 0=C, 1=D, 2=E, 3=F, 4=G, 5=A, 6=B
    // Black keys: 7=C#, 8=D#, 9=F#, 10=G#, 11=A#
    fireEvent.pointerDown(buttons[7]); // C# (first black key)
    expect(onKeyPress).toHaveBeenCalledWith('C#');
  });

  it('renders melody active notes without crashing', () => {
    render(
      <Piano activeMelodyNotes={['C', 'E', 'G']} activeHarmonyNotes={[]} onKeyPress={vi.fn()} />
    );
    expect(screen.getAllByRole('button')).toHaveLength(12);
  });

  it('accepts duplicate melody notes (deduped display, still 12 keys)', () => {
    render(
      <Piano activeMelodyNotes={['C', 'C', 'C']} activeHarmonyNotes={[]} onKeyPress={vi.fn()} />
    );
    expect(screen.getAllByRole('button')).toHaveLength(12);
  });
});

// =============================================================================
// T3.6 — InputModeTabs
// =============================================================================
describe('InputModeTabs', () => {
  it('renders Text and Piano tab triggers', () => {
    render(<InputModeTabs />);
    expect(screen.getByRole('tab', { name: 'Text' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Piano' })).toBeInTheDocument();
  });

  it('shows TextInput by default (inputMode: text)', () => {
    storeState = makeStore({ inputMode: 'text' });
    render(<InputModeTabs />);
    expect(screen.getByPlaceholderText('C D E F G A B')).toBeInTheDocument();
  });

  it('shows Piano when inputMode is piano', () => {
    storeState = makeStore({ inputMode: 'piano' });
    render(<InputModeTabs />);
    // Piano renders 12 buttons
    const buttons = screen.getAllByRole('button');
    // At least 12 piano key buttons should be present
    expect(buttons.length).toBeGreaterThanOrEqual(12);
  });

  it('calls setInputMode when Piano tab is clicked', async () => {
    const setInputMode = vi.fn();
    storeState = makeStore({ inputMode: 'text', setInputMode });
    render(<InputModeTabs />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: 'Piano' }));
    expect(setInputMode).toHaveBeenCalledWith('piano');
  });
});

// =============================================================================
// T3.7 — MelodyInputSection
// =============================================================================
describe('MelodyInputSection', () => {
  it('renders the "Melody Input" section label', () => {
    render(<MelodyInputSection />);
    expect(screen.getByText(/melody input/i)).toBeInTheDocument();
  });

  it('renders InputModeTabs inside (Text tab visible by default)', () => {
    render(<MelodyInputSection />);
    expect(screen.getByRole('tab', { name: 'Text' })).toBeInTheDocument();
  });
});
