import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/screens/tab/HomeScreen';
import { ProductService } from '../src/services/products';

// Mock de ProductService
jest.mock('../src/services/products', () => ({
  ProductService: {
    getProducts: jest.fn(),
  },
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('debería renderizar correctamente el componente', async () => {
    // Mock de la respuesta exitosa de getProducts
    (ProductService.getProducts as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        results: [
          {
            genericName: 'Producto 1',
            images: [{ url: 'http://example.com/image1.jpg' }],
            categories: [{ name: 'Category 1' }],
          },
          {
            genericName: 'Producto 2',
            images: [{ url: 'http://example.com/image2.jpg' }],
            categories: [{ name: 'Category 2' }],
          },
        ],
      },
    });

    const { getByTestId, getByText } = render(<HomeScreen />);

    // Verificar que el componente se renderiza correctamente
    expect(getByTestId('home-screen')).toBeTruthy();

    // Esperar a que los productos se carguen
    await waitFor(() => {
      expect(getByText('Ofertas especiales')).toBeTruthy();
      expect(getByText('Medicamentos')).toBeTruthy();
    });
  });

  it('debería manejar el error al obtener los productos', async () => {
    // Mock de la respuesta fallida de getProducts
    (ProductService.getProducts as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Error al obtener los productos',
    });

    const { getByTestId } = render(<HomeScreen />);

    // Verificar que el componente se renderiza correctamente
    expect(getByTestId('home-screen')).toBeTruthy();

    // Esperar a que se maneje el error
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        'Error al obtener los productos',
      );
    });
  });
});
