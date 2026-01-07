const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add binary file extensions
config.resolver.assetExts.push(
  // Model files
  'bin',
  'tflite',
  // Add other extensions if needed
);

module.exports = config;
