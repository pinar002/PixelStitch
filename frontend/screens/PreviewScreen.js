import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Switch, ScrollView } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { API_BASE_URL } from '../api';

export default function PreviewScreen({ route, navigation }) {
  const { imageUri, outputPath, palette, conversionId } = route?.params || {};
  const [showGrid, setShowGrid] = useState(true);
  const [showNumbers, setShowNumbers] = useState(true);
  const [imageKey, setImageKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const filename = outputPath ? outputPath.split('/').pop() : null;
  const imageUrl = filename ? `${API_BASE_URL}/output/${filename}?key=${imageKey}` : null;

  async function handleToggle(newShowGrid, newShowNumbers) {
    if (!conversionId || loading) return; // loading iken yeni istek engelle
    setLoading(true);
    try {
      const form = new FormData();
      form.append('conversion_id', String(conversionId));
      form.append('show_grid', String(newShowGrid));
      form.append('show_numbers', String(newShowNumbers));

      const response = await fetch(`${API_BASE_URL}/render`, {
        method: 'POST',
        body: form,
      });

      if (!response.ok) throw new Error('Render failed.');
      setImageKey(prev => prev + 1);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveToGallery() {
    if (!imageUrl) {
      Alert.alert('Error', 'No image to save.');
      return;
    }

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow media library access in your phone settings.');
        return;
      }

      const localUri = FileSystem.cacheDirectory + `pixelstitch_${Date.now()}.png`;
      const downloadResult = await FileSystem.downloadAsync(imageUrl, localUri);

      if (downloadResult.status !== 200) {
        throw new Error('Download failed.');
      }

      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      await MediaLibrary.createAlbumAsync('PixelStitch', asset, false);
      Alert.alert('Saved!', 'Pattern saved to your gallery under PixelStitch album.');
    } catch (error) {
      Alert.alert('Error', `Could not save: ${error.message}`);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>✂️ PixelStitch</Text>
      <Text style={styles.title}>Final Pattern Preview</Text>

      <View style={styles.imageBox}>
        {imageUrl ? (
          <ScrollView
            maximumZoomScale={5}
            minimumZoomScale={1}
            bouncesZoom={true}
            centerContent={true}
            contentContainerStyle={styles.scrollContent}
          >
            <Image
              key={imageKey}
              source={{ uri: imageUrl, cache: 'reload' }}
              style={styles.image}
              resizeMode="contain"
            />
          </ScrollView>
        ) : (
          <Text style={styles.placeholder}>Pattern will appear here</Text>
        )}
        {loading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Updating...</Text>
          </View>
        )}
      </View>

      <View style={styles.toggleRow}>
        <View style={styles.toggleItem}>
          <Text style={styles.toggleLabel}>Grid Lines</Text>
          <Switch
            value={showGrid}
            onValueChange={(val) => { setShowGrid(val); handleToggle(val, showNumbers); }}
            trackColor={{ true: '#90CAF9', false: '#ddd' }}
            thumbColor={showGrid ? '#4A90D9' : '#aaa'}
          />
        </View>
        <View style={styles.toggleItem}>
          <Text style={styles.toggleLabel}>Color Numbers</Text>
          <Switch
            value={showNumbers}
            onValueChange={(val) => { setShowNumbers(val); handleToggle(showGrid, val); }}
            trackColor={{ true: '#90CAF9', false: '#ddd' }}
            thumbColor={showNumbers ? '#4A90D9' : '#aaa'}
          />
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.paletteButton} onPress={() => navigation.navigate('Palette', { palette })}>
          <Text style={styles.paletteButtonText}>📋{'\n'}View{'\n'}Palette</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={saveToGallery}>
          <Text style={styles.saveButtonText}>⬇️{'\n'}Save to{'\n'}Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 24, backgroundColor: '#fff' },
  logo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  imageBox: { height: 400, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden' },
  scrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: 360, height: 360 },
  placeholder: { color: '#aaa' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 14, color: '#666' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  toggleItem: { alignItems: 'center', gap: 6 },
  toggleLabel: { fontSize: 13, color: '#444' },
  buttonRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  paletteButton: { flex: 1, backgroundColor: '#90CAF9', padding: 16, borderRadius: 16, alignItems: 'center' },
  paletteButtonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  saveButton: { flex: 1, backgroundColor: '#FF6B6B', padding: 16, borderRadius: 16, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});