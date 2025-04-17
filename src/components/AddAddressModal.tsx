import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/solid';
import PoppinsText from './PoppinsText';
import { Colors } from '../styles/theme';
import Input from './Input';
import Button from './Button';

const AddAddressModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [referencePoint, setReferencePoint] = useState('');

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <XMarkIcon size={24} color={Colors.textMain} />
          </TouchableOpacity>

          <PoppinsText style={styles.title}>Nueva Dirección</PoppinsText>
          <Input
            placeholder="Dirección"
            value={address}
            getValue={setAddress}
            backgroundColor="none"
          />
          <Input
            placeholder="Código Postal"
            value={postalCode}
            getValue={setPostalCode}
            fieldType="number"
            backgroundColor="none"
          />
          <Input
            placeholder="Información Adicional"
            value={additionalInfo}
            getValue={setAdditionalInfo}
            backgroundColor="none"
          />
          <Input
            placeholder="Punto de Referencia"
            value={referencePoint}
            getValue={setReferencePoint}
            backgroundColor="none"
          />
          <View style={styles.buttonContainer}>
            <Button title="Guardar" onPress={() => {}} variant="primary" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 352,
    backgroundColor: Colors.menuWhite,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textMain,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: Colors.gray_100,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: Colors.textMain,
    fontSize: 14,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
});

export default AddAddressModal;
