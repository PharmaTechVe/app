import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import { Colors } from '../styles/theme';
import PoppinsText from './PoppinsText';

type AlertType = 'success' | 'error' | 'warning' | 'info';
type AlertStyle = 'big' | 'other-big' | 'regular' | 'small';

interface AlertProps {
  title?: string;
  message: string;
  type?: AlertType;
  alertStyle?: AlertStyle;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  title,
  message,
  type = 'info',
  alertStyle = 'regular',
  onClose,
}) => {
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
      <View
        style={[
          styles.container,
          (alertStyle == 'regular' || alertStyle == 'other-big') && {
            borderRadius: 6,
            borderStartWidth: 6,
            borderStartColor: getAlertColors(),
          },
          (alertStyle == 'other-big' || alertStyle == 'big') && {
            padding: 20,
            borderRadius: 6,
          },
        ]}
      >
        <View
          style={[
            styles.icon,
            { backgroundColor: getAlertColors() },
            (alertStyle == 'other-big' || alertStyle == 'big') && {
              borderRadius: 6,
            },
          ]}
        >
          {getIcon()}
        </View>
        <View style={[styles.messageContainer]}>
          {title && (
            <PoppinsText
              style={[
                styles.title,
                (alertStyle == 'other-big' || alertStyle == 'big') && {
                  paddingBottom: 10,
                },
              ]}
            >
              {title}
            </PoppinsText>
          )}
          {message && alertStyle != 'small' && (
            <PoppinsText style={[styles.message]}>{message}</PoppinsText>
          )}
        </View>
        {alertStyle == 'regular' && <XMarkIcon size={30} color={'#000'} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
  },
  messageContainer: {
    padding: 2,
    borderRadius: 10,
    flex: 1,
  },
  icon: {
    marginRight: 12,
    borderRadius: 50,
    padding: 5,
  },
  title: {
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  message: {
    fontSize: 14,
  },
});

export default Alert;
