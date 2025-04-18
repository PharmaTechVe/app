import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import Button from '../components/Button';
import { UserList } from '../types/api';
import Return from '../components/Return';
import { useRouter } from 'expo-router';
import { StarIcon } from 'react-native-heroicons/solid';
import Alert from '../components/Alerts';

const OrderDetailScreen = () => {
  const [order, setOrder] = useState<UserList>({});
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        //const order = await UserService.getOrder();

        if (order.success) {
          setOrder(order.data);
        }
      } catch (error) {
        console.log(error);
        setErrorMessage('Ocurrio un error');
      }
    };

    fetchOrder();
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
        {showSuccessAlert && (
          <Alert
            type="success"
            title="Éxito"
            message="Cuenta creada correctamente"
            onClose={() => {
              setShowSuccessAlert(false);
              router.replace('/success');
            }}
            borderColor
          />
        )}
      </View>
      <Return onClose={() => router.push('/')} />
      <View style={styles.orderHeader}>
        <PoppinsText style={{ fontSize: FontSizes.s1.size, marginBottom: 10 }}>
          Detalle del pedido
        </PoppinsText>
      </View>

      <View style={styles.orderInfo}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderColor: Colors.gray_100,
            paddingHorizontal: 10,
            paddingVertical: 20,
          }}
        >
          <View>
            <PoppinsText>Número de pedido:</PoppinsText>
            <PoppinsText>#430960</PoppinsText>
          </View>
          <Button
            title="Re ordenar"
            size="small"
            style={{ paddingVertical: 0 }}
          />
        </View>
        <View>
          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <View
              style={{
                width: 100,
                backgroundColor: Colors.gray_100,
                marginRight: 5,
                borderRadius: 10,
              }}
            ></View>
            <View style={{ flex: 1 }}>
              <PoppinsText>Omeprazol</PoppinsText>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 10,
                }}
              >
                <PoppinsText>$5.00</PoppinsText>
                <PoppinsText>Cantidad: 1</PoppinsText>
              </View>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <StarIcon color={Colors.gray_100} />
                <TouchableOpacity>
                  <PoppinsText>Ir al producto</PoppinsText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <PoppinsText>Subtotal</PoppinsText>
            <PoppinsText>$0</PoppinsText>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <PoppinsText>Descuentos</PoppinsText>
            <PoppinsText>-$0</PoppinsText>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <PoppinsText>IVA</PoppinsText>
            <PoppinsText>$0</PoppinsText>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <PoppinsText>Total</PoppinsText>
            <PoppinsText>$0</PoppinsText>
          </View>
        </View>
      </View>
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
  orderHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  orderImage: {
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
  orderInfo: {
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

export default OrderDetailScreen;
