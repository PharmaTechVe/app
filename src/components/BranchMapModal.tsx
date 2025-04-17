import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { XMarkIcon, MapPinIcon } from 'react-native-heroicons/solid';
import PoppinsText from './PoppinsText';
import BranchMap from './BranchMap'; // Import BranchMap
import { Colors } from '../styles/theme';

const BranchMapModal = ({
  visible,
  onClose,
  branchName,
  branchCoordinates,
}: {
  visible: boolean;
  onClose: () => void;
  branchName: string | null;
  branchCoordinates: { latitude: number; longitude: number } | null; // Add branchCoordinates prop
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <XMarkIcon size={24} color={Colors.textMain} />
          </TouchableOpacity>

          <PoppinsText style={styles.title}>Dirección de Sucursal</PoppinsText>

          <View style={styles.mapContainer}>
            {branchCoordinates ? (
              <BranchMap
                branches={[
                  {
                    id: '1',
                    name: branchName || 'Sucursal',
                    address: '',
                    latitude: branchCoordinates.latitude,
                    longitude: branchCoordinates.longitude,
                    stockQuantity: 0,
                  },
                ]}
              />
            ) : (
              <View style={styles.fakeMap} />
            )}
          </View>

          {branchName ? (
            <View style={styles.branchInfo}>
              <MapPinIcon size={18} color={Colors.textMain} />
              <PoppinsText style={styles.branchName}>{branchName}</PoppinsText>
            </View>
          ) : (
            <PoppinsText style={styles.branchName}>
              Seleccione una sucursal para ver su ubicación.
            </PoppinsText>
          )}
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
    height: 448,
    backgroundColor: Colors.menuWhite,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    elevation: 8,
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
  mapContainer: {
    width: 285,
    height: 285,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.gray_100,
    marginBottom: 20,
  },
  fakeMap: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  branchInfo: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginLeft: 5,
  },
  branchName: {
    fontSize: 14,
    color: Colors.textMain,
    marginLeft: 6,
    textAlign: 'left',
  },
});

export default BranchMapModal;
