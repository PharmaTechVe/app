import React from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
  Easing,
} from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import Avatar from './Avatar';
import { UserService } from '../services/user';
import { ArrowUpTrayIcon } from 'react-native-heroicons/outline';
import { AuthService } from '../services/auth';
import { useRouter } from 'expo-router';
import Popup from './Popup';

const { width, height } = Dimensions.get('window');

type MenuItem = {
  id: string;
  title: string;
  icon?: React.ReactElement;
  onPress: () => void;
};

type FullScreenSlideMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
};

const FullScreenSlideMenu: React.FC<FullScreenSlideMenuProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const [userName, setUserName] = React.useState('');
  const menuPosition = React.useRef(new Animated.Value(-width)).current;
  const [isActive, setIsActive] = React.useState('');
  const [isLogoutConfirmationVisible, setIsLogoutConfirmationVisible] =
    React.useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AuthService.logout(); // Llama al método logout del servicio de autenticación
      setIsLogoutConfirmationVisible(false); // Cierra el popup de confirmación
      router.replace('/login'); // Redirige a la pantalla de inicio de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  React.useEffect(() => {
    Animated.timing(menuPosition, {
      toValue: isOpen ? 0 : -width,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

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
  }, [isOpen, menuPosition]);

  return (
    <>
      <Animated.View
        style={[
          styles.menu,
          {
            transform: [{ translateX: menuPosition }],
          },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.menuContent}>
            <View>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  padding: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <ChevronLeftIcon
                  width={16}
                  height={16}
                  color={Colors.primary}
                  style={{ marginRight: 2, marginLeft: 6 }}
                />
                <PoppinsText
                  weight="medium"
                  style={{
                    fontSize: FontSizes.b1.size,
                    lineHeight: FontSizes.b1.lineHeight,
                    color: Colors.primary,
                  }}
                >
                  Volver
                </PoppinsText>
              </TouchableOpacity>
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
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    isActive == item.id && { borderStartWidth: 5 },
                  ]}
                  onPress={() => {
                    item.onPress();
                    onClose();
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
      </Animated.View>

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

      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClose}
          activeOpacity={0.5}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: -25,
    left: -15,
    width: width,
    height: height + 5,
    backgroundColor: Colors.bgColor,
    zIndex: 100,
    elevation: 10,
  },
  safeArea: {
    flex: 1,
  },
  menuContent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 10,
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

export default FullScreenSlideMenu;
