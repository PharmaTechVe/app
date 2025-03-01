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
    <View className="my-2 w-full px-6">
      {label && <Text className="text-md mb-2">{label}</Text>}
      <View className="flex-row items-center border rounded-xl p-4 py-2 w-lg text-md">
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={getValue}
        />
      </View>
      <Text className="text-xs mt-2">{helperText}</Text>
    </View>
  );
};

export default Input;
