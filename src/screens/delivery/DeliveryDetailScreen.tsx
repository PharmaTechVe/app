import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  InformationCircleIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
} from 'react-native-heroicons/solid';
import Badge from '../../components/Badge';
import PoppinsText from '../../components/PoppinsText';
import Button from '../../components/Button';
import DeliveryMap from '../../components/DeliveryMap';
import CustomerAvatar from '../../components/CustomerAvatar';
import { Colors, FontSizes } from '../../styles/theme';
import { DeliveryService } from '../../services/delivery';
import { BranchService } from '../../services/branches';
import {
  OrderDeliveryDetailedResponse,
  OrderDeliveryStatus,
  BranchResponse,
} from '@pharmatech/sdk';

const DeliveryDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [orderDetails, setOrderDetails] =
    useState<OrderDeliveryDetailedResponse | null>(null);
  const [branchNames, setBranchNames] = useState<
    Record<string, { name: string; latitude: number; longitude: number }>
  >({});
  const [loading, setLoading] = useState(true);
  const [deliveryState, setDeliveryState] = useState(0);
  const [deliveryStateBadge, setDeliveryStateBadge] = useState(0);
  const router = useRouter();

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
    'Finalizar entrega',
  ];

  const branchLocation = {
    latitude: branchNames[orderDetails?.branchId ?? '']?.latitude || 0,
    longitude: branchNames[orderDetails?.branchId ?? '']?.longitude || 0,
  };

  const customerLocation = {
    latitude: orderDetails?.address?.latitude || 0,
    longitude: orderDetails?.address?.longitude || 0,
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        console.log('Fetching order details for delivery ID:', id);
        const details = await DeliveryService.getOrderDetails(id as string);
        console.log('Order details fetched:', details);

        setOrderDetails(details);

        // Validar si las coordenadas del cliente están disponibles
        if (!details.address.latitude || !details.address.longitude) {
          console.warn('Las coordenadas del cliente no están disponibles.');
        }

        // Obtener todas las sucursales y mapear sus nombres y coordenadas
        const branches = await BranchService.findAll({ page: 1, limit: 100 });
        const branchMap = branches.results.reduce(
          (
            acc: Record<
              string,
              { name: string; latitude: number; longitude: number }
            >,
            branch: BranchResponse,
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
        console.error('Error al obtener los detalles del pedido:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleNextState = async () => {
    console.log(
      'handleNextState called, current deliveryState:',
      deliveryState,
    );
    console.log('Current button state:', buttonStates[deliveryState]);
    console.log('deliveryState:', deliveryState);
    console.log('buttonStates[deliveryState]:', buttonStates[deliveryState]);
    console.log(
      'Comparison result:',
      buttonStates[deliveryState] === 'Finalizar entrega',
    );

    try {
      if (deliveryState === 5) {
        console.log('Forcing Finalizar entrega case');
        router.replace('/(delivery-tabs)');
        return;
      }

      if (deliveryState < buttonStates.length - 1) {
        // Verifica si el estado actual es "Finalizar entrega"
        if (buttonStates[deliveryState] === 'Finalizar entrega') {
          console.log('Finalizar entrega case triggered');
          router.replace('/login');
          return;
        }

        // Actualizar el estado en el backend según el botón actual
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
          case 'Ya hice la entrega':
            await DeliveryService.updateOrderStatus(
              orderDetails!.id,
              OrderDeliveryStatus.DELIVERED,
            );
            break;
        }

        // Avanzar al siguiente estado del botón
        setDeliveryState(deliveryState + 1);
      }
    } catch (error) {
      console.error('Error al actualizar el estado del delivery:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  if (!orderDetails) {
    return (
      <View style={styles.errorContainer}>
        <PoppinsText style={styles.errorText}>
          No se encontraron datos del pedido.
        </PoppinsText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgColor }}>
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
        />

        {/* Pedido (contenido comentado) */}
        {/* <PoppinsText weight="medium" style={styles.sectionTitle}>
          Pedido
        </PoppinsText>
        <PoppinsText style={styles.totalProducts}>
          Total: {products.length} productos
        </PoppinsText>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productImagePlaceholder} />
            <View>
              <PoppinsText style={styles.productName}>
                {product.productPresentation.product.name}
              </PoppinsText>
              <PoppinsText style={styles.productQuantity}>
                Cantidad: {product.quantity}
              </PoppinsText>
              <PoppinsText style={styles.productPrice}>
                Subtotal: ${product.subtotal.toFixed(2)}
              </PoppinsText>
            </View>
          </View>
        ))} */}

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
  sectionTitle: {
    fontSize: FontSizes.s1.size,
    lineHeight: FontSizes.s1.lineHeight,
    color: Colors.primary,
    marginBottom: 8,
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
    color: Colors.textMain,
    marginBottom: 8,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.menuWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  productImagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: Colors.gray_100,
    borderRadius: 8,
    marginRight: 16,
  },
  productName: {
    fontSize: FontSizes.b2.size,
    color: Colors.textMain,
  },
  productQuantity: {
    fontSize: FontSizes.b3.size,
    color: Colors.textLowContrast,
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
});

export default DeliveryDetailScreen;
