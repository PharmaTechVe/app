import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import Button from '../../components/Button';
import PoppinsText from '../../components/PoppinsText';
import Alert from '../../components/Alerts';
import { Colors, FontSizes } from '../../styles/theme';
import { AuthService } from '../../services/auth';
import { XMarkIcon } from 'react-native-heroicons/outline';

export default function EmailVerificationModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0); // Countdown state
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const codeRefs = useRef<Array<TextInput>>([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resending && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResending(false);
    }
    return () => clearInterval(timer);
  }, [resending, countdown]);

  const handleVerifyCode = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      setErrorMessage('El código debe tener 6 dígitos');
      setShowErrorAlert(true);
      return;
    }

    setLoading(true);
    try {
      await AuthService.validateOtp(enteredCode);
      setShowSuccessAlert(true);
      setCode(['', '', '', '', '', '']);
      setTimeout(() => onClose(), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resending) return;

    setResending(true);
    setCountdown(60);
    try {
      const response = await AuthService.resendOtp();
      if (response.success) {
        setShowSuccessAlert(true);
        setErrorMessage('Código reenviado exitosamente.');
      } else {
        setErrorMessage(response.error || 'Error al reenviar el código.');
        setShowErrorAlert(true);
      }
    } finally {
      setResending(false);
    }
  };

  const renderCodeInputs = useCallback(() => {
    return (
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (codeRefs.current[index] = ref as TextInput)}
            placeholder="•"
            placeholderTextColor={Colors.textLowContrast}
            style={styles.codeInput}
            caretHidden={true}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => {
              const newCode = [...code];
              const cleanedText = text.replace(/[^0-9]/g, '');
              newCode[index] = cleanedText;
              setCode(newCode);
              if (cleanedText && index < 5) {
                codeRefs.current[index + 1]?.focus();
              }
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                const newCode = [...code];
                newCode[index - 1] = '';
                setCode(newCode);
                codeRefs.current[index - 1]?.focus();
              }
            }}
          />
        ))}
      </View>
    );
  }, [code]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        setCode(['', '', '', '', '', '']);
        onClose();
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setCode(['', '', '', '', '', '']);
              onClose();
            }}
          >
            <Text>
              <XMarkIcon style={styles.closeButtonIcon} />
            </Text>
          </TouchableOpacity>

          {/* Alerts */}
          <View style={styles.alertsContainer}>
            {showErrorAlert && (
              <Alert
                type="error"
                title="Error"
                message={errorMessage}
                alertStyle="regular"
                borderColor
                onClose={() => setShowErrorAlert(false)}
              />
            )}
            {showSuccessAlert && (
              <Alert
                type="success"
                title="Verificación exitosa"
                message="Redirigiendo a la página principal..."
                alertStyle="regular"
                borderColor
                onClose={() => setShowSuccessAlert(false)}
              />
            )}
          </View>

          <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
            <View style={styles.stepContainer}>
              <PoppinsText weight="medium" style={styles.stepTitle}>
                Confirma tu correo electrónico
              </PoppinsText>
              <PoppinsText weight="regular" style={styles.stepDescription}>
                Introduce el código enviado a tu correo para confirmarlo
              </PoppinsText>
              {renderCodeInputs()}
              <Button
                title="Verificar"
                onPress={handleVerifyCode}
                style={styles.button}
                size="medium"
                loading={loading}
              />
              <TouchableOpacity
                style={[styles.resendCodeButton, resending && { opacity: 0.5 }]} // Adjust opacity when disabled
                onPress={handleResendCode}
                disabled={resending} // Disable the button
              >
                <Text style={styles.resendCodeText}>on Reenviar código</Text>
              </TouchableOpacity>
              {resending && (
                <Text style={styles.countdownText}>
                  Puedes reenviar el código en {countdown} segundos
                </Text>
              )}
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: 489,
    backgroundColor: Colors.bgColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 22 - 10,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 1000,
  },
  closeButtonIcon: {
    width: 24,
    height: 24,
    color: Colors.textMain,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  stepContainer: {
    width: '100%',
    marginVertical: 21,
  },
  alertsContainer: {
    position: 'absolute',
    width: 326,
    left: '50%',
    marginLeft: -162,
    top: 20,
    right: 0,
    zIndex: 1000,
  },
  stepTitle: {
    fontSize: FontSizes.h3.size,
    lineHeight: FontSizes.h3.lineHeight,
    color: Colors.textMain,
    marginBottom: 24,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.textLowContrast,
    textAlign: 'center',
    marginBottom: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  codeInput: {
    width: 42,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.stroke,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    color: Colors.textMain,
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    borderRadius: 8,
    backgroundColor: Colors.menuWhite,
    includeFontPadding: false,
    padding: 0,
    textAlignVertical: 'center',
  },
  button: {
    marginTop: 21,
    width: '100%',
    height: 50,
  },
  resendCodeButton: {
    alignSelf: 'flex-end',
    marginTop: 21,
  },
  resendCodeText: {
    color: Colors.secondaryLight,
    fontSize: FontSizes.b2.size,
    lineHeight: FontSizes.b2.lineHeight,
    fontFamily: 'Poppins_400Regular',
  },
  countdownText: {
    marginTop: 8,
    textAlign: 'center',
    color: Colors.textLowContrast,
    fontSize: FontSizes.b2.size,
    fontFamily: 'Poppins_400Regular',
  },
});
