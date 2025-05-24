import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  InformationCircleIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  XMarkIcon,
} from 'react-native-heroicons/solid';
import Badge from '../../components/Badge';
import PoppinsText from '../../components/PoppinsText';
import Button from '../../components/Button';
import DeliveryMap from '../../components/DeliveryMap';
import CustomerAvatar from '../../components/CustomerAvatar';
import Alert from '../../components/Alerts';
import { Colors, FontSizes } from '../../styles/theme';
import { DeliveryService } from '../../services/delivery';
import { BranchService } from '../../services/branches';
import { OrderDeliveryStatus, OrderDetailedResponse } from '@pharmatech/sdk';
import { UserService } from '../../services/user';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  setOrderDetails,
  setDeliveryState,
} from '../../redux/slices/deliverySlice';
import Popup from '../../components/Popup';

const DeliveryDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const orderDetails = useSelector(
    (state: RootState) => state.delivery.orders[id as string],
  );
  const [order, setOrder] = useState<OrderDetailedResponse | undefined>(
    undefined,
  );
  const [isOrderDetailsLoading, setIsOrderDetailsLoading] = useState(true);
  const [isFetchingOrder, setIsFetchingOrder] = useState(false); // Nuevo estado de carga para fetchOrder
  const [branchNames, setBranchNames] = useState<
    Record<string, { name: string; latitude: number; longitude: number }>
  >({});
  const [deliveryStateBadge, setDeliveryStateBadge] = useState(0);
  const router = useRouter();
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);

  const branchLocation = {
    latitude: branchNames[orderDetails?.branchId ?? '']?.latitude || 0,
    longitude: branchNames[orderDetails?.branchId ?? '']?.longitude || 0,
  };

  const customerLocation = {
    latitude: orderDetails?.address?.latitude || 0,
    longitude: orderDetails?.address?.longitude || 0,
  };

  const deliveryState = useSelector(
    (state: RootState) => state.delivery.deliveryState[id as string] || 0,
  );

  // Estados para las alertas
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>(
    'info',
  );
  const [alertMessage, setAlertMessage] = useState('');

  const deliveryStates = [
    'Buscando pedido en sucursal de origen',
    'Haciendo entrega del pedido',
  ];

  const buttonStates = [
    'Comenzar entrega',
    'Llegué a la sucursal',
    'Ya tengo los productos del pedido',
    'Ir a destino de entrega',
    'Ya hice la entrega',
  ];

  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!orderDetails) {
          const details = await DeliveryService.getOrderDetails(id as string);
          dispatch(setOrderDetails({ id: id as string, details }));
        }
      } catch (error) {
        console.error('Error al obtener los detalles del pedido:', error);
      } finally {
        setIsOrderDetailsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, orderDetails, dispatch]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
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
      } catch (error) {
        console.error('Error al obtener las sucursales:', error);
      } finally {
        setIsFetchingOrder(false);
      }
    };

    if (orderDetails) {
      fetchBranches();
    }
  }, [orderDetails]);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsFetchingOrder(true); // Iniciar el indicador de carga
      let timerId: NodeJS.Timeout | null = null; // Identificador del temporizador

      try {
        if (!orderDetails) {
          // Agregar un temporizador de 2 segundos antes de mostrar el error
          timerId = setTimeout(() => {
            if (!orderDetails) {
              console.error(
                'No se encontraron detalles de la orden de tipo delivery.',
              );
            }
          }, 2000);
          return;
        }

        const orderId = orderDetails.orderId;
        console.log('ID de la orden:', orderId);

        const order = await UserService.getOrder(orderId);

        if (order.success) {
          console.log('Datos del pedido:', order.data);
          setOrder(order.data);
        } else {
          console.error('Error al obtener el pedido:', order.error);
        }
      } catch (error) {
        console.error('Error en fetchOrder:', error);
      } finally {
        setIsFetchingOrder(false); // Finalizar el indicador de carga
        if (timerId) {
          clearTimeout(timerId); // Cancelar el temporizador si los datos están disponibles
        }
      }
    };

    fetchOrder();
  }, [orderDetails]);

  // Mostrar un indicador de carga mientras se obtienen los detalles del pedido o la orden
  if (isOrderDetailsLoading || isFetchingOrder) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  if (!orderDetails) {
    // Mostrar un mensaje de error si no se encuentran los detalles del pedido
    return (
      <View style={styles.errorContainer}>
        <PoppinsText style={styles.errorText}>
          No se encontraron datos del pedido.
        </PoppinsText>
      </View>
    );
  }

  const handleNextState = async () => {
    try {
      if (deliveryState === buttonStates.length - 1) {
        // Mostrar el popup de confirmación
        setShowConfirmationPopup(true);
        return;
      }

      // Lógica para otros estados
      switch (buttonStates[deliveryState]) {
        case 'Comenzar entrega':
          await DeliveryService.updateOrderStatus(
            orderDetails!.id,
            OrderDeliveryStatus.WAITING_CONFIRMATION,
          );
          break;
        case 'Ya tengo los productos del pedido':
          await DeliveryService.updateOrderStatus(
            orderDetails!.id,
            OrderDeliveryStatus.PICKED_UP,
          );
          break;
        case 'Ir a destino de entrega':
          await DeliveryService.updateOrderStatus(
            orderDetails!.id,
            OrderDeliveryStatus.IN_ROUTE,
          );
          setDeliveryStateBadge(1); // Cambiar a "Haciendo entrega del pedido"
          break;
      }

      setAlertType('info');
      setAlertMessage('Se actualizó el estado del pedido.');
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 2500);

      dispatch(
        setDeliveryState({ id: id as string, state: deliveryState + 1 }),
      );
    } catch (error) {
      console.error('Error al actualizar el estado del delivery:', error);

      setAlertType('error');
      setAlertMessage('Hubo un problema al actualizar el estado del pedido.');
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };

  const handleConfirmDelivery = async () => {
    try {
      // Actualizar el estado de la orden a DELIVERED
      await DeliveryService.updateOrderStatus(
        orderDetails!.id,
        OrderDeliveryStatus.DELIVERED,
      );

      setAlertType('success');
      setAlertMessage('La entrega se ha finalizado correctamente.');
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 2500);

      // Redirigir al usuario a (delivery-tabs)
      router.replace('/(delivery-tabs)');
    } catch (error) {
      console.error('Error al finalizar la entrega:', error);

      setAlertType('error');
      setAlertMessage('Hubo un problema al finalizar la entrega.');
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    } finally {
      setShowConfirmationPopup(false); // Cerrar el popup
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgColor }}>
      {/* Mostrar alertas */}
      {showAlert && (
        <View style={styles.alertContainer}>
          <Alert
            type={alertType}
            title={alertType === 'info' ? 'Información' : 'Error'}
            message={alertMessage}
            borderColor
            onClose={() => setShowAlert(false)}
          />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        {/* Título y botón de información */}
        <View style={styles.header}>
          <PoppinsText style={styles.title}>Detalle del pedido</PoppinsText>
          <InformationCircleIcon size={24} color={Colors.primary} />
        </View>

        {/* Estado del pedido */}
        <View style={styles.statusContainer}>
          <PoppinsText style={styles.statusLabel}>Estado:</PoppinsText>
          <Badge
            variant="filled"
            color="info"
            size="small"
            borderRadius="square"
            textColor={Colors.primary}
          >
            {deliveryStates[deliveryStateBadge]}
          </Badge>
        </View>

        {/* Ubicaciones del pedido */}
        <PoppinsText weight="medium" style={styles.sectionTitle}>
          Ubicaciones del pedido
        </PoppinsText>
        <View style={styles.locationsContainer}>
          {/* Círculo superior */}
          <View style={styles.circleTop} />

          {/* Línea vertical punteada */}
          <View style={styles.verticalLine} />

          {/* Círculo inferior */}
          <View style={styles.circleBottom} />

          {/* Primera carta */}
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <BuildingStorefrontIcon
                size={20}
                color={Colors.primary}
                style={styles.icon}
              />
              <PoppinsText style={styles.cardTitle}>
                Sucursal de origen
              </PoppinsText>
            </View>
            <PoppinsText style={styles.cardSubtitle}>
              {branchNames[orderDetails.branchId]?.name ||
                'Sucursal no disponible'}
            </PoppinsText>
          </View>

          {/* Segunda carta */}
          <View style={styles.card2}>
            <View style={styles.cardRow}>
              <MapPinIcon
                size={20}
                color={Colors.primary}
                style={styles.icon}
              />
              <PoppinsText style={styles.cardTitle}>Entrega</PoppinsText>
            </View>
            <PoppinsText style={styles.cardSubtitle}>
              {orderDetails.address.adress}
            </PoppinsText>
            <PoppinsText style={styles.cardSubtitle}>
              {orderDetails.address.referencePoint || 'Sin referencia'}
            </PoppinsText>
          </View>
        </View>

        {/* Información de contacto */}
        <PoppinsText weight="medium" style={styles.sectionTitle}>
          Información de contacto
        </PoppinsText>
        <View style={styles.card3}>
          {/* Avatar del cliente */}
          <View style={styles.cardRow}>
            <View style={styles.icon}>
              <CustomerAvatar
                firstName={orderDetails.user.firstName}
                lastName={orderDetails.user.lastName}
                profilePicture={orderDetails.user.profilePicture}
                scale={20}
              />
            </View>
            <PoppinsText style={styles.cardSubtitle1}>
              {orderDetails.user.firstName} {orderDetails.user.lastName}
            </PoppinsText>
          </View>

          {/* Teléfono */}
          <View style={styles.cardRow}>
            <PhoneIcon size={20} color={Colors.primary} style={styles.icon} />
            <PoppinsText style={styles.cardSubtitle1}>
              {orderDetails.user.phoneNumber}
            </PoppinsText>
          </View>
        </View>

        {/* Recorrido de entrega */}
        <PoppinsText weight="medium" style={styles.sectionTitle}>
          Recorrido de entrega
        </PoppinsText>
        <DeliveryMap
          deliveryState={deliveryState}
          branchLocation={branchLocation}
          customerLocation={customerLocation}
          style={{ height: 300, marginBottom: 16 }}
        />

        <Button
          title={'Ver mapa ampliado'}
          variant="primary"
          size="medium"
          onPress={() => setIsMapModalVisible(true)}
          style={styles.expandButton}
        />

        {/* Pedido (contenido comentado) */}
        <View style={styles.sectionHeader}>
          <PoppinsText weight="medium" style={styles.sectionTitle}>
            Pedido
          </PoppinsText>
          <PoppinsText style={styles.totalProducts}>
            Total:{' '}
            {order?.details?.reduce(
              (total, detail) => total + detail.quantity,
              0,
            ) || 0}{' '}
            productos
          </PoppinsText>
        </View>
        {order?.details?.map((detail, index) => {
          console.log(`Producto ${index + 1}:`, detail); // Log para depuración
          return (
            <View
              key={detail.productPresentation.id}
              style={styles.productCard}
            >
              {/* Imagen del producto */}
              <Image
                source={{
                  uri: detail.productPresentation.product.images[0]?.url,
                }}
                style={styles.productImage}
                resizeMode="contain"
              />
              <View style={styles.productInfo}>
                {/* Nombre de la presentación del producto */}
                <PoppinsText
                  style={styles.productName}
                  numberOfLines={2} // Limitar a 2 líneas
                  ellipsizeMode="tail" // Mostrar "..." si el texto es muy largo
                >
                  {detail.productPresentation.product.name}{' '}
                  {detail.productPresentation.presentation.name}{' '}
                  {detail.productPresentation.presentation.quantity}{' '}
                  {detail.productPresentation.presentation.measurementUnit}
                </PoppinsText>
                {/* Cantidad del producto */}
                <PoppinsText style={styles.productQuantity}>
                  Cantidad: {detail.quantity}
                </PoppinsText>
              </View>
            </View>
          );
        })}

        {/* Espaciado adicional al final */}
        <View style={styles.scrollSpacer} />
      </ScrollView>

      {/* Botón flotante */}
      <Button
        title={buttonStates[deliveryState]}
        variant="primary"
        size="medium"
        onPress={handleNextState}
        style={styles.floatingButton}
      />
      <Popup
        visible={showConfirmationPopup}
        headerText="Confirmar entrega"
        bodyText="¿Estás seguro de que has realizado la entrega del pedido?"
        primaryButton={{
          text: 'Confirmar',
          onPress: handleConfirmDelivery,
        }}
        secondaryButton={{
          text: 'Cancelar',
          onPress: () => setShowConfirmationPopup(false),
        }}
        onClose={() => setShowConfirmationPopup(false)}
      />

      {/* Modal para el mapa ampliado */}
      <Modal
        visible={isMapModalVisible}
        animationType="slide"
        transparent={true} // Hacer el modal transparente para superponer el contenido
        onRequestClose={() => setIsMapModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Botón de cierre */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsMapModalVisible(false)}
          >
            <XMarkIcon size={24} color={Colors.textMain} />
          </TouchableOpacity>

          {/* Mapa ampliado */}
          <DeliveryMap
            deliveryState={deliveryState}
            branchLocation={branchLocation}
            customerLocation={customerLocation}
          />

          {/* Botón flotante sobre el modal */}
          <Button
            title={buttonStates[deliveryState]}
            variant="primary"
            size="medium"
            onPress={handleNextState}
            style={[styles.floatingButton, styles.modalFloatingButton]}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: FontSizes.h5.size,
    color: Colors.textMain,
  },
  container: {
    marginTop: 32,
    padding: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: FontSizes.s1.size,
    lineHeight: FontSizes.s1.lineHeight,
    color: Colors.primary,
  },
  locationsContainer: {
    position: 'relative',
    marginBottom: 16,
    paddingLeft: 0,
  },
  verticalLine: {
    position: 'absolute',
    left: 4,
    top: '25%',
    height: '50%',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: Colors.primary_300,
  },
  circleTop: {
    position: 'absolute',
    left: 0,
    top: '25%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary_300,
    transform: [{ translateY: -4 }],
  },
  circleBottom: {
    position: 'absolute',
    left: 0,
    top: '75%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary_300,
    transform: [{ translateY: -4 }],
  },
  card: {
    backgroundColor: Colors.menuWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginLeft: 28,
    flex: 1,
  },
  card2: {
    backgroundColor: Colors.menuWhite,
    borderRadius: 16,
    padding: 16,
    marginLeft: 28,
    flex: 1,
  },
  card3: {
    backgroundColor: Colors.menuWhite,
    borderRadius: 16,
    padding: 16,
    paddingBottom: 8,
    marginBottom: 16,
    flex: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 6,
  },
  cardTitle: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.textMain,
  },
  cardSubtitle: {
    fontSize: FontSizes.label.size,
    color: Colors.textMain,
  },
  cardSubtitle1: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.textMain,
  },
  mapPlaceholder: {
    height: 300,
    backgroundColor: Colors.gray_100,
    borderRadius: 16,
    marginBottom: 16,
  },
  totalProducts: {
    fontSize: FontSizes.b3.size,
    color: Colors.textLowContrast,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.menuWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden', // Asegura que el contenido no se salga de la carta
  },
  productImage: {
    width: 50,
    height: 50,
    backgroundColor: Colors.gray_100,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1, // Permite que el contenido ocupe el espacio restante
  },
  productName: {
    fontSize: FontSizes.b2.size,
    color: Colors.textMain,
    flexShrink: 1, // Evita que el texto desborde
  },
  productQuantity: {
    fontSize: FontSizes.b3.size,
    color: Colors.textLowContrast,
    marginTop: 4,
  },
  productPrice: {
    fontSize: FontSizes.b3.size,
    color: Colors.textLowContrast,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FontSizes.h5.size,
    color: Colors.semanticDanger,
  },
  scrollSpacer: {
    height: 64 + 16,
  },
  alertContainer: {
    position: 'absolute',
    width: 326,
    left: '50%',
    marginLeft: -163,
    top: 20,
    zIndex: 1000,
  },
  expandButton: {
    marginBottom: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: Colors.textWhite,
    padding: 8,
    borderRadius: 16,
  },
  fullScreenMapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalFloatingButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 10,
  },
});

export default DeliveryDetailScreen;
