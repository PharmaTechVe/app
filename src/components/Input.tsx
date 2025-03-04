import { useEffect, useState } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from 'react-native-heroicons/outline';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';

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
  isEditable?: boolean;
  backgroundColor?: string;
  validation?: (input: string) => boolean;
  getValue?: (input: string) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  placeholder,
  fieldType = 'text',
  helperText,
  useDefaultValidation = true,
  showIcon = false,
  border = 'default',
  isEditable = true,
  backgroundColor,
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
      return Colors.semanticDanger;
    } else if (isValid) {
      return Colors.semanticSuccess;
    } else if (isFocused) {
      return Colors.primary;
    } else {
      return border === 'parcial' ? '#fff' : Colors.placeholder;
    }
  };

  const getBorderWidth = () => {
    switch (border) {
      case 'none':
        return 0;
      case 'double':
        return 2;
      default:
        return 1;
    }
  };

  const validatePassword = (input: string) => {
    return input.length >= 8;
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
    <View style={styles.container}>
      {label && (
        <PoppinsText weight="medium" style={styles.label}>
          {label}
        </PoppinsText>
      )}
      <View
        style={[
          {
            borderColor: getBorderColor(),
            borderWidth: getBorderWidth(),
            backgroundColor: backgroundColor
              ? backgroundColor // Prioriza el color personalizado
              : !isEditable
                ? Colors.disableText // Color si está deshabilitado
                : 'transparent', // Fondo transparente por defecto
          },
          styles.inputContainer,
        ]}
      >
        <TextInput
          value={Ivalue}
          placeholder={placeholder}
          secureTextEntry={fieldType == 'password' && !showPassword}
          keyboardType={fieldType == 'number' ? 'numeric' : 'default'}
          multiline={fieldType == 'textarea'}
          editable={isEditable}
          onChangeText={validateInput}
          onFocus={() => {
            setIsFocused(true);
            setHasBlurred(false);
          }}
          onBlur={() => {
            setIsFocused(false);
            setHasBlurred(true);
          }}
          style={{ flex: 1 }}
        />

        {showIcon == true ? (
          !isValid && hasBlurred ? (
            <ExclamationCircleIcon
              color={
                border !== 'none'
                  ? Colors.semanticDanger
                  : Colors.iconMainDefault
              }
              size={20}
            />
          ) : (
            isValid && (
              <CheckCircleIcon
                color={
                  border !== 'none'
                    ? Colors.semanticSuccess
                    : Colors.iconMainDefault
                }
                size={20}
              />
            )
          )
        ) : fieldType == 'password' ? (
          <TouchableOpacity onPress={showPass}>
            {showPassword ? (
              <EyeSlashIcon color={Colors.iconMainDefault} size={20} />
            ) : (
              <EyeIcon color={Colors.iconMainDefault} size={20} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
      {helperText && (
        <PoppinsText style={[{ color: getBorderColor() }, styles.helperText]}>
          {helperText}
        </PoppinsText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: FontSizes.label.size,
  },
  label: {
    fontSize: FontSizes.label.size,
    marginBottom: 4,
  },
  helperText: {
    fontSize: FontSizes.label.size,
    marginTop: 4,
  },
});

export default Input;
