// tailwind.config.js
const themeTokens = require('./src/styles/theme').default;

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: themeTokens.Colors.primary,
        secondary: themeTokens.Colors.secondary,
        secondaryLight: themeTokens.Colors.secondaryLight,
        secondaryWhite: themeTokens.Colors.secondaryWhite,
        textMain: themeTokens.Colors.textMain,
        textWhite: themeTokens.Colors.textWhite,
        textHighContrast: themeTokens.Colors.textHighContrast,
        textLowContrast: themeTokens.Colors.textLowContrast,
        stroke: themeTokens.Colors.stroke,
        disableText: themeTokens.Colors.disableText,
        placeholder: themeTokens.Colors.placeholder,
        semanticSuccess: themeTokens.Colors.semanticSuccess,
        semanticWarning: themeTokens.Colors.semanticWarning,
        semanticDanger: themeTokens.Colors.semanticDanger,
        semanticInfo: themeTokens.Colors.semanticInfo,
        iconMainDefault: themeTokens.Colors.iconMainDefault,
        iconWhite: themeTokens.Colors.iconWhite,
        iconMainPrimary: themeTokens.Colors.iconMainPrimary,
        iconMainSecondary: themeTokens.Colors.iconMainSecondary,
        menuWhite: themeTokens.Colors.menuWhite,
        menuPrimary: themeTokens.Colors.menuPrimary,
        toggleOn: themeTokens.Colors.toggleOn,
        toggleOff: themeTokens.Colors.toggleOff,
      },
      fontFamily: {
        poppins: [themeTokens.Fonts.poppinsRegular],
        'poppins-medium': [themeTokens.Fonts.poppinsMedium],
        'poppins-semibold': [themeTokens.Fonts.poppinsSemibold],
      },
      // Para fontSize, convertimos cada objeto a un arreglo [size, {lineHeight}]
      fontSize: {
        h1: [
          themeTokens.FontSizes.h1.size,
          { lineHeight: themeTokens.FontSizes.h1.lineHeight },
        ],
        h2: [
          themeTokens.FontSizes.h2.size,
          { lineHeight: themeTokens.FontSizes.h2.lineHeight },
        ],
        h3: [
          themeTokens.FontSizes.h3.size,
          { lineHeight: themeTokens.FontSizes.h3.lineHeight },
        ],
        h4: [
          themeTokens.FontSizes.h4.size,
          { lineHeight: themeTokens.FontSizes.h4.lineHeight },
        ],
        h5: [
          themeTokens.FontSizes.h5.size,
          { lineHeight: themeTokens.FontSizes.h5.lineHeight },
        ],
        s1: [
          themeTokens.FontSizes.s1.size,
          { lineHeight: themeTokens.FontSizes.s1.lineHeight },
        ],
        s2: [
          themeTokens.FontSizes.s2.size,
          { lineHeight: themeTokens.FontSizes.s2.lineHeight },
        ],
        b1: [
          themeTokens.FontSizes.b1.size,
          { lineHeight: themeTokens.FontSizes.b1.lineHeight },
        ],
        b2: [
          themeTokens.FontSizes.b2.size,
          { lineHeight: themeTokens.FontSizes.b2.lineHeight },
        ],
        b3: [
          themeTokens.FontSizes.b3.size,
          { lineHeight: themeTokens.FontSizes.b3.lineHeight },
        ],
        b4: [
          themeTokens.FontSizes.b4.size,
          { lineHeight: themeTokens.FontSizes.b4.lineHeight },
        ],
        c1: [
          themeTokens.FontSizes.c1.size,
          { lineHeight: themeTokens.FontSizes.c1.lineHeight },
        ],
        c2: [
          themeTokens.FontSizes.c2.size,
          { lineHeight: themeTokens.FontSizes.c2.lineHeight },
        ],
        c3: [
          themeTokens.FontSizes.c3.size,
          { lineHeight: themeTokens.FontSizes.c3.lineHeight },
        ],
        label: [
          themeTokens.FontSizes.label.size,
          { lineHeight: themeTokens.FontSizes.label.lineHeight },
        ],
        'btn-giant': [
          themeTokens.FontSizes.btnGiant.size,
          { lineHeight: themeTokens.FontSizes.btnGiant.lineHeight },
        ],
        'btn-large': [
          themeTokens.FontSizes.btnLarge.size,
          { lineHeight: themeTokens.FontSizes.btnLarge.lineHeight },
        ],
        'btn-medium': [
          themeTokens.FontSizes.btnMedium.size,
          { lineHeight: themeTokens.FontSizes.btnMedium.lineHeight },
        ],
        'btn-small': [
          themeTokens.FontSizes.btnSmall.size,
          { lineHeight: themeTokens.FontSizes.btnSmall.lineHeight },
        ],
        'btn-tiny': [
          themeTokens.FontSizes.btnTiny.size,
          { lineHeight: themeTokens.FontSizes.btnTiny.lineHeight },
        ],
      },
    },
  },
  plugins: [],
};
