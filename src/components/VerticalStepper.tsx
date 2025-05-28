import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';

interface VerticalStepperProps {
  steps: {
    title: string;
    description: string;
  }[];
  currentStep: number;
}

const VerticalStepper: React.FC<VerticalStepperProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepIndicatorContainer}>
              {/* Línea superior (excepto para el primer paso) */}
              {index > 0 && (
                <View
                  style={[
                    styles.connector,
                    isCompleted || isActive
                      ? styles.completedConnector
                      : styles.pendingConnector,
                  ]}
                />
              )}

              {/* Círculo del paso */}
              <View
                style={[
                  styles.stepIndicator,
                  isCompleted && styles.completedStep,
                  isActive && styles.activeStep,
                ]}
              ></View>

              {/* Línea inferior (excepto para el último paso) */}
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    isCompleted
                      ? styles.completedConnector
                      : styles.pendingConnector,
                    { top: 0, bottom: 0 },
                  ]}
                />
              )}
            </View>
            <View style={styles.stepContent}>
              <PoppinsText
                style={[
                  isActive && styles.activeStepTitle,
                  isCompleted && styles.activeStepTitle,
                ]}
              >
                {step.title}
              </PoppinsText>
              {step.description && (
                <PoppinsText style={styles.stepDescription}>
                  {step.description}
                </PoppinsText>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  stepContainer: {
    flexDirection: 'row',
  },
  stepIndicatorContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  stepIndicator: {
    width: 13,
    height: 13,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray_500,
    zIndex: 1,
  },
  completedStep: {
    backgroundColor: Colors.semanticSuccess,
    borderColor: Colors.semanticSuccess,
  },
  activeStep: {
    backgroundColor: Colors.semanticSuccess,
  },
  connector: {
    position: 'absolute',
    width: 2,
  },
  completedConnector: {
    backgroundColor: Colors.semanticSuccess,
  },
  pendingConnector: {
    backgroundColor: Colors.gray_100,
  },
  stepContent: {
    flex: 1,
    marginBottom: 13,
  },
  activeStepTitle: {
    color: Colors.semanticSuccess,
  },
  stepDescription: {
    color: Colors.secondaryGray,
    fontSize: FontSizes.c3.size,
  },
});

export default VerticalStepper;
