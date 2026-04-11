import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const MOCK_COLORS = [
  { id: '1', name: 'Coral Dream', hex: '#FF6D64' },
  { id: '2', name: 'Light Aqua', hex: '#9FD7E9' },
  { id: '3', name: 'Cat Ear Peach', hex: '#F7D8D8' },
  { id: '4', name: 'Soft Feline Teal', hex: '#00B4B4' },
  { id: '5', name: 'Cat Green', hex: '#DAB736' },
];

export default function PaletteScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>✂️ PixelStitch</Text>
      <Text style={styles.title}>Color Palette</Text>

      <FlatList
        data={MOCK_COLORS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.colorRow}>
            <View style={[styles.colorCircle, { backgroundColor: item.hex }]} />
            <Text style={styles.colorName}>{item.name}</Text>
            <Text style={styles.colorHex}>{item.hex}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <TouchableOpacity style={styles.returnButton} onPress={() => navigation.goBack()}>
        <Text style={styles.returnButtonText}>Return to Pattern Preview</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 24, backgroundColor: '#fff' },
  logo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  colorRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  colorCircle: { width: 36, height: 36, borderRadius: 18, marginRight: 16 },
  colorName: { flex: 1, fontSize: 15 },
  colorHex: { fontSize: 15, color: '#666' },
  separator: { height: 1, backgroundColor: '#f0f0f0' },
  returnButton: { backgroundColor: '#90CAF9', padding: 16, borderRadius: 30, alignItems: 'center', marginVertical: 24 },
  returnButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});