import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  InformationCircleIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from 'react-native-heroicons/solid';
import Badge from '../../components/Badge';
import PoppinsText from '../../components/PoppinsText';
import Button from '../../components/Button';
import { Colors, FontSizes } from '../../styles/theme';

interface Product {
  id: string;
  name: string;
  quantity: number;
}

const DeliveryDetailScreen: React.FC = () => {
  const { data } = useLocalSearchParams();

  const orderData = data
    ? JSON.parse(decodeURIComponent(data as string))
    : null;

  if (!orderData) {
    return (
      <View style={styles.errorContainer}>
        <PoppinsText style={styles.errorText}>
          No se encontraron datos del pedido.
        </PoppinsText>
      </View>
    );
  }

  const [deliveryState, setDeliveryState] = useState(0);

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

  const handleNextState = () => {
    if (deliveryState < buttonStates.length - 1) {
      setDeliveryState(deliveryState + 1);
    }
  };

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
            color={orderData.type === 'pedido' ? 'info' : 'secondary_300'}
            size="small"
            borderRadius="square"
            textColor={Colors.primary}
          >
            {deliveryStates[deliveryState < 3 ? 0 : 1]}
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
                {orderData.branch}
              </PoppinsText>
            </View>
            <PoppinsText style={styles.cardSubtitle}>
              {orderData.address}
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
              {orderData.address}
            </PoppinsText>
          </View>
        </View>

        {/* Información de contacto */}
        <PoppinsText weight="medium" style={styles.sectionTitle}>
          Información de contacto
        </PoppinsText>
        <View style={styles.card3}>
          {/* Teléfono */}
          <View style={styles.cardRow}>
            <PhoneIcon size={20} color={Colors.primary} style={styles.icon} />
            <PoppinsText style={styles.cardSubtitle1}>+123456789</PoppinsText>
          </View>

          {/* Correo */}
          <View style={styles.cardRow}>
            <EnvelopeIcon
              size={20}
              color={Colors.primary}
              style={styles.icon}
            />
            <PoppinsText style={styles.cardSubtitle1}>
              cliente@correo.com
            </PoppinsText>
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

export default DeliveryDetailScreen;
