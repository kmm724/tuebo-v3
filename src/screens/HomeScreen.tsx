import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SearchResult = {
  title: string;
  description: string;
};

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    Keyboard.dismiss(); // 🔒 Hide the keyboard after tapping search

    try {
      // Save to search history quietly
      const existing = await AsyncStorage.getItem('searchHistory');
      const parsed = existing ? JSON.parse(existing) : [];
      const newHistory = [{ term: searchQuery }, ...parsed].slice(0, 10);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save history:', error);
    }

    // 💡 Generate fake results for now
    const fakeResults: SearchResult[] = [
      {
        title: `About ${searchQuery}`,
        description: `This is a kid-friendly summary of ${searchQuery}.`,
      },
      {
        title: `${searchQuery} Facts`,
        description: `Fun facts about ${searchQuery} you might enjoy!`,
      },
      {
        title: `Explore ${searchQuery}`,
        description: `Learn more about ${searchQuery} in a safe way.`,
      },
    ];

    setResults(fakeResults);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safe Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Search for something..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={results}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{item.title}</Text>
            <Text style={styles.resultDescription}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.placeholder}>Type a topic and tap search to begin!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  resultCard: {
    padding: 15,
    backgroundColor: '#f0f8ff',
    marginVertical: 8,
    borderRadius: 10,
  },
  resultTitle: { fontSize: 18, fontWeight: 'bold' },
  resultDescription: { fontSize: 14, marginTop: 4 },
  placeholder: { marginTop: 40, fontSize: 16, textAlign: 'center', color: '#888' },
});

export default HomeScreen;
