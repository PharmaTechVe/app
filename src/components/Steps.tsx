import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../styles/theme';
import PoppinsText from './PoppinsText';

interface StepsProps {
  totalSteps: number;
}

const Steps: React.FC<StepsProps> = ({ totalSteps }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [pressedStep, setPressedStep] = useState<number | null>(null);

  const handleStepPress = (step: number) => {
    setCurrentStep(step);
    setPressedStep(step);
    setTimeout(() => setPressedStep(null), 200);
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        <View
          style={[
            styles.lineForeground,
            { width: `${(currentStep - 1) * (100 / (totalSteps - 1))}%` },
            currentStep > 1 && styles.activeLine,
          ]}
        ></View>
        {Array.from({ length: totalSteps }, (_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.step,
              index > 0 && styles.stepBorder,
              currentStep >= index + 1 && styles.activeStep,
            ]}
            onPress={() => handleStepPress(index + 1)}
            activeOpacity={1}
          >
            <PoppinsText
              style={[
                styles.stepText,
                currentStep >= index + 1 && styles.activeStepText,
                pressedStep === index + 1 && styles.pressedStepText,
              ]}
            >
              {index + 1}
            </PoppinsText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  stepsContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  lineForeground: {
    position: 'absolute',
    left: 0,
    top: '50%',
    height: 2,
    backgroundColor: Colors.primary,
    transform: [{ translateY: -1 }],
  },
  step: {
    position: 'relative',
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBorder: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  activeStep: {
    backgroundColor: Colors.primary,
  },
  stepText: {
    fontWeight: 'bold',
    color: Colors.primary,
    fontFamily: Fonts.poppinsRegular,
  },
  activeStepText: {
    color: Colors.textWhite,
  },
  activeLine: {
    backgroundColor: Colors.primary,
  },
  pressedStepText: {
    color: Colors.textLowContrast,
  },
});

export default Steps;
