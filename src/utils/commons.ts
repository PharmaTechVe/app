export const truncateString = (
  text: string,
  maxLength: number = 27,
  lastSeparator: string = '...',
): string => {
  if (text) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + lastSeparator;
    }
  }
  return text;
};

export const formatDate = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  };
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('es-ES', options);
};
