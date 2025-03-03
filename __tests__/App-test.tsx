import { render } from '@testing-library/react-native';
import RootLayout from '../src/app/_layout';

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('@expo-google-fonts/poppins', () => ({
  useFonts: () => [true],
}));

// (Opcional) Si deseas testear el componente real de tabs, no mocks este módulo.
// En cambio, podrías dejarlo sin mock para que se use la implementación real.

describe('<RootLayout />', () => {
  test('renders the main screen after fonts are loaded', async () => {
    const { findByText } = render(<RootLayout />);
    // Ahora esperamos el texto "Pantalla Home"
    expect(await findByText('Pantalla Home')).toBeTruthy();
  });
});
