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
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const codeRefs = useRef<Array<TextInput>>([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showVerifySuccessAlert, setShowVerifySuccessAlert] = useState(false);
  const [showResendSuccessAlert, setShowResendSuccessAlert] = useState(false);
  const [showInvalidCodeMessage, setShowInvalidCodeMessage] = useState(false);

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

  useEffect(() => {
    if (showErrorAlert) {
      const timer = setTimeout(() => setShowErrorAlert(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showErrorAlert]);

  useEffect(() => {
    if (showVerifySuccessAlert) {
      const timer = setTimeout(() => setShowVerifySuccessAlert(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showVerifySuccessAlert]);

  useEffect(() => {
    if (showResendSuccessAlert) {
      const timer = setTimeout(() => setShowResendSuccessAlert(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showResendSuccessAlert]);

  const handleVerifyCode = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      setErrorMessage('El código debe tener 6 dígitos');
      setShowErrorAlert(true);
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.validateOtp(enteredCode);

      if (response.success) {
        setShowVerifySuccessAlert(true);
        setCode(['', '', '', '', '', '']);
        setShowInvalidCodeMessage(false);
        setTimeout(() => onClose(), 2000);
      } else {
        setErrorMessage(
          response.error ||
            'Error al verificar el código. Inténtalo nuevamente.',
        );
        if (response.error?.includes('I')) {
          setShowInvalidCodeMessage(true);
        }
        setShowErrorAlert(true);
      }
    } catch {
      setErrorMessage(
        'Error inesperado al verificar el código. Inténtalo nuevamente.',
      );
      setShowErrorAlert(true);
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
        setShowResendSuccessAlert(true);
      } else {
        setErrorMessage(response.error || 'Error al reenviar el código.');
        setShowErrorAlert(true);
      }
    } catch {
      setErrorMessage('Error inesperado al reenviar el código.');
      setShowErrorAlert(true);
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
              setShowInvalidCodeMessage(false);
              if (cleanedText && index < 5) {
                codeRefs.current[index + 1]?.focus();
              }
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                const newCode = [...code];
                newCode[index - 1] = '';
                setCode(newCode);
                setShowInvalidCodeMessage(false);
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
            {showVerifySuccessAlert && (
              <Alert
                type="success"
                title="Verificación exitosa"
                message="Correo Verificado"
                alertStyle="regular"
                borderColor
                onClose={() => setShowVerifySuccessAlert(false)}
              />
            )}
            {showResendSuccessAlert && (
              <Alert
                type="success"
                title="Código reenviado"
                message="El código fue reenviado exitosamente."
                alertStyle="regular"
                borderColor
                onClose={() => setShowResendSuccessAlert(false)}
              />
            )}
          </View>
          <Animated.View style={[styles.fadeAnim, { flex: 1 }]}>
            <View style={styles.stepContainer}>
              <PoppinsText weight="medium" style={styles.stepTitle}>
                Confirma tu correo electrónico
              </PoppinsText>
              <PoppinsText weight="regular" style={styles.stepDescription}>
                Introduce el código enviado a tu correo para confirmarlo
              </PoppinsText>
              {renderCodeInputs()}
              {showInvalidCodeMessage && (
                <PoppinsText style={styles.invalidCodeMessage}>
                  Código incorrecto
                </PoppinsText>
              )}
              <Button
                title="Verificar"
                onPress={handleVerifyCode}
                style={styles.button}
                size="medium"
                loading={loading}
              />
              <TouchableOpacity
                style={[
                  styles.resendCodeButton,
                  resending && styles.disabledButton,
                ]}
                onPress={handleResendCode}
                disabled={resending}
              >
                <Text style={styles.resendCodeText}>Reenviar código</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: 489,
    width: 350,
    backgroundColor: Colors.textWhite,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.stroke,
    paddingTop: 12,
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
  stepContainer: {
    width: '100%',
    marginVertical: 21,
    marginTop: 70,
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
    textAlign: 'right',
    color: Colors.textLowContrast,
    fontSize: FontSizes.b4.size,
    fontFamily: 'Poppins_400Regular',
  },
  fadeAnim: {
    opacity: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  invalidCodeMessage: {
    color: Colors.semanticDanger,
    fontSize: FontSizes.b2.size,
    textAlign: 'left',
    marginVertical: 8,
  },
});
