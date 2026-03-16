# Melodex

A browser-based music composition tool built with React, Vite, and Tone.js.

## Features

- **Audio Synthesis**: Create music using Tone.js web audio engine
- **Modern UI**: Built with React 18, Tailwind CSS, and shadcn/ui components
- **State Management**: Powered by Zustand for efficient global state
- **Well Tested**: Vitest + React Testing Library for reliable tests
- **CI/CD**: Automated linting, testing, and building with GitHub Actions

## Tech Stack

- **Frontend**: React 18 + Vite
- **Audio**: Tone.js
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Lint code
npm run format

# Format code
npm run format
```

## Project Structure

```
src/
  audio/       # Tone.js audio engine
  components/ # React components
  engine/      # Core composition logic
  lib/         # Utilities
  store/       # Zustand state management
  types/       # Type definitions
  __tests__/   # Test files
```

## License

MIT
