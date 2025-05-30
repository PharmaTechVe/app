import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { Colors } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import Avatar from '../components/Avatar';
import { UserService } from '../services/user';
import {
  ArrowUpTrayIcon,
  MapIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  UserIcon,
  ArrowsRightLeftIcon,
} from 'react-native-heroicons/outline';
import { AuthService } from '../services/auth';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Popup from '../components/Popup';

export default function MenuScreen() {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isActive, setIsActive] = useState('');
  const [isLogoutConfirmationVisible, setIsLogoutConfirmationVisible] =
    useState(false);
  const router = useRouter();
  const { context } = useLocalSearchParams(); // Obtener el contexto desde los parámetros

  const items = [
    {
      id: '1',
      title: 'Mi Perfil',
      icon: <UserIcon color={Colors.iconMainPrimary} />,
      onPress: () => router.push('/profile'),
    },
    {
      id: '2',
      title: 'Mis Direcciones',
      icon: <MapIcon color={Colors.iconMainPrimary} />,
      onPress: () => router.push('/direction'),
    },
    {
      id: '3',
      title: 'Seguridad',
      icon: <ShieldCheckIcon color={Colors.iconMainPrimary} />,
      onPress: () => router.push('/change-password'),
    },
    {
      id: '4',
      title: 'Mis Pedidos',
      icon: <ShoppingCartIcon color={Colors.iconMainPrimary} />,
      onPress: () => router.push('/orders'),
    },
  ];

  // Agregar la opción para usuarios de tipo "delivery" solo si el contexto no es "topBarDelivery"
  if (userRole === 'delivery' && context !== 'topBarDelivery') {
    items.push({
      id: '5',
      title: 'Ir al flujo de Delivery',
      icon: <ArrowsRightLeftIcon color={Colors.iconMainPrimary} />,
      onPress: () => router.push('/(delivery-tabs)'),
    });
  }

  // Agregar la opción para volver al flujo regular si el contexto es "topBarDelivery"
  if (context === 'topBarDelivery') {
    items.push({
      id: '6',
      title: 'Ir al flujo regular',
      icon: <ArrowsRightLeftIcon color={Colors.iconMainPrimary} />,
      onPress: () => router.push('/(tabs)'),
    });
  }

  const handleLogout = async () => {
    try {
      await AuthService.logout(); // Llama al método logout del servicio de autenticación
      setIsLogoutConfirmationVisible(false); // Cierra el popup de confirmación

      // Verificar si hay pantallas en la pila antes de llamar a dismissAll
      if (router.canGoBack()) {
        router.dismissAll();
      }

      router.replace('/login'); // Redirige a la pantalla de inicio de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await UserService.getProfile();

        if (profile.success) {
          setUserName(profile.data.firstName + ' ' + profile.data.lastName);
          setUserRole(profile.data.role); // Guardar el rol del usuario
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
    setIsActive('');
  }, []);

  return (
    <>
      <View style={[styles.menu]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.menuContent}>
            <View>
              <View style={{ padding: 20, flexDirection: 'row' }}>
                <Avatar scale={40} />
                <View>
                  <PoppinsText
                    weight="semibold"
                    style={{ marginHorizontal: 10 }}
                  >
                    {userName}
                  </PoppinsText>
                  <PoppinsText
                    style={{ marginHorizontal: 10, color: Colors.gray_500 }}
                  >
                    Cuenta Personal
                  </PoppinsText>
                </View>
              </View>
              <View style={{ paddingHorizontal: 5 }}>
                {items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      isActive == item.id && { borderStartWidth: 5 },
                    ]}
                    onPress={() => {
                      item.onPress();
                    }}
                  >
                    {item.icon && (
                      <View style={styles.menuIcon}>{item.icon}</View>
                    )}
                    <PoppinsText style={styles.menuText}>
                      {item.title}
                    </PoppinsText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View
              style={{
                borderTopColor: Colors.gray_500,
                borderTopWidth: 1,
                marginVertical: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  padding: 15,
                  alignContent: 'center',
                }}
                onPress={() => setIsLogoutConfirmationVisible(true)}
              >
                <View>
                  <ArrowUpTrayIcon
                    rotation={90}
                    color={Colors.semanticDanger}
                    size={20}
                  />
                </View>
                <PoppinsText
                  style={{ color: Colors.semanticDanger, marginHorizontal: 10 }}
                >
                  Cerrar Sesión
                </PoppinsText>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* Popup for Logout Confirmation */}
      <Popup
        visible={isLogoutConfirmationVisible}
        type="center"
        headerText="Cerrar sesión"
        bodyText="¿Estás seguro de que deseas cerrar sesión?"
        primaryButton={{
          text: 'Sí',
          onPress: handleLogout,
        }}
        secondaryButton={{
          text: 'No',
          onPress: () => setIsLogoutConfirmationVisible(false),
        }}
        onClose={() => setIsLogoutConfirmationVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    zIndex: 100,
    elevation: 10,
  },
  safeArea: {
    flex: 1,
  },
  menuContent: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 3,
    paddingHorizontal: 20,
    borderColor: Colors.primary,
    borderRadius: 5,
  },
  menuIcon: {
    marginRight: 20,
    fontSize: 24,
    width: 30,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 18,
    color: '#333',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99,
  },
});
