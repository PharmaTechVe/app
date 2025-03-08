// src/components/Steps.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../styles/theme';
import PoppinsText from './PoppinsText';

interface StepsProps {
  totalSteps: number;
  currentStep: number;
  labels?: string[];
}

const Steps: React.FC<StepsProps> = ({ totalSteps, currentStep, labels }) => {
  return (
    <View style={styles.container}>
      {/* Contenedor que agrupa cada step y su label */}
      <View style={styles.stepsAndLabelsContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View key={index} style={styles.stepColumn}>
            {/* Contenedor para el step */}
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
            {/* Renderizamos el label, si existe */}
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

      {/* Línea de progreso (puedes ajustarla para que se ubique detrás de los steps) */}
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
  // Contenedor principal que agrupa las columnas (step + label)
  stepsAndLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Cada columna contiene el step y su label centrado
  stepColumn: {
    alignItems: 'center',
    flex: 1,
  },
  // Estilos del círculo (step)
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
  // Estilos para los labels
  labelText: {
    fontSize: 12,
    color: Colors.textLowContrast,
    textAlign: 'center',
    marginTop: 8,
  },
  activeLabel: {
    color: Colors.primary,
    fontWeight: '600',
  },
  // Contenedor para la línea de progreso
  progressLineContainer: {
    position: 'absolute',
    top: 28, // Ajusta este valor según la alineación vertical
    height: 2,
    backgroundColor: Colors.textLowContrast,
    zIndex: -1, // Asegura que esté detrás de los steps
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
