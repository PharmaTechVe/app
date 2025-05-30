import { TouchableOpacity } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import PoppinsText from './PoppinsText';
import { Colors, FontSizes } from '../styles/theme';
import React from 'react';

interface ReturnProps {
  onClose: () => void;
}

const Return: React.FC<ReturnProps> = ({ onClose }) => {
  return (
    <TouchableOpacity
      onPress={onClose}
      style={{
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <ChevronLeftIcon
        width={16}
        height={16}
        color={Colors.primary}
        style={{ marginRight: 2, marginLeft: 6 }}
      />
      <PoppinsText
        weight="medium"
        style={{
          fontSize: FontSizes.b1.size,
          lineHeight: FontSizes.b1.lineHeight,
          color: Colors.primary,
        }}
      >
        Volver
      </PoppinsText>
    </TouchableOpacity>
  );
};

export default Return;
