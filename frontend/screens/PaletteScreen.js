import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

export default function PaletteScreen({ route, navigation }) {
  const { palette } = route?.params || {};

  // Build color list from palette array
  const colorList = palette
    ? palette.map((hex, index) => ({ id: String(index), number: index + 1, hex }))
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>✂️ PixelStitch</Text>
      <Text style={styles.title}>Color Palette</Text>

      <FlatList
        data={colorList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.colorRow}>
            <Text style={styles.colorNumber}>{item.number}</Text>
            <View style={[styles.colorCircle, { backgroundColor: item.hex }]} />
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
  colorNumber: { width: 24, fontSize: 14, fontWeight: 'bold', color: '#666' },
  colorCircle: { width: 36, height: 36, borderRadius: 18, marginRight: 16 },
  colorHex: { fontSize: 15, color: '#333' },
  separator: { height: 1, backgroundColor: '#f0f0f0' },
  returnButton: { backgroundColor: '#90CAF9', padding: 16, borderRadius: 30, alignItems: 'center', marginVertical: 24 },
  returnButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});