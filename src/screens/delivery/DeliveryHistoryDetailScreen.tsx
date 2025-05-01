import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { PhoneIcon, EnvelopeIcon } from 'react-native-heroicons/solid';
import Badge from '../../components/Badge';
import PoppinsText from '../../components/PoppinsText';
import CustomerAvatar from '../../components/CustomerAvatar';
import HistoryMap from '../../components/HistoryMap';
import { Colors, FontSizes } from '../../styles/theme';
import { DeliveryService } from '../../services/delivery';
import { BranchService } from '../../services/branches';
import {
  OrderDeliveryDetailedResponse,
  BranchResponse,
  OrderDetailedResponse,
} from '@pharmatech/sdk';
import { UserService } from '../../services/user';

const DeliveryHistoryDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [orderDetails, setOrderDetails] =
    useState<OrderDeliveryDetailedResponse | null>(null);
  const [branchDetails, setBranchDetails] = useState<BranchResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState<OrderDetailedResponse | undefined>(
    undefined,
  );
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderDetails) {
          return; // No intentes cargar si no hay detalles de la orden
        }

        const orderId = orderDetails.orderId; // Extraer el ID de la orden
        console.log('ID de la orden:', orderId);

        const order = await UserService.getOrder(orderId); // Usar el ID de la orden

        if (order.success) {
          console.log('Datos del pedido:', order.data); // Log para verificar los datos
          setOrder(order.data);
        } else {
          console.error('Error al obtener el pedido:', order.error);
        }
      } catch (error) {
        console.error('Error en fetchOrder:', error);
      }
    };

    fetchOrder();
  }, [orderDetails]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true); // Inicia la carga
        if (!id) {
          throw new Error('ID del pedido no proporcionado');
        }

        // Obtener detalles completos del pedido
        const details = await DeliveryService.getOrderDetails(id as string);
        setOrderDetails(details);

        // Obtener detalles de la sucursal
        const branches = await BranchService.findAll({ page: 1, limit: 100 });
        const branch = branches.results.find(
          (branch) => branch.id === details.branchId,
        );
        setBranchDetails(branch || null);
      } catch (error) {
        console.error('Error al obtener los detalles del pedido:', error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  if (!orderDetails || !branchDetails) {
    return (
      <View style={styles.errorContainer}>
        <PoppinsText style={styles.errorText}>
          No se encontraron datos del pedido.
        </PoppinsText>
      </View>
    );
  }

  // Calcular tiempos usando la función reutilizada
  const elapsedTime = calculateElapsedTime(orderDetails.createdAt);
  const completionTime = new Date(orderDetails.updatedAt).toLocaleTimeString(
    'es-VE',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  );
  const creationTime = new Date(orderDetails.createdAt).toLocaleTimeString(
    'es-VE',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  );
  const creationTimePlusOneHour = new Date(
    new Date(orderDetails.createdAt).getTime() + 60 * 43 * 1000,
  ).toLocaleTimeString('es-VE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgColor }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <PoppinsText style={styles.title}>Resumen del pedido</PoppinsText>
        </View>
        {/* Badge con información del historial */}
        <View style={styles.statusContainer}>
          <Badge
            variant="filled"
            color="primary_300"
            size="small"
            borderRadius="square"
          >
            Hace {`${elapsedTime}, ${completionTime}`}
          </Badge>
        </View>

        {/* Información combinada en una sola carta */}
        <View style={styles.combinedCard}>
          {/* Información del cliente */}
          <View style={styles.cardRow}>
            <View style={styles.avatar}>
              <CustomerAvatar
                firstName={orderDetails.user.firstName}
                lastName={orderDetails.user.lastName}
                profilePicture={orderDetails.user.profilePicture} // Pasar la imagen de perfil
              />
            </View>
            <PoppinsText weight="medium" style={styles.userName}>
              {orderDetails.user.firstName} {orderDetails.user.lastName}
            </PoppinsText>
          </View>
          <View style={styles.cardRow}>
            <PhoneIcon size={20} color={Colors.primary} style={styles.icon} />
            <PoppinsText style={styles.cardSubtitle}>
              {orderDetails.user.phoneNumber || 'Sin teléfono'}
            </PoppinsText>
          </View>
          <View style={styles.cardRow}>
            <EnvelopeIcon
              size={20}
              color={Colors.primary}
              style={styles.icon}
            />
            <PoppinsText style={styles.cardSubtitle}>
              {orderDetails.user.email || 'Sin correo'}
            </PoppinsText>
          </View>

          <View style={styles.spacing} />

          {/* Contenedor de la información de la sucursal */}
          <View style={styles.info}>
            {/* Línea vertical punteada */}
            <View style={styles.circleTop} />

            {/* Línea vertical punteada */}
            <View style={styles.verticalLine} />

            {/* Círculo inferior */}
            <View style={styles.circleBottom} />

            <View style={styles.sectionContainer}>
              <View style={styles.cardRow}>
                <PoppinsText style={styles.cardTitle}>
                  {branchDetails.name}
                </PoppinsText>
              </View>
              <PoppinsText style={styles.cardSubtitle}>
                {branchDetails.address}
              </PoppinsText>
            </View>

            {/* Contenedor de la información de la entrega */}
            <View style={styles.sectionContainerB}>
              <View style={styles.cardRow}>
                <PoppinsText style={styles.cardTitle}>Entrega</PoppinsText>
              </View>
              <PoppinsText style={styles.cardSubtitle}>
                {orderDetails.address.adress}
              </PoppinsText>
            </View>
          </View>
        </View>

        <PoppinsText weight="medium" style={styles.sectionTitle}>
          Historial de la entrega
        </PoppinsText>

        <View style={styles.combinedCardHistory}>
          {/* Contenedor de la información de la sucursal */}
          <View style={styles.info}>
            {/* Línea vertical punteada */}
            <View style={styles.verticalLineHistory} />

            {/* Línea vertical punteada */}
            <View style={styles.circleTopHistory} />

            {/* Círculo middle */}
            <View style={styles.circleMiddleHistory} />

            {/* Círculo inferior */}
            <View style={styles.circleBottomHistory} />

            <View style={styles.sectionContainer}>
              <View style={styles.cardRow}>
                <PoppinsText style={styles.historyTitle}>
                  Pedido iniciado
                </PoppinsText>
              </View>
              <PoppinsText
                style={styles.historySubtitle}
              >{`${creationTime}`}</PoppinsText>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.cardRow}>
                <PoppinsText style={styles.historyTitle}>
                  Pedido recogido
                </PoppinsText>
              </View>
              <PoppinsText style={styles.historySubtitle}>
                {`${creationTimePlusOneHour}`}
              </PoppinsText>
            </View>

            <View style={styles.sectionContainerB}>
              <View style={styles.cardRow}>
                <PoppinsText style={styles.historyTitle}>Entregado</PoppinsText>
              </View>
              <PoppinsText style={styles.historySubtitle}>
                {`${completionTime}`}
              </PoppinsText>
            </View>
          </View>
        </View>

        {/* Recorrido de entrega */}
        <PoppinsText weight="medium" style={styles.sectionTitle}>
          Recorrido de entrega
        </PoppinsText>
        <HistoryMap
          deliveryLocation={{
            latitude: 10.068522,
            longitude: -69.282318,
          }}
          branchLocation={{
            latitude: branchDetails.latitude,
            longitude: branchDetails.longitude,
          }}
          customerLocation={{
            latitude: orderDetails.address.latitude,
            longitude: orderDetails.address.longitude,
          }}
        />

        {/* Pedido */}
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

        <View style={styles.scrollSpacer} />
      </ScrollView>
    </View>
  );
};

