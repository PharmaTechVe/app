import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';

type AlertType = 'success' | 'error' | 'warning' | 'info';
type AlertStyle = 'big' | 'regular' | 'small';

interface AlertProps {
  title: string;
  message?: string;
  type?: AlertType;
  alertStyle?: AlertStyle;
  borderColor?: boolean;
  onClose?: () => void;
}

let activeAlertClose: (() => void) | null = null;

const Alert: React.FC<AlertProps> = ({
  title,
  message,
  type = 'info',
  alertStyle = 'regular',
  borderColor = false,
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

  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Close any active alert before showing a new one
    if (activeAlertClose) {
      activeAlertClose();
    }
    activeAlertClose = handleClose;

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      if (activeAlertClose === handleClose) {
        activeAlertClose = null;
      }
    };
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  };

  return (
    <TouchableOpacity onPress={handleClose} style={{ width: '100%' }}>
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY }], opacity },
          borderColor && {
            borderRadius: 6,
            borderStartWidth: 6,
            borderStartColor: getAlertColors(),
          },
          alertStyle == 'big' && {
            padding: 20,
            borderRadius: 6,
          },
        ]}
      >
        <View
          style={[
            styles.icon,
            { backgroundColor: getAlertColors() },
            alertStyle == 'big' && {
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
                alertStyle == 'big' && {
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
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 5,
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
    fontSize: FontSizes.b3.size,
  },
});

export default Alert;
