import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Alert from './Alerts';

type AlertContextType = {
  showAlert: (
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    message: string,
  ) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<'success' | 'error' | 'info' | 'warning'>(
    'info',
  );
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const showAlert = (
    alertType: 'success' | 'error' | 'info' | 'warning',
    alertTitle: string,
    alertMessage: string,
  ) => {
    setType(alertType);
    setTitle(alertTitle);
    setMessage(alertMessage);
    setVisible(true);

    // Ocultar la alerta automáticamente después de 3 segundos
    setTimeout(() => setVisible(false), 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {visible && (
        <View style={styles.alertContainer}>
          <Alert
            type={type}
            title={title}
            message={message}
            borderColor
            onClose={() => setVisible(false)}
          />
        </View>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: [{ translateX: -163 }], // Centrar horizontalmente
    zIndex: 1000,
    width: 326,
  },
});
