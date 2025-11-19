import '@testing-library/jest-dom';

// Basic matchMedia mock for framer-motion and hooks relying on it
if (typeof window !== 'undefined' && !window.matchMedia) {
  // @ts-expect-error - augmenting window in test env
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// Silence toast usage in tests
vi.mock('@/components/ui/sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));
