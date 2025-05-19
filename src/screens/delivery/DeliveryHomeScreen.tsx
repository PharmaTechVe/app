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
  OrderDeliveryStatus,
} from '@pharmatech/sdk';
import { useAlert } from '../../components/AlertProvider'; // Importar el hook useAlert
import * as Location from 'expo-location'; // Importar Location para obtener la ubicación actual
import { Config } from '../../config'; // Importar la configuración de la API de Google Maps

// Definir el tipo para un leg de la API de Google Maps Directions
interface GoogleMapsLeg {
  duration: {
    value: number; // Duración en segundos
  };
}

const calculateTravelTime = async (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number },
): Promise<number> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${Config.googleMapsApiKey}`,
    );
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      // Extraer el tiempo estimado en segundos
      const durationInSeconds = data.routes[0].legs.reduce(
        (total: number, leg: GoogleMapsLeg) => total + leg.duration.value,
        0,
      );

      // Convertir a minutos
      return Math.ceil(durationInSeconds / 60);
    } else {
      console.error('No se pudo calcular el tiempo estimado.');
      return 0;
    }
  } catch (error) {
    console.error('Error al calcular el tiempo estimado:', error);
    return 0;
  }
};

// Extender el tipo OrderDeliveryDetailedResponse
type ExtendedOrderDeliveryDetailedResponse = OrderDeliveryDetailedResponse & {
  formattedEstimatedTime: string; // Nueva propiedad para el tiempo formateado
};

export default function DeliveryHomeScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();

  const [orders, setOrders] = useState<ExtendedOrderDeliveryDetailedResponse[]>(
    [],
  );
  const [branchNames, setBranchNames] = useState<
    Record<string, { name: string; latitude: number; longitude: number }>
  >({});
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

      // Obtener las órdenes asignadas
      const response = await DeliveryService.getAssignedOrders(employeeId);

      // Obtener las sucursales
      const branches = await BranchService.findAll({ page: 1, limit: 100 });
      const branchMap = branches.results.reduce(
        (
          acc: Record<
            string,
            { name: string; latitude: number; longitude: number }
          >,
          branch,
        ) => {
          acc[branch.id] = {
            name: branch.name,
            latitude: branch.latitude,
            longitude: branch.longitude,
          };
          return acc;
        },
        {},
      );
      setBranchNames(branchMap);

      // Procesar las órdenes con cálculo de tiempo estimado
      const detailedOrders: ExtendedOrderDeliveryDetailedResponse[] =
        await Promise.all(
          response.results.map(async (order) => {
            const details = await DeliveryService.getOrderDetails(order.id);

            // Obtener la ubicación actual del repartidor
            const location = await Location.getCurrentPositionAsync({});
            const deliveryLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };

            // Obtener la ubicación de la sucursal
            const branchLocation = {
              latitude: branchMap[details.branchId]?.latitude || 0,
              longitude: branchMap[details.branchId]?.longitude || 0,
            };

            // Obtener la ubicación del cliente
            const customerLocation = {
              latitude: details.address.latitude,
              longitude: details.address.longitude,
            };

            // Calcular tiempos de viaje
            const timeToBranch = await calculateTravelTime(
              deliveryLocation,
              branchLocation,
            );
            const timeToCustomer = await calculateTravelTime(
              branchLocation,
              customerLocation,
            );

            // Tiempo total estimado en minutos
            const totalEstimatedTime = timeToBranch + timeToCustomer;

            // Formatear el tiempo estimado
            const formattedEstimatedTime =
              totalEstimatedTime < 60
                ? `${totalEstimatedTime} minutos`
                : `${Math.floor(totalEstimatedTime / 60)} horas ${
                    totalEstimatedTime % 60
                  } minutos`;

            // Retornar la orden con el tiempo estimado formateado
            return {
              ...details,
              estimatedTime: new Date(), // Mantener el tipo original como Date
              formattedEstimatedTime, // Asignar el tiempo formateado
            };
          }),
        );

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
              branch={
                branchNames[order.branchId]?.name || 'Sucursal no disponible'
              }
              estimatedTime={order.formattedEstimatedTime} // Mostrar el tiempo estimado
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
        <View style={styles.height} />
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
  height: {
    height: 64,
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
