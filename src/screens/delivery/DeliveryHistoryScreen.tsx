import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import PoppinsText from '../../components/PoppinsText';
import HistoryOrderCard from '../../components/HistoryOrderCard';
import { Colors, FontSizes } from '../../styles/theme';

interface Order {
  id: string;
  type: 'pedido' | 'reubicación';
  address: string;
  branch: string;
  estimatedTime: string;
  elapsedTime: string;
  completionTime: string;
  userName: string;
}

const DeliveryHistoryScreen: React.FC = () => {
  const router = useRouter();

  const completedOrders: Array<Order> = [
    {
      id: '12345',
      type: 'pedido',
      address: 'Av. Principal 123, Ciudad',
      branch: 'Sucursal Central',
      estimatedTime: '30 minutos',
      elapsedTime: 'Hace 2 días',
      completionTime: '14:30',
      userName: 'Nombre Usuario',
    },
    {
      id: '67890',
      type: 'reubicación',
      address: 'Calle Secundaria 456, Ciudad',
      branch: 'Sucursal Norte',
      estimatedTime: '45 minutos',
      elapsedTime: 'Hace 1 semana',
      completionTime: '16:45',
      userName: 'Nombre Usuario',
    },
  ];

  const handleViewDetails = (order: Order) => {
    console.log('Datos enviados al detalle del historial:', order);
    const query = encodeURIComponent(JSON.stringify(order));
    router.push(`/deliveryHistoryDetail/${order.id}?data=${query}`);
  };

  return (
    <View style={styles.container}>
      <PoppinsText style={styles.title} weight="regular">
        Historial de Pedidos
      </PoppinsText>
      <ScrollView showsVerticalScrollIndicator={false}>
        {completedOrders.map((order) => (
          <HistoryOrderCard
            key={order.id}
            orderCode={order.id}
            orderType={order.type}
            address={order.address}
            branch={order.branch}
            estimatedTime={order.estimatedTime}
            elapsedTime={order.elapsedTime}
            completionTime={order.completionTime}
            userName={order.userName}
            onViewDetails={() => handleViewDetails(order)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    padding: 16,
    marginHorizontal: 4,
  },
  title: {
    fontSize: FontSizes.h5.size,
    lineHeight: FontSizes.h5.lineHeight,
    color: Colors.textMain,
    marginBottom: 16,
  },
});

export default DeliveryHistoryScreen;
