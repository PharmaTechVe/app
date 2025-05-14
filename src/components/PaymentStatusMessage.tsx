import React from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from 'react-native-heroicons/outline';
import theme from '../styles/theme';
import { Text, View, StyleSheet } from 'react-native';

type OrderStatus =
  | 'requested'
  | 'approved'
  | 'ready_for_pickup'
  | 'in_progress'
  | 'rejected';

interface PaymentStatusMessageProps {
  orderStatus: OrderStatus;
  orderNumber: string;
  userName: string;
}

const statusConfig: Record<
  OrderStatus,
  {
    icon: React.ElementType;
    color: string;
    title: string;
    message: (orderNumber: string, userName: string) => string;
  }
> = {
  requested: {
    icon: ClockIcon,
    color: theme.Colors.semanticWarning,
    title: 'Orden En Espera',
    message: () =>
      `Estamos procesando tu orden. En un momento actualizaremos el estado de tu orden  Si tienes alguna duda, por favor contacta a nuestro equipo de soporte.`,
  },

  approved: {
    icon: CheckCircleIcon,
    color: theme.Colors.semanticSuccess,
    title: 'Orden aprobada',
    message: (_orderNumber, userName) =>
      `¡Gracias por tu compra, ${userName}! Tu orden ha sido aprobada.`,
  },
  ready_for_pickup: {
    icon: CheckCircleIcon,
    color: theme.Colors.semanticSuccess,
    title: 'Lista para recoger',
    message: () =>
      'Tu pedido está listo para ser recogido en la sucursal seleccionada.',
  },
  in_progress: {
    icon: ClockIcon,
    color: theme.Colors.semanticWarning,
    title: 'Orden En Espera',
    message: () =>
      'Tu pedido está en espera. Pronto comenzaremos a procesarlo.',
  },
  rejected: {
    icon: XCircleIcon,
    color: theme.Colors.semanticDanger,
    title: 'Orden rechazada',
    message: () =>
      'No pudimos procesar tu orden. Lamentamos informarte que hubo un problema al generar tu pedido.',
  },
};

const PaymentStatusMessage: React.FC<PaymentStatusMessageProps> = ({
  orderStatus,
  orderNumber,
  userName,
}) => {
  const config = statusConfig[orderStatus] || statusConfig['requested'];
  const Icon = config.icon;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon width={30} height={30} color={config.color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.Colors.textMain }]}>
          {config.title} #{orderNumber}
        </Text>
        <Text style={[styles.message, { color: theme.Colors.textLowContrast }]}>
          {config.message(orderNumber, userName)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
    padding: 16,
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.Fonts.poppinsSemibold,
  },
  message: {
    fontSize: 14,
    fontFamily: theme.Fonts.poppinsRegular,
  },
});

export default PaymentStatusMessage;
