export const truncateString = (
  text: string,
  maxLength: number = 27,
  optionalText: string = '',
): string => {
  if (text) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + optionalText;
    }
  }
  return text;
};
