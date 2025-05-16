const isProduction = process.env.NODE_ENV === 'production';
const isDevelopmentBuild = process.env.EAS_BUILD_PROFILE === 'development';

module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      !isProduction &&
        !isDevelopmentBuild && [
          'module:react-native-dotenv',
          {
            moduleName: '@env',
            path: '.env',
            blacklist: null,
            whitelist: null,
            safe: false,
            allowUndefined: true,
          },
        ],
    ].filter(Boolean),
  };
};
