import React from 'react';
import { CheckCircleIcon, XCircleIcon } from 'react-native-heroicons/outline';
import theme from '../styles/theme';
import { Text, View, StyleSheet } from 'react-native';

interface PurchaseStatusMessageProps {
  status: 'approved' | 'rejected';
  orderNumber: string;
  userName: string;
}

const PurchaseStatusMessage: React.FC<PurchaseStatusMessageProps> = ({
  status,
  orderNumber,
  userName,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {status === 'approved' ? (
          <CheckCircleIcon
            width={30}
            height={30}
            color={theme.Colors.semanticSuccess}
          />
        ) : (
          <XCircleIcon
            width={30}
            height={30}
            color={theme.Colors.semanticDanger}
          />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.Colors.textMain }]}>
          Orden #{orderNumber}
        </Text>
        <Text style={[styles.message, { color: theme.Colors.textLowContrast }]}>
          {status === 'approved'
            ? `¡Gracias por tu compra, ${userName}!`
            : 'No pudimos procesar tu orden. Lamentamos informarte que hubo un problema al generar tu pedido.'}
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

export default PurchaseStatusMessage;
