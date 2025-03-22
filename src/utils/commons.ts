export const truncateString = (
  text: string,
  maxLength: number = 27,
): string => {
  if (text) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
  }
  return text;
};
