import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState } from 'react';

export default function EditorScreen({ route, navigation }) {
  const imageUri = route?.params?.imageUri;
  const [pixelSize, setPixelSize] = useState(20);
  const [maxColors, setMaxColors] = useState(64);
  const [brightness, setBrightness] = useState(0);
  const [sharpness, setSharpness] = useState(0);
  const [vibrance, setVibrance] = useState(0);

  return (
    <View style={styles.container}>
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
      <Slider minimumValue={8} maximumValue={256} value={maxColors} onValueChange={setMaxColors} minimumTrackTintColor="#FF6B6B" maximumTrackTintColor="#ddd" />

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

      <TouchableOpacity style={styles.applyButton} onPress={() => navigation.navigate('Preview', { imageUri, pixelSize: Math.round(pixelSize), maxColors: Math.round(maxColors), brightness: Math.round(brightness), sharpness: Math.round(sharpness), vibrance: Math.round(vibrance) })}>
        <Text style={styles.applyButtonText}>Apply Settings →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 24, backgroundColor: '#fff' },
  logo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  preview: { width: '100%', height: 180, borderRadius: 12, marginBottom: 16, backgroundColor: '#eee' },
  sliderRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  label: { fontSize: 14, fontWeight: 'bold' },
  value: { fontSize: 14, color: '#666' },
  applyButton: { backgroundColor: '#FF6B6B', padding: 16, borderRadius: 30, alignItems: 'center', marginTop: 24 },
  applyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});