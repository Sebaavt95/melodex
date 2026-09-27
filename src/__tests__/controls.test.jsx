/**
 * Slice 4 component tests — Controls (TDD: RED phase first)
 * Tests for: KeySelector, HarmonizationSelector, HarmonizeButton, ControlsSection
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ─── Store mock helpers ───────────────────────────────────────────────────────

const makeStore = (overrides = {}) => ({
  melodyNotes: [],
  selectedKey: 'C',
  selectedMode: 'major',
  harmonizationType: 'thirds-up',
  harmonyNotes: null,
  setSelectedKey: vi.fn(),
  setHarmonizationType: vi.fn(),
  harmonize: vi.fn(),
  ...overrides,
});

let storeState = makeStore();

vi.mock('@/store', () => ({
  useMelodexStore: (selector) => selector(storeState),
}));

// Lazy imports after mocks
const { default: KeySelector } = await import('../components/controls/KeySelector');
const { default: HarmonizationSelector } = await import('../components/controls/HarmonizationSelector');
const { default: HarmonizeButton } = await import('../components/controls/HarmonizeButton');
const { default: ControlsSection } = await import('../components/controls/ControlsSection');

// ─── Helper: reset store state before each test ───────────────────────────────
beforeEach(() => {
  storeState = makeStore();
});

// =============================================================================
// T4.1 — KeySelector
// =============================================================================
describe('KeySelector', () => {
  it('displays the current key and mode as trigger label (C Major default)', () => {
    render(<KeySelector />);
    expect(screen.getByRole('combobox')).toHaveTextContent('C Major');
  });

  it('displays minor key label correctly (A Minor)', () => {
    storeState = makeStore({ selectedKey: 'A', selectedMode: 'minor' });
    render(<KeySelector />);
    expect(screen.getByRole('combobox')).toHaveTextContent('A Minor');
  });

  it('calls setSelectedKey with key and mode when a major key is selected', async () => {
    const user = userEvent.setup();
    render(<KeySelector />);
    await user.click(screen.getByRole('combobox'));
    // Select G major from the list
    const option = await screen.findByRole('option', { name: 'G Major' });
    await user.click(option);
    expect(storeState.setSelectedKey).toHaveBeenCalledWith('G', 'major');
  });

  it('calls setSelectedKey with key and minor mode when a minor key is selected', async () => {
    const user = userEvent.setup();
    render(<KeySelector />);
    await user.click(screen.getByRole('combobox'));
    const option = await screen.findByRole('option', { name: 'D Minor' });
    await user.click(option);
    expect(storeState.setSelectedKey).toHaveBeenCalledWith('D', 'minor');
  });

  it('renders all 24 key options (12 major + 12 minor)', async () => {
    const user = userEvent.setup();
    render(<KeySelector />);
    await user.click(screen.getByRole('combobox'));
    const options = await screen.findAllByRole('option');
    expect(options).toHaveLength(24);
  });

  it('does NOT call harmonize when key changes', async () => {
    const user = userEvent.setup();
    render(<KeySelector />);
    await user.click(screen.getByRole('combobox'));
    const option = await screen.findByRole('option', { name: 'F Major' });
    await user.click(option);
    expect(storeState.harmonize).not.toHaveBeenCalled();
  });
});

// =============================================================================
// T4.2 — HarmonizationSelector
// =============================================================================
describe('HarmonizationSelector', () => {
  it('displays the default harmonization type (3rds up)', () => {
    render(<HarmonizationSelector />);
    expect(screen.getByRole('combobox')).toHaveTextContent('3rds up');
  });

  it('displays the correct label for a non-default type (5ths)', () => {
    storeState = makeStore({ harmonizationType: 'fifths' });
    render(<HarmonizationSelector />);
    expect(screen.getByRole('combobox')).toHaveTextContent('5ths');
  });

  it('calls setHarmonizationType when a type is selected', async () => {
    const user = userEvent.setup();
    render(<HarmonizationSelector />);
    await user.click(screen.getByRole('combobox'));
    const option = await screen.findByRole('option', { name: '6ths up' });
    await user.click(option);
    expect(storeState.setHarmonizationType).toHaveBeenCalledWith('sixths-up');
  });

  it('calls setHarmonizationType with thirds-down when 3rds down is selected', async () => {
    const user = userEvent.setup();
    render(<HarmonizationSelector />);
    await user.click(screen.getByRole('combobox'));
    const option = await screen.findByRole('option', { name: '3rds down' });
    await user.click(option);
    expect(storeState.setHarmonizationType).toHaveBeenCalledWith('thirds-down');
  });

  it('renders all 5 harmonization options', async () => {
    const user = userEvent.setup();
    render(<HarmonizationSelector />);
    await user.click(screen.getByRole('combobox'));
    const options = await screen.findAllByRole('option');
    expect(options).toHaveLength(5);
  });

  it('does NOT call harmonize when type changes', async () => {
    const user = userEvent.setup();
    render(<HarmonizationSelector />);
    await user.click(screen.getByRole('combobox'));
    const option = await screen.findByRole('option', { name: '5ths' });
    await user.click(option);
    expect(storeState.harmonize).not.toHaveBeenCalled();
  });
});

// =============================================================================
// T4.3 — HarmonizeButton
// =============================================================================
describe('HarmonizeButton', () => {
  it('renders a button with "Harmonize →" text', () => {
    render(<HarmonizeButton />);
    expect(screen.getByRole('button', { name: /harmonize/i })).toBeInTheDocument();
  });

  it('is disabled when melodyNotes is empty', () => {
    storeState = makeStore({ melodyNotes: [] });
    render(<HarmonizeButton />);
    expect(screen.getByRole('button', { name: /harmonize/i })).toBeDisabled();
  });

  it('is enabled when melodyNotes has at least one note', () => {
    storeState = makeStore({ melodyNotes: ['C'] });
    render(<HarmonizeButton />);
    expect(screen.getByRole('button', { name: /harmonize/i })).toBeEnabled();
  });

  it('calls harmonize() when clicked and melody is not empty', async () => {
    const user = userEvent.setup();
    storeState = makeStore({ melodyNotes: ['C', 'D'] });
    render(<HarmonizeButton />);
    await user.click(screen.getByRole('button', { name: /harmonize/i }));
    expect(storeState.harmonize).toHaveBeenCalledTimes(1);
  });

  it('does NOT call harmonize() when button is disabled (empty melody)', async () => {
    const user = userEvent.setup();
    storeState = makeStore({ melodyNotes: [] });
    render(<HarmonizeButton />);
    await user.click(screen.getByRole('button', { name: /harmonize/i }));
    expect(storeState.harmonize).not.toHaveBeenCalled();
  });
});

// =============================================================================
// T4.4 — ControlsSection
// =============================================================================
describe('ControlsSection', () => {
  it('renders the "Key & Style" section label', () => {
    render(<ControlsSection />);
    expect(screen.getByText(/key & style/i)).toBeInTheDocument();
  });

  it('renders a KeySelector (combobox for key selection)', () => {
    render(<ControlsSection />);
    // At least one combobox (KeySelector or HarmonizationSelector) should be visible
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes.length).toBeGreaterThanOrEqual(2);
  });

  it('renders the Harmonize button', () => {
    render(<ControlsSection />);
    expect(screen.getByRole('button', { name: /harmonize/i })).toBeInTheDocument();
  });
});
