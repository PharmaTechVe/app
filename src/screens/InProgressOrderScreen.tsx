import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import PaymentStatusMessage from '../components/PaymentStatusMessage';
import PaymentInfoForm from '../components/PaymentInfoForm';
import OrderSummary from '../components/OrderSummary';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import { useLocalSearchParams } from 'expo-router';
import { UserService } from '../services/user';
import Steps from '../components/Steps';
import Button from '../components/Button';
import { truncateString } from '../utils/commons';
import { OrderStatus } from '../hooks/useOrderSocket';

const stepsLabels = [
  'Opciones de Compra',
  'Visualización de datos',
  'Confirmación de orden',
];

const InProgressOrderScreen = () => {
  const {
    paymentMethod,
    orderStatus,
    orderNumber,
    orderType,
    totalPrice,
    userName: initialUserName,
    step: initialStep,
  } = useLocalSearchParams();

  const [step, setStep] = useState(initialStep ? Number(initialStep) : 1);
  const [userName, setUserName] = useState<string | null>(
    (initialUserName as string) || 'Usuario',
  );

  useEffect(() => {
    const fetchUserName = async () => {
      const response = await UserService.getProfile();
      if (response.success && response.data) {
        setUserName(response.data.firstName);
      }
    };
    fetchUserName();
  }, []);

  // Normaliza el método de pago recibido
  function normalizePaymentMethod(
    method: unknown,
  ): 'CARD' | 'CASH' | 'BANK_TRANSFER' | 'MOBILE_PAYMENT' | null {
    if (!method) return null;
    const value = Array.isArray(method) ? method[0] : method;
    switch ((value as string)?.toUpperCase?.()) {
      case 'CARD':
        return 'CARD';
      case 'CASH':
        return 'CASH';
      case 'BANK_TRANSFER':
        return 'BANK_TRANSFER';
      case 'MOBILE_PAYMENT':
        return 'MOBILE_PAYMENT';
      default:
        return null;
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.steps}>
          <Steps
            totalSteps={stepsLabels.length}
            currentStep={step}
            labels={stepsLabels}
          />
        </View>
        {step === 1 && (
          <>
            <PoppinsText style={styles.purchaseOptionsTitle}>
              Opciones de Compra
            </PoppinsText>
          </>
        )}
        {step === 2 && (
          <>
            <PoppinsText style={styles.purchaseOptionsTitle}>
              Visualización de datos
            </PoppinsText>
            <View style={styles.whiteBackgroundContainer}>
              <View style={styles.paymentInfoFormContainer}>
                <PaymentInfoForm
                  paymentMethod={normalizePaymentMethod(paymentMethod)}
                  total={totalPrice ? String(totalPrice) : ''}
                  onValidationChange={() => {}}
                  onBankChange={() => {}}
                  onReferenceChange={() => {}}
                  onDocumentNumberChange={() => {}}
                  onPhoneChange={() => {}}
                />
              </View>
              <OrderSummary />
              <View style={styles.totalContainer}>
                <View style={styles.totalRow}>
                  <PoppinsText style={styles.totalLabel}>Total:</PoppinsText>
                  <PoppinsText style={styles.totalAmount}>
                    ${totalPrice ? totalPrice : ''}
                  </PoppinsText>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  title="Confirmar Orden"
                  size="medium"
                  style={styles.nextButton}
                  variant="primary"
                  onPress={() => setStep(3)}
                />
              </View>
            </View>
          </>
        )}
        {step === 3 && (
          <>
            <PoppinsText style={styles.purchaseOptionsTitle}>
              Confirmacion de la orden
            </PoppinsText>
            <PaymentStatusMessage
              orderStatus={orderStatus as OrderStatus}
              orderNumber={truncateString(orderNumber as string, 8, '')}
              userName={userName || ''}
            />
            <View style={styles.whiteBackgroundContainer}>
              <View style={styles.confirmationContainer}>
                {/* Show additional confirmation message based on status and type */}
                {orderStatus === 'approved' && orderType === 'pickup' && (
                  <PoppinsText>Tu pedido está listo para recoger.</PoppinsText>
                )}
                {orderStatus === 'approved' && orderType === 'delivery' && (
                  <PoppinsText>Tu pedido está en camino.</PoppinsText>
                )}
              </View>
              <OrderSummary />
              <View style={styles.totalContainer}>
                <View style={styles.totalRow}>
                  <PoppinsText style={styles.totalLabel}>Total:</PoppinsText>
                  <PoppinsText style={styles.totalAmount}>
                    ${totalPrice ? totalPrice : ''}
                  </PoppinsText>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  steps: {
    marginTop: 30,
    marginBottom: 20,
    padding: 20,
  },
  stepLabel: {
    fontSize: FontSizes.h5.size,
    color: Colors.textMain,
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  purchaseOptionsTitle: {
    paddingVertical: 16,
    fontSize: FontSizes.h5.size,
    color: Colors.textMain,
    marginBottom: 30,
    alignSelf: 'flex-start',
    padding: 20,
  },
  confirmationContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  nextButton: {
    color: Colors.primary,
    fontSize: FontSizes.h5.size,
    fontWeight: 'bold',
    padding: 10,
    width: '100%',
    height: 50,
    marginTop: 15,
    marginBottom: 16,
  },
  whiteBackgroundContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 20,
  },
  paymentInfoFormContainer: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  totalContainer: {
    width: '100%',
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  totalLabel: {
    fontSize: FontSizes.h5.size,
    lineHeight: FontSizes.h5.lineHeight,
    color: Colors.textMain,
  },
  totalAmount: {
    fontSize: FontSizes.h5.size,
    lineHeight: FontSizes.h5.lineHeight,
    color: Colors.primary,
  },
});

export default InProgressOrderScreen;
