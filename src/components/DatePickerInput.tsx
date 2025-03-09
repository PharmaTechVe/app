// src/components/DatePickerInput.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Input from './Input';
import CustomCalendar from './Calendar';
import { CalendarDaysIcon } from 'react-native-heroicons/outline';
import { Colors } from '../styles/theme';
import { format } from 'date-fns';

const DatePickerInput: React.FC<{
  label?: string;
  value?: string;
  placeholder?: string;
  getValue?: (date: string) => void;
}> = ({ label, value, placeholder, getValue }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || '');

  const handleDateSelect = (date: string) => {
    const formattedDate = format(new Date(date), 'dd/MM/yyyy');
    setSelectedDate(formattedDate);
    getValue?.(date);
    setShowCalendar(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShowCalendar(true)}>
        <Input
          label={label}
          placeholder={placeholder}
          value={selectedDate}
          isEditable={false}
          // Se pasa el ícono de calendario personalizado
          icon={<CalendarDaysIcon color={Colors.iconMainDefault} size={20} />}
          backgroundColor={Colors.menuWhite}
        />
      </TouchableOpacity>

      <Modal visible={showCalendar} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <CustomCalendar
            onAccept={handleDateSelect}
            onCancel={() => setShowCalendar(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
});

export default DatePickerInput;
