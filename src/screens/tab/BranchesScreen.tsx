import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StateService } from '../../services/state';
import { BranchService } from '../../services/branches';
import { StateResponse, BranchResponse } from '@pharmatech/sdk';
import BranchCard from '../../components/BranchCard';
import { Colors, FontSizes } from '../../styles/theme';
import { useRouter } from 'expo-router';
import PoppinsText from '../../components/PoppinsText';

export default function BranchesScreen() {
  const [states, setStates] = useState<StateResponse[]>([]);
  const [branches, setBranches] = useState<BranchResponse[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  // Cargar todos los estados al inicio
  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      const response = await StateService.getStates(1, 100);
      if (response.success && response.data) setStates(response.data.results);
      setLoading(false);
    };
    fetchStates();
  }, []);

  // Cargar sucursales al seleccionar un estado
  useEffect(() => {
    if (selectedState) {
      const fetchBranches = async () => {
        setLoading(true);
        const response = await BranchService.findAll({
          stateId: selectedState,
        });
        if (response.results) setBranches(response.results);
        setLoading(false);
      };
      fetchBranches();
    }
  }, [selectedState]);

  // Restablecer el estado del modal y el estado seleccionado al volver a la pantalla
  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(false); // Cerramos el modal
      setSelectedState(null); // Restablecemos el estado seleccionado
    }, []),
  );

  return (
    <View style={styles.container}>
      <PoppinsText weight="medium" style={styles.title}>
        Selecciona un estado
      </PoppinsText>
      <FlatList
        data={states}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.stateCard}
            onPress={() => {
              setSelectedState(item.id);
              setModalVisible(true);
            }}
          >
            <PoppinsText style={styles.stateName}>{item.name}</PoppinsText>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <PoppinsText style={styles.emptyText}>
              No hay estados disponibles.
            </PoppinsText>
          ) : null
        }
      />

      {/* Modal para mostrar las sucursales */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedState(null);
        }}
      >
        {/* Overlay fijo */}
        <View style={styles.modalOverlay} />

        {/* Contenido del modal */}
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalDismissArea}
            onPress={() => {
              setModalVisible(false);
              setSelectedState(null);
            }}
          />
          <View style={styles.modalContent}>
            {/* Indicador de deslizamiento */}
            <View style={styles.modalHandle} />

            {/* Encabezado del modal */}
            <View style={styles.modalHeader}>
              <PoppinsText weight="medium" style={styles.modalTitle}>
                Sucursales en el estado seleccionado
              </PoppinsText>
            </View>

            {/* Contenido del modal */}
            <FlatList
              data={branches}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <BranchCard
                  branch={item}
                  onPress={() => {
                    router.push(`/branchDetail/${item.id}`);
                  }}
                />
              )}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                !loading ? (
                  <PoppinsText style={styles.emptyText}>
                    No hay sucursales disponibles.
                  </PoppinsText>
                ) : null
              }
            />
          </View>
        </View>
      </Modal>
      <View style={styles.height} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    padding: 16,
    paddingTop: -16,
  },
  height: {
    height: 64,
  },
  title: {
    fontSize: FontSizes.s1.size,
    lineHeight: FontSizes.s1.lineHeight,
    color: Colors.textMain,
    marginBottom: 4,
  },
  list: {
    marginTop: 8,
  },
  stateCard: {
    backgroundColor: Colors.menuWhite,
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stateName: {
    fontSize: FontSizes.s2.size,
    lineHeight: FontSizes.s2.lineHeight,
    color: Colors.textMain,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textLowContrast,
    marginTop: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  modalDismissArea: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: Colors.bgColor,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.textLowContrast,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: FontSizes.s1.size,
    lineHeight: FontSizes.s1.lineHeight,
    color: Colors.textMain,
  },
});
