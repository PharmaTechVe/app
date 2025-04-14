import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import { Colors } from '../../styles/theme';
import { UserService } from '../../services/user'; // Servicio para obtener el perfil del usuario
import { useRouter } from 'expo-router';

export default function OffersScreen() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      const profile = await UserService.getProfile();
      if (profile.success) {
        setUserRole(profile.data.role); // Establece el rol del usuario
      }
    };
    fetchUserRole();
  }, []);

  const handleNavigateToDeliveryFlow = () => {
    router.push('/(delivery-tabs)'); // Redirige al flujo exclusivo para deliveries
  };

  return (
    <View style={styles.container}>
      <PoppinsText>Pantalla Ofertas</PoppinsText>

      {/* Mostrar el botón solo si el rol es "delivery" */}
      {userRole === 'delivery' && (
        <TouchableOpacity
          style={styles.deliveryButton}
          onPress={handleNavigateToDeliveryFlow}
        >
          <PoppinsText style={styles.deliveryButtonText}>
            Ir al flujo de Delivery
          </PoppinsText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgColor,
  },
  deliveryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  deliveryButtonText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
