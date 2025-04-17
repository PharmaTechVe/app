import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  MapPinIcon,
  ClockIcon,
  BuildingStorefrontIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import Badge from './Badge';
import Avatar from './Avatar';
import Button from './Button';
import PoppinsText from './PoppinsText';
import { Colors, FontSizes } from '../styles/theme';

interface HistoryOrderCardProps {
  orderCode: string;
  orderType: 'pedido' | 'reubicación';
  address: string;
  branch: string;
  estimatedTime: string;
  elapsedTime: string;
  completionTime: string;
  userName: string;
  onViewDetails: () => void;
}

const HistoryOrderCard: React.FC<HistoryOrderCardProps> = ({
  orderCode,
  orderType,
  address,
  branch,
  estimatedTime,
  elapsedTime,
  completionTime,
  userName,
  onViewDetails,
}) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Badge
          variant="filled"
          color="primary_300"
          size="small"
          borderRadius="square"
        >
          {`${elapsedTime}, ${completionTime}`}
        </Badge>
      </View>

      {/* Order Code */}
      <PoppinsText weight="medium" style={styles.orderCode}>
        <CheckCircleIcon size={20} color={Colors.semanticSuccess} />{' '}
        {orderType === 'pedido' ? 'Orden' : 'Reubicación'} #{orderCode}
      </PoppinsText>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <MapPinIcon size={20} color={Colors.primary} />
          <PoppinsText style={styles.detailText}>{address}</PoppinsText>
        </View>
        <View style={styles.detailRow}>
          <Avatar model="small" />
          <PoppinsText style={styles.detailText}>{userName}</PoppinsText>
        </View>
        <View style={styles.detailRow}>
          <BuildingStorefrontIcon size={20} color={Colors.primary} />
          <PoppinsText style={styles.detailText}>
            Buscar en: {branch}
          </PoppinsText>
        </View>
        <View style={styles.detailRow}>
          <ClockIcon size={20} color={Colors.primary} />
          <PoppinsText style={styles.detailText}>{estimatedTime}</PoppinsText>
        </View>
      </View>

      {/* Button */}
      <Button
        title="Ver detalles"
        variant="primary"
        size="medium"
        onPress={onViewDetails}
        style={styles.button}
      />
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
    minHeight: 280,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderCode: {
    fontSize: FontSizes.h5.size,
    color: Colors.primary,
    marginBottom: 8,
  },
  elapsedTime: {
    fontSize: FontSizes.label.size,
    lineHeight: FontSizes.label.lineHeight,
    color: Colors.gray_500,
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

export default HistoryOrderCard;
