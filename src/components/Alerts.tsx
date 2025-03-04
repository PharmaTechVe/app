import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from 'react-native-heroicons/outline';
import { Colors } from '../styles/theme';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  message: string;
  type?: AlertType;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type = 'info', onClose }) => {
  const getAlertColors = () => {
    switch (type) {
      case 'success':
        return Colors.semanticSuccess;
      case 'error':
        return Colors.semanticDanger;
      case 'warning':
        return Colors.semanticWarning;
      case 'info':
      default:
        return Colors.semanticInfo;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon size={20} color={Colors.textWhite} />;
      case 'error':
        return <ExclamationCircleIcon size={20} color={Colors.textWhite} />;
      case 'warning':
        return <ExclamationTriangleIcon size={20} color={Colors.textWhite} />;
      case 'info':
      default:
        return <InformationCircleIcon size={20} color={Colors.textWhite} />;
    }
  };

  return (
    <TouchableOpacity onPress={onClose} style={{ width: '100%' }}>
      <View style={[styles.container]}>
        <View style={[styles.icon, { backgroundColor: getAlertColors() }]}>
          {getIcon()}
        </View>
        <Text style={[styles.text]}>{message}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  icon: {
    marginRight: 8,
    borderRadius: 50,
    padding: 2,
  },
  text: {
    flex: 1,
    fontSize: 14,
  },
});

export default Alert;
