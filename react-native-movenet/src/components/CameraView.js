/**
 * CameraView.js - Component untuk menampilkan kamera
 * Menggunakan expo-camera untuk mengambil foto real-time
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CameraView({ onClose, onCapture }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const cameraRef = useRef(null);

  useEffect(() => {
    // Request permission saat component mount
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  // Handle jika permission belum ada
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Memuat kamera...</Text>
      </View>
    );
  }

  // Handle jika permission ditolak
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Aplikasi memerlukan izin akses kamera
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Berikan Izin</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.permissionButton, styles.cancelButton]}
          onPress={onClose}
        >
          <Text style={styles.permissionButtonText}>Batal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Toggle kamera depan/belakang
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Ambil foto
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
          exif: false,
        });
        
        console.log('Photo taken:', photo.uri);
        
        if (onCapture) {
          onCapture(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Gagal mengambil foto');
      }
    }
  };

  return (
    <View style={styles.container}>
      <ExpoCameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
      >
        {/* Header dengan tombol close */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Ambil Foto</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Footer dengan kontrol kamera */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <MaterialIcons name="flip-camera-ios" size={35} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.captureButton}
            onPress={takePicture}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <View style={{ width: 60 }} />
        </View>
      </ExpoCameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  message: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    minWidth: 200,
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  flipButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'white',
  },
});
