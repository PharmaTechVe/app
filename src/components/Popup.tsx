// src/components/Popup.tsx
import React from 'react';
import {
  View,
  Image,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import Button from './Button';
import PoppinsText from './PoppinsText';
import { Colors, FontSizes } from '../styles/theme';

interface PopupProps {
  visible: boolean;
  type?: 'center' | 'bottom';
  headerText?: string;
  bodyText?: string;
  image?: ImageSourcePropType;
  primaryButton?: {
    text: string;
    onPress: () => void;
  };
  secondaryButton?: {
    text: string;
    onPress: () => void;
  };
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({
  visible,
  type = 'center',
  headerText,
  bodyText,
  image,
  primaryButton,
  secondaryButton,
  onClose,
}) => {
  const slideAnim = React.useRef(
    new Animated.Value(type === 'bottom' ? 300 : -100),
  ).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 18,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: type === 'bottom' ? 300 : -100,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const getContainerStyle = (): Animated.WithAnimatedObject<ViewStyle> => {
    if (type === 'bottom') {
      return {
        transform: [{ translateY: slideAnim }],
        width: '100%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      };
    }
    return {
      borderRadius: 16,
      marginHorizontal: 24,
      transform: [{ translateY: slideAnim }],
    };
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={[
            styles.overlay,
            type === 'bottom' && { justifyContent: 'flex-end' },
          ]}
        >
          <Animated.View style={[styles.container, getContainerStyle()]}>
            <TouchableWithoutFeedback>
              <View style={styles.content}>
                {/* Header */}
                {image && (
                  <Image
                    source={image}
                    style={styles.image}
                    resizeMode="contain"
                  />
                )}

                {headerText && (
                  <PoppinsText weight="medium" style={styles.headerText}>
                    {headerText}
                  </PoppinsText>
                )}

                {/* Body */}
                {bodyText && (
                  <PoppinsText style={styles.bodyText}>{bodyText}</PoppinsText>
                )}

                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                  {secondaryButton && (
                    <Button
                      title={secondaryButton.text}
                      onPress={secondaryButton.onPress}
                      variant="primary"
                      size="medium"
                      style={styles.button}
                      mode="outline"
                    />
                  )}

                  {primaryButton && (
                    <Button
                      title={primaryButton.text}
                      onPress={primaryButton.onPress}
                      variant="primary"
                      size="medium"
                      style={styles.button}
                    />
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: Colors.menuWhite,
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  headerText: {
    fontSize: FontSizes.h4.size,
    color: Colors.textMain,
    textAlign: 'center',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: FontSizes.b1.size,
    color: Colors.textLowContrast,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: FontSizes.b1.lineHeight,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
  },
});

export default Popup;
