// webpack.config.js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    // Quando for web, trocamos o pacote por um shim que não usa `window`
    '@react-native-async-storage/async-storage': require.resolve('./shims/asyncStorage.web.js'),
  };

  return config;
};