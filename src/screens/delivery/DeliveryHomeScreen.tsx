import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import PoppinsText from '../../components/PoppinsText';
import OrderCard from '../../components/OrderCard';
import { Colors, FontSizes } from '../../styles/theme';

export default function DeliveryHomeScreen() {
  const router = useRouter();

  const orders: Array<{
    id: string;
    type: 'pedido' | 'reubicación';
    address: string;
    branch: string;
    estimatedTime: string;
    elapsedTime: string;
  }> = [
    {
      id: '12345',
      type: 'pedido',
      address: 'Av. Principal 123, Ciudad',
      branch: 'Sucursal Central',
      estimatedTime: '30 minutos',
      elapsedTime: 'Hace 10 minutos',
    },
    {
      id: '67890',
      type: 'reubicación',
      address: 'Calle Secundaria 456, Ciudad',
      branch: 'Sucursal Norte',
      estimatedTime: '45 minutos',
      elapsedTime: 'Hace 5 minutos',
    },
  ];

  const handleTakeOrder = (order: {
    id: string;
    type: 'pedido' | 'reubicación';
    address: string;
    branch: string;
    estimatedTime: string;
    elapsedTime: string;
  }) => {
    const query = encodeURIComponent(JSON.stringify(order));
    router.push(`/deliveryDetail/${order.id}?data=${query}`);
  };

  const handleDiscardOrder = (orderId: string) => {
    console.log(`Descartar pedido: ${orderId}`);
  };

  return (
    <View style={styles.container}>
      <PoppinsText style={styles.title} weight="regular">
        Pedidos asignados
      </PoppinsText>
      <ScrollView showsVerticalScrollIndicator={false}>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            orderCode={order.id}
            orderType={order.type}
            address={order.address}
            branch={order.branch}
            estimatedTime={order.estimatedTime}
            elapsedTime={order.elapsedTime}
            onTakeOrder={() => handleTakeOrder(order)}
            onDiscardOrder={() => handleDiscardOrder(order.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

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
