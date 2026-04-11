import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function PreviewScreen({ route, navigation }) {
  const { imageUri } = route?.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>✂️ PixelStitch</Text>
      <Text style={styles.title}>Final Pattern Preview</Text>

      <View style={styles.imageBox}>
        {imageUri
          ? <Image source={{ uri: imageUri }} style={styles.image} />
          : <Text style={styles.placeholder}>Şablon burada görünecek</Text>
        }
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.paletteButton} onPress={() => navigation.navigate('Palette')}>
          <Text style={styles.paletteButtonText}>📋{'\n'}View{'\n'}Palette</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={() => {}}>
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
  imageBox: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  placeholder: { color: '#aaa' },
  buttonRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  paletteButton: { flex: 1, backgroundColor: '#90CAF9', padding: 16, borderRadius: 16, alignItems: 'center' },
  paletteButtonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  saveButton: { flex: 1, backgroundColor: '#FF6B6B', padding: 16, borderRadius: 16, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});