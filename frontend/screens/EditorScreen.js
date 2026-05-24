import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import Slider from '@react-native-community/slider';
import { API_BASE_URL } from '../api';

export default function EditorScreen({ route, navigation }) {
  const imageUri = route?.params?.imageUri;
  const [pixelSize, setPixelSize] = useState(20);
  const [maxColors, setMaxColors] = useState(16);
  const [brightness, setBrightness] = useState(0);
  const [sharpness, setSharpness] = useState(0);
  const [vibrance, setVibrance] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleApply() {
    if (!imageUri) {
      Alert.alert('Error', 'No image selected.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload the image to /upload-image
      const uploadForm = new FormData();
      uploadForm.append('file', {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      const uploadResponse = await fetch(`${API_BASE_URL}/upload-image`, {
        method: 'POST',
        body: uploadForm,
      });

      if (!uploadResponse.ok) {
        throw new Error('Image upload failed.');
      }

      const uploadData = await uploadResponse.json();
      const imageId = uploadData.image_id;

      // Step 2: Send settings to /convert
      const convertForm = new FormData();
      convertForm.append('image_id', String(imageId));
      convertForm.append('pixel_size', String(Math.round(pixelSize)));
      convertForm.append('max_colors', String(Math.round(maxColors)));
      convertForm.append('brightness', String(Math.round(brightness)));
      convertForm.append('sharpness', String(Math.round(sharpness)));
      convertForm.append('vibrance', String(Math.round(vibrance)));
      convertForm.append('show_grid', 'true');
      convertForm.append('show_numbers', 'true');

      const convertResponse = await fetch(`${API_BASE_URL}/convert`, {
        method: 'POST',
        body: convertForm,
      });

      if (!convertResponse.ok) {
        throw new Error('Conversion failed.');
      }

      const convertData = await convertResponse.json();

      // Step 3: Navigate to Preview with results
      navigation.navigate('Preview', {
        imageUri: imageUri,
        outputPath: convertData.output_path,
        palette: convertData.palette,
        conversionId: convertData.conversion_id,
      });

    } catch (error) {
      Alert.alert('Connection Error', `Could not reach the server.\n\n${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>✂️ PixelStitch</Text>
      <Text style={styles.title}>Edit Pattern</Text>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

      <View style={styles.sliderRow}>
        <Text style={styles.label}>Pixel Size</Text>
        <Text style={styles.value}>{Math.round(pixelSize)}px</Text>
      </View>
      <Slider minimumValue={5} maximumValue={50} value={pixelSize} onValueChange={setPixelSize} minimumTrackTintColor="#FF6B6B" maximumTrackTintColor="#ddd" />

      <View style={styles.sliderRow}>
        <Text style={styles.label}>Max Colors</Text>
        <Text style={styles.value}>{Math.round(maxColors)}</Text>
      </View>
      <Slider minimumValue={2} maximumValue={64} value={maxColors} onValueChange={setMaxColors} minimumTrackTintColor="#FF6B6B" maximumTrackTintColor="#ddd" />

      <View style={styles.sliderRow}>
        <Text style={styles.label}>Brightness</Text>
        <Text style={styles.value}>{Math.round(brightness)}</Text>
      </View>
      <Slider minimumValue={-50} maximumValue={50} value={brightness} onValueChange={setBrightness} minimumTrackTintColor="#FF6B6B" maximumTrackTintColor="#ddd" />

      <View style={styles.sliderRow}>
        <Text style={styles.label}>Sharpness</Text>
        <Text style={styles.value}>{Math.round(sharpness)}</Text>
      </View>
      <Slider minimumValue={0} maximumValue={100} value={sharpness} onValueChange={setSharpness} minimumTrackTintColor="#90CAF9" maximumTrackTintColor="#ddd" />

      <View style={styles.sliderRow}>
        <Text style={styles.label}>Vibrance</Text>
        <Text style={styles.value}>{Math.round(vibrance)}</Text>
      </View>
      <Slider minimumValue={0} maximumValue={100} value={vibrance} onValueChange={setVibrance} minimumTrackTintColor="#90CAF9" maximumTrackTintColor="#ddd" />

      <TouchableOpacity
        style={[styles.applyButton, loading && styles.applyButtonDisabled]}
        onPress={handleApply}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.applyButtonText}>Apply Settings →</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 60, paddingHorizontal: 24, backgroundColor: '#fff', paddingBottom: 40 },
  logo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  preview: { width: '100%', height: 180, borderRadius: 12, marginBottom: 16, backgroundColor: '#eee' },
  sliderRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  label: { fontSize: 14, fontWeight: 'bold' },
  value: { fontSize: 14, color: '#666' },
  applyButton: { backgroundColor: '#FF6B6B', padding: 16, borderRadius: 30, alignItems: 'center', marginTop: 24 },
  applyButtonDisabled: { backgroundColor: '#ccc' },
  applyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});