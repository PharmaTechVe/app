// __tests__/LoginScreen.test.tsx
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';

describe('<LoginScreen />', () => {
  test('renders "Bienvenido" text', async () => {
    const { getByText } = render(<LoginScreen />);
    await waitFor(() => {
      expect(getByText('Bienvenido')).toBeTruthy();
    });
  });
});
