import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  MapPinIcon,
  ClockIcon,
  BuildingStorefrontIcon,
} from 'react-native-heroicons/outline';
import Badge from './Badge';
import Button from './Button';
import PoppinsText from './PoppinsText';
import { Colors, FontSizes } from '../styles/theme';

interface OrderCardProps {
  orderCode: string;
  orderType: 'pedido' | 'reubicación';
  address: string;
  branch: string;
  estimatedTime: string;
  elapsedTime: string;
  onTakeOrder: () => void;
  onDiscardOrder: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  orderCode,
  orderType,
  address,
  branch,
  estimatedTime,
  elapsedTime,
  onTakeOrder,
  onDiscardOrder,
}) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Badge
          variant="filled"
          color={orderType === 'pedido' ? 'info' : 'secondary_300'}
          size="small"
          borderRadius="square"
          textColor={Colors.primary}
        >
          {orderType === 'pedido' ? 'Pedido' : 'Reubicación de productos'}
        </Badge>
        <PoppinsText style={styles.elapsedTime}>Hace {elapsedTime}</PoppinsText>
      </View>

      {/* Order Code */}
      <PoppinsText weight="medium" style={styles.orderCode}>
        {orderType === 'pedido' ? 'Orden' : 'Reubicación'} #{orderCode}
      </PoppinsText>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <MapPinIcon size={20} color={Colors.primary} />
          <PoppinsText style={styles.detailText}>{address}</PoppinsText>
        </View>
        <View style={styles.detailRow}>
          <BuildingStorefrontIcon size={20} color={Colors.primary} />
          <PoppinsText style={styles.detailText}>
            Buscar en: {branch}
          </PoppinsText>
        </View>
        <View style={styles.detailRow}>
          <ClockIcon size={20} color={Colors.primary} />
          <PoppinsText style={styles.detailText}>
            Hora de entrega: {estimatedTime}
          </PoppinsText>
        </View>
      </View>

      {/* Buttons */}
      <View>
        <Button
          title="Tomar pedido"
          variant="primary"
          size="medium"
          onPress={onTakeOrder}
          style={styles.button}
        />
        <Button
          title="Descartar"
          variant="iconCancel"
          mode="outline"
          size="medium"
          onPress={onDiscardOrder}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.menuWhite,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.textLowContrast,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    minHeight: 300,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  elapsedTime: {
    fontSize: FontSizes.label.size,
    lineHeight: FontSizes.label.lineHeight,
    color: Colors.gray_500,
  },
  orderCode: {
    fontSize: FontSizes.h5.size,
    color: Colors.primary,
    marginBottom: 8,
  },
  details: {
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: FontSizes.b3.size,
    color: Colors.textMain,
    marginLeft: 8,
  },
  button: {
    marginBottom: 8,
  },
});

export default OrderCard;
