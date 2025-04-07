import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import Input from '../components/Input';
import Button from '../components/Button';
import { UserService } from '../services/user';
import { UserAddressResponse } from '../types/api';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from 'react-native-heroicons/outline';
import Return from '../components/Return';
import { useRouter } from 'expo-router';
import Alert from '../components/Alerts';

const DirectionScreen = () => {
  const [searchDirection, setSearchDirection] = useState('');
  const [directionsList, setDirectionList] = useState<
    UserAddressResponse[] | undefined
  >(undefined);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showInfoAlert, setShowInfoAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
      <Return onClose={() => router.push('/')} />
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
            <View
              key={index}
              style={{
                flexDirection: 'row',
                padding: 10,
                borderBottomWidth: 1,
                borderColor: Colors.gray_100,
              }}
            >
              <View style={{ paddingVertical: 10 }}>
                <PoppinsText>{direction.adress}, </PoppinsText>
                <PoppinsText>
                  {direction.nameCity}, {direction.nameState},{' '}
                  {direction.zipCode}
                </PoppinsText>
                <PoppinsText>{direction.additionalInformation}</PoppinsText>
                <PoppinsText>{direction.referencePoint}</PoppinsText>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/editDirection/${direction.id}`)}
                >
                  <PencilIcon color={Colors.iconMainPrimary} size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    console.log(`Delete direction with id: ${direction.id}`)
                  }
                >
                  <TrashIcon color={Colors.iconMainPrimary} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>

      <Button
        title="Agregar nueva dirección"
        onPress={() => router.push('/editDirection')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bgColor,
    padding: 20,
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
  directionImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    color: Colors.primary,
  },
  directionInfo: {
    marginVertical: 20,
    borderWidth: 1,
    borderColor: Colors.gray_100,
    borderRadius: 10,
    backgroundColor: Colors.textWhite,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 15,
  },
  bottomEditButton: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 40,
    width: '50%',
    alignItems: 'center',
  },
});

export default DirectionScreen;
