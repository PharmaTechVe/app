import { render } from '@testing-library/react-native';
import App from '../src/App';

// App-test.tsx
jest.mock('../global.css', () => ({}));
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));
jest.mock('@expo-google-fonts/poppins', () => ({
  useFonts: jest.fn().mockImplementation(() => [true]), // 👈 Fuentes cargadas
}));
describe('<App />', () => {
  test('Text renders correctly on App', async () => {
    // 👈 Agrega async
    const { findByText } = render(<App />); // 👈 Usa findByText (async)

    // Espera a que aparezca el texto
    await findByText('¡La fuente Poppins se aplica globalmente!'); // 👈 await
  });
});
