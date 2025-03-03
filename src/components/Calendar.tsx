// src/components/CustomCalendar.tsx
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import PoppinsText from './PoppinsText';
import Button from './Button'; // Asegúrate de que la ruta sea correcta
import { Colors } from '../styles/theme';

// Configuración en español
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthNamesShort: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  dayNames: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

interface MarkedDates {
  [key: string]: {
    selected?: boolean;
    marked?: boolean;
    selectedColor?: string;
    dotColor?: string;
  };
}

const CustomCalendar: React.FC<{
  onAccept?: (date: string) => void;
  onCancel?: () => void;
}> = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // Meses de 1 a 12
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Usamos una constante para generar siempre los años desde 1900 hasta el año actual real
  const startingYear = new Date().getFullYear();
  const years = useMemo(
    () =>
      Array.from(
        { length: startingYear - 1900 + 1 },
        (_, i) => 1900 + i,
      ).reverse(),
    [], // No depende de currentYear, para que siempre muestre el rango completo
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  // Al seleccionar un día, actualizamos la fecha y sincronizamos currentYear y currentMonth
  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    const [year, month] = day.dateString.split('-');
    setCurrentYear(parseInt(year, 10));
    setCurrentMonth(parseInt(month, 10));
  };

  // Fechas marcadas: el día seleccionado y un ejemplo fijo
  const markedDates: MarkedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: Colors.primary,
    },
    '2023-10-15': {
      marked: true,
      dotColor: '#EF4444',
    },
  };

  // Header personalizado: mes y año alineados horizontalmente usando PoppinsText
  const CustomHeader = useCallback(() => {
    const monthName = LocaleConfig.locales['es'].monthNames[currentMonth - 1];
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => setShowMonthPicker(true)}
          style={styles.headerButton}
        >
          <PoppinsText weight="medium" style={styles.headerText}>
            {monthName}
          </PoppinsText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowYearPicker(true)}
          style={styles.headerButton}
        >
          <PoppinsText weight="medium" style={styles.headerText}>
            {currentYear}
          </PoppinsText>
        </TouchableOpacity>
      </View>
    );
  }, [currentYear, currentMonth]);

  // Actualiza el estado del calendario al cambiar año o mes desde los modales
  const updateCalendarDate = useCallback((year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    setSelectedDate(`${year}-${month.toString().padStart(2, '0')}-01`);
  }, []);

  return (
    <View style={styles.container}>
      <Calendar
        // Forzamos el re-montaje del Calendar con la propiedad key para que se actualice la disposición
        key={`${currentYear}-${currentMonth}`}
        current={`${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          calendarBackground: Colors.menuWhite,
          todayTextColor: Colors.primary,
          arrowColor: Colors.primary,
          monthTextColor: '#1F2937',
          textDayFontFamily: 'Poppins_400Regular',
          textDayHeaderFontFamily: 'Poppins_600SemiBold',
          selectedDayBackgroundColor: '#3B82F6',
          selectedDayTextColor: '#ffffff',
          'stylesheet.calendar.header': {
            header: {
              flexDirection: 'row',
              justifyContent: 'center',
              paddingTop: 10,
              paddingBottom: 20,
            },
          },
        }}
        minDate={'1900-01-01'}
        maxDate={'2100-12-31'}
        enableSwipeMonths={false}
        showSixWeeks={true} // Forzar que siempre se muestren 6 filas
        renderHeader={CustomHeader}
        onMonthChange={(monthData: { year: number; month: number }) =>
          updateCalendarDate(monthData.year, monthData.month)
        }
      />

      {/* Modal para seleccionar año */}
      <Modal visible={showYearPicker} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  onPress={() => {
                    updateCalendarDate(year, currentMonth);
                    setShowYearPicker(false);
                  }}
                  style={styles.modalItem}
                >
                  <PoppinsText weight="regular" style={styles.modalText}>
                    {year}
                  </PoppinsText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal para seleccionar mes */}
      <Modal visible={showMonthPicker} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {months.map((month) => (
                <TouchableOpacity
                  key={month}
                  onPress={() => {
                    updateCalendarDate(currentYear, month);
                    setShowMonthPicker(false);
                  }}
                  style={styles.modalItem}
                >
                  <PoppinsText weight="regular" style={styles.modalText}>
                    {LocaleConfig.locales['es'].monthNames[month - 1]}
                  </PoppinsText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Reemplazar el texto de fecha seleccionada por dos botones */}
      <View style={styles.buttonContainer}>
        <Button
          title="Cancelar"
          variant="secondaryGray"
          mode="filled"
          size="medium"
          style={{ width: 136, height: 50 }}
          onPress={() => {
            // Lógica para cancelar: se puede reiniciar la selección o cerrar el componente
            console.log('Cancelado');
            // Ejemplo: reiniciar fecha seleccionada (o llamar a un callback onCancel)
            setSelectedDate('');
          }}
        />
        <Button
          title="Aceptar"
          variant="primary"
          mode="filled"
          size="medium"
          onPress={() => {
            console.log('Fecha aceptada:', selectedDate);
            // Llamar a un callback onAccept(selectedDate) si se requiere
          }}
          style={{ marginLeft: 12, width: 136, height: 50 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    // Fijamos un ancho máximo para que el calendario mantenga dimensiones constantes
    width: 350 - 16,
    alignSelf: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  headerButton: {
    marginHorizontal: 12,
  },
  headerText: {
    fontSize: 18,
    color: '#1F2937',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    width: 320,
    maxHeight: 400,
  },
  modalItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#1F2937',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  selectedDateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
});

export default CustomCalendar;
