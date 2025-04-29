import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Avatar from '../components/Avatar';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import Input from '../components/Input';
import Button from '../components/Button';
import { UserService } from '../services/user';
import { UpdateUser, UserList } from '@pharmatech/sdk';
import { PencilIcon, TrashIcon } from 'react-native-heroicons/outline';
import DatePickerInput from '../components/DatePickerInput';
import * as ImagePicker from 'expo-image-picker';
import {
  validateDateFormat,
  validatePhoneNumberLength,
  validateRequiredFields,
} from '../utils/validators';
import Alert from '../components/Alerts';
import { ImageService } from '../services/images';

const formatDate = (dateString: Date): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserList>({} as UserList);
  const [image, setImage] = useState<string | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await UserService.getProfile();

        if (profile.success) {
          setProfile(profile.data);
          setImage(profile.data.profile.profilePicture);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  const submitProfile = async () => {
    if (
      !validateRequiredFields([
        profile.firstName,
        profile.lastName,
        profile.phoneNumber,
        formatDate(profile.profile?.birthDate),
      ])
    ) {
      setShowErrorAlert(true);
      setErrorMessage('Por favor completa todos los campos');
      return;
    }
    if (!validateDateFormat(formatDate(profile.profile?.birthDate))) {
      setShowErrorAlert(true);
      setErrorMessage('Formato de fecha inválido (Use YYYY-MM-DD)');
      return;
    }

    // Validar que el teléfono tenga entre 8 y 15 caracteres
    if (profile.phoneNumber.length < 8 || profile.phoneNumber.length > 15) {
      setShowErrorAlert(true);
      setErrorMessage(
        'El número de teléfono debe tener entre 8 y 15 caracteres',
      );
      return;
    }
    setLoading(true);
    try {
      const updatedProfile: Partial<UpdateUser> = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        birthDate: profile.profile?.birthDate.toString(),
        phoneNumber: profile.phoneNumber,
        profilePicture: undefined,
      };

      if (image !== null) {
        const imageResponse = await ImageService.uploadImage(image);
        if (imageResponse) {
          updatedProfile.profilePicture = imageResponse.secure_url;
          setErrorMessage(imageResponse.json());
          setShowErrorAlert(true);
        }
      }

      const response = await UserService.updateProfile(updatedProfile);

      if (response.success) {
        setIsEditable(false);
        setShowSuccessAlert(true);
      } else {
        setShowErrorAlert(true);
        setErrorMessage('Error al actualizar el perfil');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Ocurrió un error al intentar actualizar el perfil');
    }
  };

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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
        {showSuccessAlert && (
          <Alert
            type="success"
            title="Éxito"
            message="Perfil actualizado exitosamente"
            onClose={() => {
              setShowSuccessAlert(false);
            }}
            borderColor
          />
        )}
      </View>
      {/* Header con foto de perfil */}
      <View style={styles.profileHeader}>
        {isEditable ? (
          <PoppinsText
            style={{ fontSize: FontSizes.s1.size, marginBottom: 10 }}
          >
            Editar Perfil
          </PoppinsText>
        ) : (
          <PoppinsText
            style={{ fontSize: FontSizes.s1.size, marginBottom: 10 }}
          >
            Mi Perfil
          </PoppinsText>
        )}

        {isEditable ? (
          <View>
            <TouchableOpacity
              style={{
                width: 80,
                height: 80,
                borderRadius: 100,
                backgroundColor: 'rgba(52, 52, 52, 0.5)',
                padding: 30,
                position: 'absolute',
                zIndex: 999,
              }}
              onPress={() => {
                setImage(null);
              }}
            >
              <TrashIcon color={Colors.iconWhite} size={20} />
            </TouchableOpacity>
            <Image
              source={{ uri: image ? image : '' }}
              style={{ width: 80, height: 80, borderRadius: 100 }}
            />
          </View>
        ) : (
          <Avatar scale={80} />
        )}
        {isEditable ? (
          <TouchableOpacity
            style={{
              position: 'relative',
              bottom: 20,
              left: 25,
              borderRadius: 100,
              width: 30,
              height: 30,
              backgroundColor: Colors.primary,
              justifyContent: 'center',
              paddingStart: 5,
            }}
            onPress={handleImageUpload}
          >
            <PencilIcon color={Colors.iconWhite} size={20} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditable(true)}
          >
            <PoppinsText style={styles.editButtonText}>EDITAR</PoppinsText>
          </TouchableOpacity>
        )}
      </View>

      {/* Información del perfil */}
      <View style={styles.profileInfo}>
        <Input
          label="Nombre"
          value={profile?.firstName}
          isEditable={isEditable}
          border={isEditable ? 'default' : 'none'}
          getValue={(value) => setProfile({ ...profile, firstName: value })}
          errorText="El campo no puede estar vacío"
          backgroundColor={isEditable ? Colors.textWhite : undefined}
        />
        <Input
          label="Apellido"
          value={profile?.lastName}
          isEditable={isEditable}
          border={isEditable ? 'default' : 'none'}
          getValue={(value) => setProfile({ ...profile, lastName: value })}
          errorText="El campo no puede estar vacío"
          backgroundColor={isEditable ? Colors.textWhite : undefined}
        />
        <Input
          label="Correo Electrónico"
          value={profile?.email}
          isEditable={false}
          border={'none'}
        />
        <Input
          label="Cédula"
          value={profile?.documentId}
          isEditable={false}
          border={'none'}
        />
        {isEditable ? (
          <DatePickerInput
            label="Fecha de Nacimiento"
            placeholder="Selecciona tu fecha"
            value={profile?.profile?.birthDate.toString()}
            getValue={(value) =>
              setProfile({
                ...profile,
                profile: { ...profile.profile, birthDate: new Date(value) },
              })
            }
          />
        ) : (
          <Input
            label="Fecha de nacimiento"
            value={formatDate(profile?.profile?.birthDate)}
            isEditable={isEditable}
            border={isEditable ? 'default' : 'none'}
          />
        )}
        <Input
          label="Número de teléfono"
          value={profile?.phoneNumber}
          isEditable={isEditable}
          border={isEditable ? 'default' : 'none'}
          validation={validatePhoneNumberLength}
          getValue={(value) => setProfile({ ...profile, phoneNumber: value })}
          fieldType="number"
          errorText="El campo no puede estar vacío"
          backgroundColor={isEditable ? Colors.textWhite : undefined}
        />
      </View>

      {/* Botón de editar al final */}
      {!isEditable ? (
        <Button title="Editar" onPress={() => setIsEditable(true)} />
      ) : (
        <Button
          title="Guardar Cambios"
          onPress={() => submitProfile()}
          loading={loading}
        />
      )}
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
    left: '56%',
    marginLeft: -162,
    top: 60,
    right: 0,
    zIndex: 1000,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  profileImage: {
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
  profileInfo: {
    marginBottom: 20,
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

export default ProfileScreen;
