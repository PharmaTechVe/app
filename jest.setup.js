// jest.setup.js

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({}),
  router: { push: jest.fn() },
  Stack: ({ children }) => children,
}));

jest.mock('expo-linking', () => ({
  createURL: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Polyfills base
global.__dirname = '/';
global.__filename = '';
global.window = global;
global.self = global;
