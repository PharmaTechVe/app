import { useState } from 'react';
import { TextInput, View, Text } from 'react-native';

type fieldType = 'text' | 'number' | 'email' | 'password' | 'textarea';
type borderType = 'none' | 'default' | 'parcial' | 'double';

interface InputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  fieldType?: fieldType;
  helperText?: string;
  useDefaultValidation?: boolean;
  border?: borderType;
  validation?: (input: string) => boolean;
  getValue?: (input: string) => void;
}

const colors = {
  primary: '#1c2143',
  success: '#00c814',
  danger: '#e10000',
  lowContrast: '#666666',
};

const Input: React.FC<InputProps> = ({
  label,
  value,
  placeholder,
  helperText,
  fieldType,
  useDefaultValidation,
  border = 'default',
  validation,
  getValue,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasBlurred, setHasBlurred] = useState(false);
  const [Ivalue, setIvalue] = useState(value);
  const [isValid, setIsValid] = useState(false);

  const validateInput = (input: string) => {
    setIvalue(input);
    if (getValue) {
      getValue(input);
    }
    if (useDefaultValidation) {
      switch (fieldType) {
        case 'text':
          setIsValid(input.length > 0);
          break;
        case 'email':
          setIsValid(validateEmail(input));
          break;
        case 'number':
          if (!isNaN(Number(input))) {
            return setIsValid(true);
          } else setIsValid(false);
          break;
        case 'password':
          setIsValid(validatePassword(input));
          break;
        default:
          setIsValid(true);
      }
    } else if (validation) {
      setIsValid(validation(input));
    } else {
      setIsValid(true);
    }
  };

  const getBorderColor = () => {
    if (hasBlurred && !isValid) {
      return colors.danger;
    } else if (isValid) {
      return colors.success;
    } else if (isFocused) {
      return colors.primary;
    } else {
      return border === 'parcial' ? '#fff' : colors.lowContrast;
    }
  };

  const validatePassword = (input: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(input);
  };

  const validateEmail = (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };
  return (
    <View className="my-2 w-full px-6">
      {label && <Text className="text-md mb-2">{label}</Text>}
      <View className="flex-row items-center border rounded-xl p-4 py-2 w-lg text-md">
        <TextInput
          value={Ivalue}
          placeholder={placeholder}
          onChangeText={validateInput}
          onFocus={() => {
            setIsFocused(true);
            setHasBlurred(false);
          }}
          onBlur={() => {
            setIsFocused(false);
            setHasBlurred(true);
          }}
        />
      </View>
      {isValid}
      <Text className="text-xs mt-2" style={[{ color: getBorderColor() }]}>
        {helperText}
      </Text>
    </View>
  );
};

export default Input;
