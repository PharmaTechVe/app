import { render } from '@testing-library/react-native';
import App from '../src/App';

jest.mock('../global.css', () => '');
describe('<App />', () => {
  test('Text renders correctly on App', () => {
    const { getByText } = render(<App />);

    getByText('Open up App.tsx to start working on your app!');
  });
});
