import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('İzin gerekli', 'Galeri erişimine izin vermelisiniz.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>✂️ PixelStitch</Text>
      <Text style={styles.title}>Welcome to PixelStitch!</Text>
      <Text style={styles.subtitle}>Create your own unique pixel & cross-stitch patterns from photos.</Text>

      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        ) : (
          <>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadText}>Tap to upload image</Text>
            <Text style={styles.uploadHint}>JPEG, PNG, WEBP{'\n'}up to 15MB</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.startButton, !selectedImage && styles.startButtonDisabled]}
        onPress={() => selectedImage && navigation.navigate('Editor', { imageUri: selectedImage })}
      >
        <Text style={styles.startButtonText}>Start Creating →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 80, paddingHorizontal: 24, backgroundColor: '#fff' },
  logo: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 32 },
  uploadBox: { width: '100%', height: 200, borderWidth: 2, borderColor: '#90CAF9', borderStyle: 'dashed', borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F8FF', marginBottom: 32 },
  uploadIcon: { fontSize: 40, marginBottom: 8 },
  uploadText: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  uploadHint: { fontSize: 12, color: '#aaa', textAlign: 'center' },
  previewImage: { width: '100%', height: '100%', borderRadius: 14 },
  startButton: { width: '100%', backgroundColor: '#FF6B6B', padding: 16, borderRadius: 30, alignItems: 'center' },
  startButtonDisabled: { backgroundColor: '#ccc' },
  startButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});