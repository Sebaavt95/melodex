import { render } from '@testing-library/react';
import App from '../App';

describe('Smoke test', () => {
  it('renders the App component without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('document.body is defined in the jsdom environment', () => {
    expect(document.body).toBeDefined();
  });
});
