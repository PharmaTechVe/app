import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import Input from '../components/Input';
import Button from '../components/Button';
import { UserService } from '../services/user';
import { UserAddressResponse } from '@pharmatech/sdk';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import Alert from '../components/Alerts';
import Popup from '../components/Popup'; // Importamos el componente Popup

const DirectionScreen = () => {
  const [searchDirection, setSearchDirection] = useState('');
  const [directionsList, setDirectionList] = useState<
    UserAddressResponse[] | undefined
  >(undefined);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showInfoAlert, setShowInfoAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedDirectionId, setSelectedDirectionId] = useState<string | null>(
    null,
  ); // Dirección seleccionada para eliminar
  const [showDeletePopup, setShowDeletePopup] = useState(false); // Controla la visibilidad del popup
  const router = useRouter();

  useEffect(() => {
    const fetchDirection = async () => {
      try {
        const direction = await UserService.getUserDirections();

        if (direction.success) {
          if (direction.data.length > 0) {
            setDirectionList(direction.data);
          } else {
            setShowInfoAlert(true);
          }
        }
      } catch (error) {
        console.log(error);
        setErrorMessage('Ha ocurrido un error');
        setShowErrorAlert(true);
      }
    };

    fetchDirection();
  }, []);

  const handleDeleteDirection = async () => {
    if (!selectedDirectionId) return;

    try {
      // Llamada al endpoint para eliminar la dirección
      await UserService.deleteAddress(selectedDirectionId);
      setDirectionList((prev) =>
        prev?.filter((direction) => direction.id !== selectedDirectionId),
      );
      setShowDeletePopup(false); // Cierra el popup
    } catch (error) {
      console.error('Error al eliminar la dirección:', error);
      setErrorMessage('No se pudo eliminar la dirección');
      setShowErrorAlert(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.alertContainer}>
        {showErrorAlert && (
          <Alert
            type="error"
            title="Error"
            message={errorMessage}
            onClose={() => setShowErrorAlert(false)}
            borderColor
          />
        )}
        {showInfoAlert && (
          <Alert
            type="info"
            title="No tiene direcciones registradas"
            message="No tiene direcciones registradas"
            onClose={() => {
              setShowInfoAlert(false);
            }}
            borderColor
          />
        )}
      </View>
      {/* Header con foto de perfil */}
      <View style={styles.directionHeader}>
        <PoppinsText style={{ fontSize: FontSizes.s1.size, marginBottom: 10 }}>
          Mis Direcciones
        </PoppinsText>
      </View>

      <View>
        <Input
          placeholder="Buscar direcciones"
          value={searchDirection}
          getValue={setSearchDirection}
          icon={<MagnifyingGlassIcon color={Colors.gray_500} size={20} />}
          backgroundColor={Colors.textWhite}
        />
      </View>

      <View style={styles.directionInfo}>
        {directionsList &&
          directionsList.length > 0 &&
          directionsList.map((direction, index) => (
            <View key={index} style={styles.cardContainer}>
              {/* Contenedor del texto */}
              <View style={styles.textContainer}>
                <PoppinsText style={styles.addressText} weight="regular">
                  {direction.adress}
                </PoppinsText>
                <PoppinsText style={styles.cityText} weight="regular">
                  {direction.nameCity}, {direction.nameState},{' '}
                </PoppinsText>
                {direction.additionalInformation && (
                  <PoppinsText
                    style={styles.additionalInfoText}
                    weight="regular"
                  >
                    {direction.additionalInformation}
                  </PoppinsText>
                )}
                {direction.referencePoint && (
                  <PoppinsText
                    style={styles.referencePointText}
                    weight="regular"
                  >
                    {direction.referencePoint}
                  </PoppinsText>
                )}
              </View>

              {/* Contenedor de los íconos */}
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() =>
                    router.push(`change-direction/${direction.id}`)
                  }
                >
                  <PencilIcon color={Colors.iconMainPrimary} size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDirectionId(direction.id); // Establece la dirección seleccionada
                    setShowDeletePopup(true); // Muestra el popup
                  }}
                >
                  <TrashIcon color={Colors.iconMainPrimary} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>

      <Button
        title="Agregar nueva dirección"
        onPress={() =>
          router.push({
            pathname: '/selectLocation',
            params: {
              fromCheckout: 'false', // Convertimos a cadena
            },
          })
        }
      />

      {/* Popup de confirmación */}
      <Popup
        visible={showDeletePopup}
        headerText="Eliminar Dirección"
        bodyText="¿Está seguro de que desea eliminar esta dirección?"
        primaryButton={{
          text: 'Eliminar',
          onPress: handleDeleteDirection,
        }}
        secondaryButton={{
          text: 'Cancelar',
          onPress: () => setShowDeletePopup(false),
        }}
        onClose={() => setShowDeletePopup(false)}
      />
      <View style={styles.height} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bgColor,
    padding: 20,
    paddingTop: -20,
  },
  height: {
    height: 64,
  },
  alertContainer: {
    position: 'absolute',
    width: 326,
    left: '50%',
    marginLeft: -162,
    top: 20,
    right: 0,
    zIndex: 1000,
  },
  directionHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  directionInfo: {
    marginVertical: 20,
    borderWidth: 1,
    borderColor: Colors.gray_100,
    borderRadius: 10,
    backgroundColor: Colors.textWhite,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: Colors.gray_100,
  },
  textContainer: {
    flex: 1,
    marginRight: 10, // Espaciado entre el texto y los íconos
  },
  addressText: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.primary,
    marginBottom: 4,
  },
  cityText: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.primary,
    marginBottom: 4,
  },
  additionalInfoText: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.primary,
    marginBottom: 4,
  },
  referencePointText: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.primary,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 50,
  },
});

export default DirectionScreen;
