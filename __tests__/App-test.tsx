import { render } from '@testing-library/react-native';
import App from '../src/App';

jest.mock('../global.css', () => '');
describe('<App />', () => {
  test('Text renders correctly on App', async () => {
    // 👈 Agrega async
    const { findByText } = render(<App />); // 👈 Usa findByText (async)

    // Espera a que aparezca el texto
    await findByText('¡La fuente Poppins se aplica globalmente!'); // 👈 await
  });
});
