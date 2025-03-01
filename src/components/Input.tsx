import { TextInput, View, Text } from 'react-native';

interface InputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  helperText?: string;
  getValue?: (input: string) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  placeholder,
  helperText,
  getValue,
}) => {
  return (
    <View>
      {label && <Text>{label}</Text>}
      <View>
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={getValue}
        />
      </View>
      <Text>{helperText}</Text>
    </View>
  );
};

export default Input;
