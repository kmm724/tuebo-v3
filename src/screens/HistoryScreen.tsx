import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

type HistoryScreenProps = {
  history: string[];
};

export default function HistoryScreen({ history }: HistoryScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search History 🕘</Text>

      {history.length === 0 ? (
        <Text style={styles.empty}>You haven't searched anything yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.term}>• {item}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  empty: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
  },
  item: {
    paddingVertical: 8,
  },
  term: {
    fontSize: 16,
  },
});
