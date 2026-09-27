import { render, screen, fireEvent } from '@testing-library/react';

// We'll mock the store module before importing components
const mockToggleDarkMode = vi.fn();

vi.mock('@/store', () => ({
  useMelodexStore: (selector) =>
    selector({ isDarkMode: true, toggleDarkMode: mockToggleDarkMode }),
}));

// Import after mock is set up
const { default: AppLayout } = await import('../components/layout/AppLayout');
const { default: Header } = await import('../components/layout/Header');

describe('AppLayout', () => {
  it('renders children inside the layout container', () => {
    render(
      <AppLayout>
        <span data-testid="child">hello</span>
      </AppLayout>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('wraps children in a container div', () => {
    const { container } = render(
      <AppLayout>
        <span>content</span>
      </AppLayout>
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('Header', () => {
  beforeEach(() => {
    mockToggleDarkMode.mockClear();
  });

  it('renders the Melodex logo text', () => {
    render(<Header />);
    expect(screen.getByText('Melodex')).toBeInTheDocument();
  });

  it('renders a theme toggle button', () => {
    render(<Header />);
    const toggleBtn = screen.getByRole('button');
    expect(toggleBtn).toBeInTheDocument();
  });

  it('calls toggleDarkMode when the theme button is clicked', () => {
    render(<Header />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockToggleDarkMode).toHaveBeenCalledTimes(1);
  });
});
