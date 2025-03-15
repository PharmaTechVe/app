import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Input from './Input';
import CustomCalendar from './Calendar';
import { CalendarDaysIcon } from 'react-native-heroicons/outline';
import { Colors } from '../styles/theme';

const DatePickerInput: React.FC<{
  label?: string;
  value?: string;
  placeholder?: string;
  getValue?: (date: string) => void;
}> = ({ label, value, placeholder, getValue }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || '');

  const handleDateSelect = (date: string) => {
    const [year, month, day] = date.split('-');
    const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    setSelectedDate(formattedDate);
    getValue?.(date);
    setShowCalendar(false);
  };

  const handleCloseModal = () => {
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
          icon={<CalendarDaysIcon color={Colors.iconMainDefault} size={20} />}
          backgroundColor={Colors.menuWhite}
        />
      </TouchableOpacity>

      <Modal visible={showCalendar} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View>
                <CustomCalendar
                  onAccept={handleDateSelect}
                  onCancel={handleCloseModal}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
