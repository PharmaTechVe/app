import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import PoppinsText from '../../components/PoppinsText';
import HistoryOrderCard from '../../components/HistoryOrderCard';
import { Colors, FontSizes } from '../../styles/theme';
import { DeliveryService } from '../../services/delivery';
import { BranchService } from '../../services/branches';
import {
  OrderDeliveryDetailedResponse,
  BranchResponse,
  OrderDeliveryStatus,
} from '@pharmatech/sdk';

const DeliveryHistoryScreen: React.FC = () => {
  const router = useRouter();
  const [completedOrders, setCompletedOrders] = useState<
    OrderDeliveryDetailedResponse[]
  >([]);
  const [branchNames, setBranchNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchCompletedOrders = async () => {
    try {
      const jwt = await SecureStore.getItemAsync('auth_token');
      if (!jwt) {
        throw new Error('Token de autenticación no encontrado');
      }

      const payload = JSON.parse(atob(jwt.split('.')[1]));
      const employeeId = payload.sub;

      // Obtener órdenes completadas
      const response = await DeliveryService.getAssignedOrders(
        employeeId,
        OrderDeliveryStatus.DELIVERED,
      );

      // Obtener detalles de las órdenes
      const detailedOrders = await Promise.all(
        response.results.map(async (order) => {
          const details = await DeliveryService.getOrderDetails(order.id);
          return details;
        }),
      );

      // Obtener nombres de sucursales
      const branchIds = [
        ...new Set(detailedOrders.map((order) => order.branchId)),
      ];
      const branches = await BranchService.findAll({ page: 1, limit: 100 });
      const branchMap = branches.results.reduce(
        (acc: Record<string, string>, branch: BranchResponse) => {
          if (branchIds.includes(branch.id)) {
            acc[branch.id] = branch.name;
          }
          return acc;
        },
        {},
      );

      setBranchNames(branchMap);
      setCompletedOrders(detailedOrders);
    } catch (error) {
      console.error('Error al obtener el historial de pedidos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleViewDetails = (order: OrderDeliveryDetailedResponse) => {
    const query = encodeURIComponent(JSON.stringify(order));
    router.push(`/deliveryHistoryDetail/${order.id}?data=${query}`);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCompletedOrders();
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
      >
        <PoppinsText style={styles.title} weight="regular">
          Historial de Pedidos
        </PoppinsText>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : completedOrders.length === 0 ? (
          <PoppinsText style={styles.noOrdersText}>
            No tienes pedidos completados.
          </PoppinsText>
        ) : (
          completedOrders.map((order) => (
            <HistoryOrderCard
              key={order.id}
              orderCode={order.id.split('-')[0]} // Mostrar solo los primeros 8 caracteres
              orderType="pedido"
              address={order.address?.adress || 'Dirección no disponible'}
              branch={branchNames[order.branchId] || 'Sucursal no disponible'}
              estimatedTime={new Date(order.estimatedTime).toLocaleTimeString(
                'es-VE',
                {
                  hour: '2-digit',
                  minute: '2-digit',
                },
              )}
              elapsedTime={calculateElapsedTime(order.createdAt)}
              completionTime={new Date(order.updatedAt).toLocaleTimeString(
                'es-VE',
                {
                  hour: '2-digit',
                  minute: '2-digit',
                },
              )}
              userName={`${order.user?.firstName || 'Usuario'} ${
                order.user?.lastName || ''
              }`}
              onViewDetails={() => handleViewDetails(order)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const calculateElapsedTime = (createdAt: string): string => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diffInMinutes = Math.floor(
    (now.getTime() - createdDate.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutos`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} horas`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} días`;
  }
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
  noOrdersText: {
    fontSize: FontSizes.b2.size,
    color: Colors.textLowContrast,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default DeliveryHistoryScreen;
