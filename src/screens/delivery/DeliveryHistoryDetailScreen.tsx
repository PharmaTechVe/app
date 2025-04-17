import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { PhoneIcon, EnvelopeIcon } from 'react-native-heroicons/solid';
import Badge from '../../components/Badge';
import PoppinsText from '../../components/PoppinsText';
import { Colors, FontSizes } from '../../styles/theme';
import Avatar from '../../components/Avatar';

interface Product {
  id: string;
  name: string;
  quantity: number;
}

const DeliveryHistoryDetailScreen: React.FC = () => {
  const { data } = useLocalSearchParams();

  console.log(
    'Datos recibidos en la pantalla del historial (sin procesar):',
    data,
  );

  const orderData = data
    ? JSON.parse(decodeURIComponent(data as string))
    : null;

  console.log('Datos decodificados en la pantalla del historial:', orderData);

  if (!orderData) {
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
            {`${orderData.elapsedTime}, ${orderData.completionTime}`}
          </Badge>
        </View>

        {/* Información combinada en una sola carta */}
        <View style={styles.combinedCard}>
          {/* Información del cliente */}
          <View style={styles.cardRow}>
            <View style={styles.avatar}>
              <Avatar />
            </View>
            <PoppinsText weight="medium" style={styles.userName}>
              {orderData.userName}
            </PoppinsText>
          </View>
          <View style={styles.cardRow}>
            <PhoneIcon size={20} color={Colors.primary} style={styles.icon} />
            <PoppinsText style={styles.cardSubtitle}>+123456789</PoppinsText>
          </View>
          <View style={styles.cardRow}>
            <EnvelopeIcon
              size={20}
              color={Colors.primary}
              style={styles.icon}
            />
            <PoppinsText style={styles.cardSubtitle}>
              cliente@correo.com
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
                  {orderData.branch}
                </PoppinsText>
              </View>
              <PoppinsText style={styles.cardSubtitle}>
                {orderData.address}
              </PoppinsText>
            </View>

            {/* Contenedor de la información de la entrega */}
            <View style={styles.sectionContainerB}>
              <View style={styles.cardRow}>
                <PoppinsText style={styles.cardTitle}>Entrega</PoppinsText>
              </View>
              <PoppinsText style={styles.cardSubtitle}>
                {orderData.address}
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
              >{`${orderData.elapsedTime}, ${orderData.completionTime}`}</PoppinsText>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.cardRow}>
                <PoppinsText style={styles.historyTitle}>
                  Pedido recogido
                </PoppinsText>
              </View>
              <PoppinsText style={styles.historySubtitle}>
                {`${orderData.elapsedTime}`}, hora de recogida
              </PoppinsText>
            </View>

            <View style={styles.sectionContainerB}>
              <View style={styles.cardRow}>
                <PoppinsText style={styles.historyTitle}>Entregado</PoppinsText>
              </View>
              <PoppinsText style={styles.historySubtitle}>
                {`${orderData.elapsedTime}`}, hora de entrega
              </PoppinsText>
            </View>
          </View>
        </View>

        {/* Recorrido de entrega */}
        <PoppinsText weight="medium" style={styles.sectionTitle}>
          Recorrido de entrega
        </PoppinsText>
        <View style={styles.mapPlaceholder} />

        {/* Pedido */}
        <PoppinsText weight="medium" style={styles.sectionTitle}>
          Pedido
        </PoppinsText>
        <PoppinsText style={styles.totalProducts}>
          Total: {orderData.products?.length || 0} productos
        </PoppinsText>
        {orderData.products?.map((product: Product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productImagePlaceholder} />
            <View>
              <PoppinsText style={styles.productName}>
                {product.name}
              </PoppinsText>
              <PoppinsText style={styles.productQuantity}>
                Cantidad: {product.quantity}
              </PoppinsText>
            </View>
          </View>
        ))}
        <View style={styles.scrollSpacer} />
      </ScrollView>
    </View>
  );
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
