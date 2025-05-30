// Validación de correo electrónico
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validación de contraseña (mínimo 8 caracteres)
export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

// Validación de coincidencia de contraseñas
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): boolean => {
  return password === confirmPassword;
};

// Validación de campos vacíos
export const validateRequiredFields = (fields: string[]): boolean => {
  return fields.every((field) => field.trim() !== '');
};

// Validación de formato de fecha (YYYY-MM-DD)
export const validateDateFormat = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
};

// Validación de longitud del teléfono celular
export const validatePhoneNumberLength = (phoneNumber: string): boolean => {
  return phoneNumber.length >= 8 && phoneNumber.length <= 15;
};
