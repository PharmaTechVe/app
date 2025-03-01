import { useEffect, useState } from 'react';
import { TextInput, View, Text, TouchableOpacity } from 'react-native';
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from 'react-native-heroicons/outline';

type fieldType = 'text' | 'number' | 'email' | 'password' | 'textarea';
type borderType = 'none' | 'default' | 'parcial' | 'double';

interface InputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  fieldType?: fieldType;
  helperText?: string;
  useDefaultValidation?: boolean;
  showIcon?: boolean;
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
  fieldType,
  helperText,
  useDefaultValidation = true,
  showIcon = false,
  border = 'default',
  validation,
  getValue,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasBlurred, setHasBlurred] = useState(false);
  const [Ivalue, setIvalue] = useState(value);
  const [isValid, setIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  // Determina el color del borde
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

  const borderWidth = () => {
    switch (border) {
      case 'none':
        return 'border-1';
      case 'double':
        return 'border-2';
      default:
        return 'border';
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

  const showPass = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    getBorderColor();
  }, [isFocused, hasBlurred]);

  return (
    <View className="my-2 w-full px-6">
      {label && <Text className="text-md mb-2">{label}</Text>}
      <View
        className={`flex-row items-center ${borderWidth()} rounded-xl p-4 py-2 w-lg text-md`}
        style={[{ borderColor: getBorderColor() }]}
      >
        <TextInput
          value={Ivalue}
          placeholder={placeholder}
          secureTextEntry={fieldType == 'password' && !showPassword}
          keyboardType={fieldType == 'number' ? 'numeric' : 'default'}
          multiline={fieldType == 'textarea'}
          onChangeText={validateInput}
          onFocus={() => {
            setIsFocused(true);
            setHasBlurred(false);
          }}
          onBlur={() => {
            setIsFocused(false);
            setHasBlurred(true);
          }}
          className="flex-1"
        />

        {showIcon == true ? (
          !isValid && hasBlurred ? (
            <ExclamationCircleIcon
              color={border !== 'none' ? colors.danger : 'gray'}
              size={20}
            />
          ) : (
            Ivalue && (
              <CheckCircleIcon
                color={border !== 'none' ? colors.success : 'gray'}
                size={20}
              />
            )
          )
        ) : fieldType == 'password' ? (
          <TouchableOpacity onPress={showPass}>
            {showPassword ? (
              <EyeSlashIcon color="gray" size={20} />
            ) : (
              <EyeIcon color="gray" size={20} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
      {helperText && (
        <Text style={[{ color: getBorderColor() }]} className="text-xs mt-2">
          {helperText}
        </Text>
      )}
    </View>
  );
};

export default Input;
