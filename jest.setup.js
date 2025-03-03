/** @type {import('jest').Config} */
global.__filename = 'dummy-filename';
global.__dirname = '/dummy-dir';

// Componente dummy para ActivityIndicator
const DummyActivityIndicator = () => null;
DummyActivityIndicator.displayName = 'ActivityIndicator';

// Mock de React Native: se modifica el módulo real para sobreescribir lo necesario
jest.mock('react-native', () => {
  const actualRN = jest.requireActual('react-native');

  // Sobreescribe ActivityIndicator con el dummy
  actualRN.ActivityIndicator = DummyActivityIndicator;

  // Sobreescribe Appearance con mocks
  actualRN.Appearance = {
    getColorScheme: jest.fn(() => 'light'),
    addChangeListener: jest.fn(),
    removeChangeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };

  return actualRN;
});

// Mock de react-native-css-interop: se provee la función createInteropElement
jest.mock('react-native-css-interop', () => ({
  createInteropElement: (component) => component,
}));

// Mock de nativewind (si lo usas)
jest.mock('nativewind', () => ({
  useColorScheme: () => 'light',
}));

// Mock de expo-router para funciones generales (por ejemplo, useRouter)
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useRouter: () => ({ push: jest.fn() }),
  useLocalSearchParams: () => ({}),
  // Se puede dejar el componente Stack como función que retorna sus children
  Stack: ({ children }) => children,
}));

// MOCK de expo-router/stack: para manejar el Stack y el Screen
jest.mock('expo-router/stack', () => {
  const React = require('react');
  // Creamos un componente dummy para Stack
  const DummyStack = ({ children }) => children;
  // Definimos Screen de forma que, al detectar el nombre "(tabs)", se invoque el componente correspondiente
  DummyStack.Screen = (props) => {
    if (props.name === '(tabs)') {
      // Usamos el alias definido en moduleNameMapper para resolver la ruta
      const Tabs = require('src/app/(tabs)/index').default;
      // Invocamos el componente mockeado; para mayor seguridad lo envolvemos en un fragmento
      const result = Tabs(props);
      return <>{result}</>;
    }
    return null;
  };
  return { Stack: DummyStack };
});
