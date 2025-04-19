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
} from 'react-native-heroicons/outline';
import { AuthService } from '../services/auth';
import { useRouter } from 'expo-router';
import Popup from '../components/Popup';

export default function MenuScreen() {
  const [userName, setUserName] = useState('');
  const [isActive, setIsActive] = useState('');
  const [isLogoutConfirmationVisible, setIsLogoutConfirmationVisible] =
    useState(false);
  const router = useRouter();

  const items = [
    {
      id: '1',
      title: 'Perfil',
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

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setIsLogoutConfirmationVisible(false);
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await UserService.getProfile();

        if (profile.success)
          setUserName(profile.data.firstName + ' ' + profile.data.lastName);
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
    marginTop: 40,
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
