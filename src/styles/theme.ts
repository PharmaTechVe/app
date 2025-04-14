export const Colors = {
  primary: '#1C2143',
  secondary: '#2ECC71',
  secondaryLight: '#A3E4D7',
  secondaryWhite: '#FFFFFF',
  secondaryGray: '#6B7280',
  bgColor: '#F6FAFF',

  textMain: '#393938',
  textWhite: '#FFFFFF',
  textHighContrast: '#000000',
  textLowContrast: '#666666',
  stroke: '#DFE4EA',
  disableText: '#777675',
  placeholder: '#666666',

  semanticSuccess: '#00C814',
  semanticWarning: '#FFD569',
  semanticDanger: '#E10000',
  semanticInfo: '#A3E4D7',

  iconMainDefault: '#292D32',
  iconWhite: '#FFFFFF',
  iconMainPrimary: '#1C2143',
  iconMainSecondary: '#A3E4D7',
  iconCancel: '#FF5959',

  menuWhite: '#FFFFFF',
  menuPrimary: '#1C2143',

  toggleOn: '#1C2143',
  toggleOff: '#D7D5D3',

  yellow: '#FFBA2E0',

  gray_100: '#E7E7E6',
  gray_500: '#6E6D6C',

  secondary_300: '#8BEAB3',
};

export const Fonts = {
  // Usamos los nombres reales de las fuentes cargadas con useFonts.
  poppinsRegular: 'Poppins_400Regular',
  poppinsMedium: 'Poppins_500Medium',
  poppinsSemibold: 'Poppins_600SemiBold',
};

export const FontSizes = {
  h1: { size: 48, lineHeight: 58 },
  h2: { size: 40, lineHeight: 48 },
  h3: { size: 32, lineHeight: 38 },
  h4: { size: 28, lineHeight: 34 },
  h5: { size: 24, lineHeight: 28 },
  s1: { size: 18, lineHeight: 28 },
  s2: { size: 16, lineHeight: 24 },
  b1: { size: 16, lineHeight: 24 },
  b2: { size: 16, lineHeight: 24 },
  b3: { size: 14, lineHeight: 20 },
  b4: { size: 14, lineHeight: 20 },
  c1: { size: 12, lineHeight: 16 },
  c2: { size: 12, lineHeight: 14 },
  c3: { size: 10, lineHeight: 14 },
  label: { size: 12, lineHeight: 16 },

  // Button Fonts
  btnGiant: { size: 18, lineHeight: 24 },
  btnLarge: { size: 16, lineHeight: 20 },
  btnMedium: { size: 14, lineHeight: 16 },
  btnSmall: { size: 12, lineHeight: 16 },
  btnTiny: { size: 10, lineHeight: 12 },
};

export const ToggleSizes = {
  small: { width: 40, height: 24, circleSize: 18, radius: 12 },
  medium: { width: 55, height: 32, circleSize: 26, radius: 16 },
  large: { width: 70, height: 40, circleSize: 34, radius: 20 },
};

export default {
  Colors,
  Fonts,
  FontSizes,
  ToggleSizes,
};
