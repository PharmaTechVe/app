import { useFocusEffect } from '@react-navigation/native'; // Importar useFocusEffect
import React, { useCallback, useState } from 'react';
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
import OrderCard from '../../components/OrderCard';
import Popup from '../../components/Popup';
import { Colors, FontSizes } from '../../styles/theme';
import { DeliveryService } from '../../services/delivery';
import { BranchService } from '../../services/branches';
import {
  OrderDeliveryDetailedResponse,
  BranchResponse,
  OrderDeliveryStatus,
} from '@pharmatech/sdk';
import { useAlert } from '../../components/AlertProvider'; // Importar el hook useAlert

export default function DeliveryHomeScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();

  const [orders, setOrders] = useState<OrderDeliveryDetailedResponse[]>([]);
  const [branchNames, setBranchNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] =
    useState<OrderDeliveryDetailedResponse | null>(null);
  const [showDiscardPopup, setShowDiscardPopup] = useState<boolean>(false);

  const fetchAssignedOrders = async () => {
    try {
      const jwt = await SecureStore.getItemAsync('auth_token');
      if (!jwt) {
        throw new Error('Token de autenticación no encontrado');
      }

      const payload = JSON.parse(atob(jwt.split('.')[1]));
      const employeeId = payload.sub;

      const response = await DeliveryService.getAssignedOrders(employeeId);

      const detailedOrders = await Promise.all(
        response.results.map(async (order) => {
          const details = await DeliveryService.getOrderDetails(order.id);
          return details;
        }),
      );

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
      setOrders(detailedOrders);
    } catch (error) {
      console.error('Error al obtener las órdenes asignadas:', error);
      showAlert(
        'error',
        'Error',
        'No se pudieron cargar las órdenes asignadas.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Usar useFocusEffect para refrescar la pantalla al regresar
  useFocusEffect(
    useCallback(() => {
      fetchAssignedOrders(); // Refrescar las órdenes asignadas
    }, []),
  );

  const handleTakeOrder = (order: OrderDeliveryDetailedResponse) => {
    const query = encodeURIComponent(JSON.stringify(order));
    router.push(`/deliveryDetail/${order.id}?data=${query}`);
  };

  const handleDiscardOrder = (order: OrderDeliveryDetailedResponse) => {
    setSelectedOrder(order);
    setShowDiscardPopup(true);
  };

  const confirmDiscardOrder = async () => {
    if (!selectedOrder) return;

    try {
      setLoading(true);
      await DeliveryService.updateOrderStatus(
        selectedOrder.id,
        OrderDeliveryStatus.TO_ASSIGN,
      );
      showAlert('success', 'Éxito', 'La orden ha sido descartada.');
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== selectedOrder.id),
      );
    } catch (error) {
      console.error('Error al descartar la orden:', error);
      showAlert('error', 'Error', 'No se pudo descartar la orden.');
    } finally {
      setLoading(false);
      setShowDiscardPopup(false);
      setSelectedOrder(null);
    }
  };

  const cancelDiscardOrder = () => {
    setShowDiscardPopup(false);
    setSelectedOrder(null);
  };

  const formatTime = (isoDate: string | Date): string => {
    const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate;
    return date.toLocaleTimeString('es-VE', {
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAssignedOrders();
  };

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
          Pedidos asignados
        </PoppinsText>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : orders.length === 0 ? (
          <PoppinsText style={styles.noOrdersText}>
            No tienes pedidos asignados.
          </PoppinsText>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              orderCode={order.orderId.split('-')[0]} // Mostrar solo los primeros 8 caracteres
              orderType="pedido"
              address={order.address?.adress || 'Dirección no disponible'}
              branch={branchNames[order.branchId] || 'Sucursal no disponible'}
              estimatedTime={formatTime(order.estimatedTime)} // Pasar directamente la cadena ISO
              elapsedTime={calculateElapsedTime(order.createdAt)}
              deliveryStatus={
                order.deliveryStatus as
                  | 'assigned'
                  | 'waiting_confirmation'
                  | 'picked_up'
                  | 'in_route'
              }
              onTakeOrder={() => handleTakeOrder(order)}
              onDiscardOrder={
                order.deliveryStatus === 'assigned'
                  ? () => handleDiscardOrder(order)
                  : undefined
              }
            />
          ))
        )}
      </ScrollView>

      {/* Popup de confirmación para descartar orden */}
      <Popup
        visible={showDiscardPopup}
        headerText="Descartar orden"
        bodyText="¿Estás seguro de que deseas descartar esta orden? Esto notificará al administrador para reasignarla."
        primaryButton={{
          text: 'Descartar',
          onPress: confirmDiscardOrder,
        }}
        secondaryButton={{
          text: 'Cancelar',
          onPress: cancelDiscardOrder,
        }}
        onClose={cancelDiscardOrder}
      />
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
  noOrdersText: {
    fontSize: FontSizes.b2.size,
    color: Colors.textLowContrast,
    textAlign: 'center',
    marginTop: 16,
  },
});
