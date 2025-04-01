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
import { validateEmail, validatePassword } from '../utils/validators';

type FieldType = 'text' | 'number' | 'email' | 'password' | 'textarea';
type BorderType = 'none' | 'default' | 'parcial' | 'double';

interface InputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  fieldType?: FieldType;
  helperText?: string;
  errorText?: string;
  useDefaultValidation?: boolean;
  showIcon?: boolean;
  icon?: React.ReactNode;
  border?: BorderType;
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
  errorText,
  useDefaultValidation = true,
  showIcon = false,
  icon,
  border = 'default',
  isEditable = true,
  backgroundColor,
  validation,
  getValue,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasBlurred, setHasBlurred] = useState(false);
  const [Ivalue, setIvalue] = useState(value);
  const [isValid, setIsValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIvalue(value);
  }, [value]);

  const handleValidation = (input: string, type: 'email' | 'password') => {
    if (type === 'email') {
      return validateEmail(input);
    }
    if (type === 'password') {
      return validatePassword(input);
    }
    return false;
  };

  const validateInput = (input: string) => {
    if (useDefaultValidation) {
      switch (fieldType) {
        case 'text':
          return input.length > 0;
        case 'email':
          return handleValidation(input, 'email');
        case 'number':
          return !isNaN(Number(input));
        case 'password':
          return handleValidation(input, 'password');
        default:
          return true;
      }
    } else if (validation) {
      return validation(input);
    }
    return true;
  };

  const handleChange = (text: string) => {
    let normalizedText = text;
    if (fieldType === 'email') {
      normalizedText = text.toLowerCase();
    }

    const isValidInput = validateInput(normalizedText); // Llama a validateInput
    setIsValid(isValidInput); // Actualiza el estado de validación

    setIvalue(normalizedText);
    if (getValue) {
      getValue(normalizedText);
    }
  };

  const getBorderColor = () => {
    if (hasBlurred && !isValid) {
      return Colors.semanticDanger;
    } else if (isValid && hasBlurred) {
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

  const showPass = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {}, [isFocused, hasBlurred]);

  return (
    <View style={styles.container}>
      {label && (
        <PoppinsText weight="medium" style={styles.label}>
          {label}
        </PoppinsText>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            borderWidth: getBorderWidth(),
            backgroundColor: backgroundColor
              ? backgroundColor
              : !isEditable
                ? Colors.disableText
                : 'transparent',
          },
        ]}
      >
        <TextInput
          value={Ivalue}
          placeholder={placeholder}
          secureTextEntry={fieldType === 'password' && !showPassword}
          keyboardType={fieldType === 'number' ? 'numeric' : 'default'}
          multiline={fieldType === 'textarea'}
          editable={isEditable}
          onChangeText={handleChange} // Usar la función corregida
          onFocus={() => {
            setIsFocused(true);
            setHasBlurred(false);
          }}
          onBlur={() => {
            setIsFocused(false);
            setHasBlurred(true);
          }}
          style={{
            flex: 1,
            height: 44,
            fontFamily: 'Poppins_400Regular',
            fontSize: FontSizes.label.size,
            lineHeight: FontSizes.label.lineHeight,
          }}
        />

        {icon ? (
          icon
        ) : showIcon ? (
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
        ) : fieldType === 'password' ? (
          <TouchableOpacity onPress={showPass}>
            {showPassword ? (
              <EyeSlashIcon color={Colors.iconMainDefault} size={20} />
            ) : (
              <EyeIcon color={Colors.iconMainDefault} size={20} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>

      {hasBlurred && !isValid && errorText && (
        <PoppinsText
          style={[styles.errorText, { color: Colors.semanticDanger }]}
        >
          {errorText}
        </PoppinsText>
      )}

      {helperText && isValid && (
        <PoppinsText style={[styles.helperText, { color: getBorderColor() }]}>
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
    color: Colors.textMain,
  },
  helperText: {
    fontSize: FontSizes.label.size,
    marginTop: 4,
  },
  errorText: {
    fontSize: FontSizes.label.size,
    marginTop: 4,
  },
});

export default Input;