// Función reutilizada para calcular el tiempo transcurrido
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    color: Colors.textMain,
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
    overflow: 'hidden',
  },
  productImage: {
    width: 50,
    height: 50,
    backgroundColor: Colors.gray_100,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: FontSizes.b2.size,
    color: Colors.textMain,
    flexShrink: 1,
  },
  productQuantity: {
    fontSize: FontSizes.b3.size,
    color: Colors.textLowContrast,
    marginTop: 4,
  },
  locationsContainer: {
    position: 'relative',
    marginBottom: 16,
    paddingLeft: 0,
  },
  verticalLine: {
    position: 'absolute',
    left: -12,
    top: '25%',
    height: '50%',
    width: 2,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: Colors.primary_300,
  },
  circleTop: {
    position: 'absolute',
    left: -16,
    top: '25%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary_300,
    transform: [{ translateY: -8 }],
  },
  circleBottom: {
    position: 'absolute',
    left: -16,
    top: '75%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary_300,
    transform: [{ translateY: -2 }],
  },
  verticalLineHistory: {
    position: 'absolute',
    left: -12,
    top: '15%',
    height: '75%',
    width: 2,
    borderWidth: 2,
    borderColor: Colors.primary_300,
  },
  circleTopHistory: {
    position: 'absolute',
    left: -16,
    top: '25%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary_700,
    transform: [{ translateY: -22 }],
  },
  circleMiddleHistory: {
    position: 'absolute',
    left: -16,
    top: '75%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary_700,
    transform: [{ translateY: -45 }],
  },
  circleBottomHistory: {
    position: 'absolute',
    left: -16,
    top: '75%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary_700,
    transform: [{ translateY: 14 }],
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
  combinedCard: {
    backgroundColor: Colors.menuWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flex: 1,
  },
  combinedCardHistory: {
    borderRadius: 16,
    padding: 16,
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
  avatar: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: FontSizes.label.size,
    lineHeight: FontSizes.label.lineHeight,
    color: Colors.primary,
    marginBottom: -6, // Reduce el espacio entre el título y el subtítulo
  },
  historyTitle: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.primary,
    marginBottom: -9, // Reduce el espacio entre el título y el subtítulo
  },
  cardSubtitle: {
    fontSize: FontSizes.label.size,
    color: Colors.textMain,
  },
  historySubtitle: {
    fontSize: FontSizes.label.size,
    color: Colors.textLowContrast,
  },
  userName: {
    fontSize: FontSizes.s2.size,
    lineHeight: FontSizes.s2.lineHeight,
    color: Colors.textMain,
  },
  sectionContainer: {
    marginLeft: 4,
    marginBottom: 16, // Espaciado entre secciones
  },
  sectionContainerB: {
    marginLeft: 4,
  },
  spacing: {
    marginBottom: 8, // Espaciado entre secciones
  },
  info: {
    marginLeft: 18, // Espaciado entre secciones
  },
  mapPlaceholder: {
    height: 300,
    backgroundColor: Colors.gray_100,
    borderRadius: 16,
    marginBottom: 16,
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
    height: 64,
  },
});

export default DeliveryHistoryDetailScreen;
