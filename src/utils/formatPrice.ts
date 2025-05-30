export function formatPrice(value: number, options?: Intl.NumberFormatOptions) {
  // Divide entre 100 y muestra con dos decimales
  return (value / 100).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });
}
