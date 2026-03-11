module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      ['module-resolver', {
        root: ['./'],
        alias: {
          '@': './',
          '@components': './components',
          '@hooks': './hooks',
          '@lib': './lib',
          '@stores': './stores',
          '@types': './types',
          '@constants': './constants',
        },
      }],
      'react-native-paper/babel',
      'react-native-reanimated/plugin',
    ],
  };
};