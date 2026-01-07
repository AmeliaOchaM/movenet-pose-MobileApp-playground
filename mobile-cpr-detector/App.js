import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CameraScreen from './components/CameraScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CameraScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
