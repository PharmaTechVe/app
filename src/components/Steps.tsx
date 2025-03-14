import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Fonts, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';

interface StepsProps {
  totalSteps: number;
  currentStep: number;
  labels?: string[];
}

const Steps: React.FC<StepsProps> = ({ totalSteps, currentStep, labels }) => {
  return (
    <View style={styles.container}>
      {/* Label and step container */}
      <View style={styles.stepsAndLabelsContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View key={index} style={styles.stepColumn}>
            {/* Step container */}
            <View
              style={[
                styles.step,
                index > 0 && styles.stepBorder,
                currentStep >= index + 1 && styles.activeStep,
              ]}
            >
              <PoppinsText
                style={[
                  styles.stepText,
                  currentStep >= index + 1 && styles.activeStepText,
                ]}
              >
                {index + 1}
              </PoppinsText>
            </View>
            {/* Label render */}
            {labels && labels[index] && (
              <PoppinsText
                style={[
                  styles.labelText,
                  currentStep >= index + 1 && styles.activeLabel,
                ]}
              >
                {labels[index]}
              </PoppinsText>
            )}
          </View>
        ))}
      </View>

      {/* Progress bar */}
      <View
        style={[
          styles.progressLineContainer,
          {
            left: `${50 / totalSteps}%`,
            right: `${50 / totalSteps}%`,
          },
        ]}
      >
        <View
          style={[
            styles.lineForeground,
            { width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` },
            currentStep > 1 && styles.activeLine,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
  },
  stepsAndLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepColumn: {
    alignItems: 'center',
    flex: 1,
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
  labelText: {
    fontSize: FontSizes.label.size,
    lineHeight: FontSizes.label.lineHeight,
    color: Colors.textLowContrast,
    textAlign: 'center',
    marginTop: 8,
  },
  activeLabel: {
    color: Colors.primary,
    fontWeight: '600',
  },
  progressLineContainer: {
    position: 'absolute',
    top: 28,
    height: 2,
    zIndex: -1,
  },
  lineForeground: {
    height: 2,
    backgroundColor: Colors.primary,
  },
  activeLine: {
    backgroundColor: Colors.primary,
  },
});

export default Steps;
