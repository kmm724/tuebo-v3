import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Keyboard, Linking, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = 'AIzaSyB84VMq1SlOqk2Ul3hL8jjtXW5nR54cRXo';
const SEARCH_ENGINE_ID = 'f73c36ac849f74759';

type SearchResult = {
  title: string;
  snippet: string;
  link: string;
};

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    Keyboard.dismiss();

    try {
      const existing = await AsyncStorage.getItem('searchHistory');
      const parsed = existing ? JSON.parse(existing) : [];
      const newHistory = [{ term: searchQuery }, ...parsed].slice(0, 10);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save history:', error);
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      const items: SearchResult[] = (data.items || []).map((item: any) => ({
        title: item.title,
        snippet: item.snippet,
        link: item.link,
      }));

      setResults(items);
    } catch (error) {
      console.error('Failed to fetch search results:', error);
    }

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
            <View style={styles.resultHeader}>
              <Ionicons name="search" size={20} color="#555" style={styles.icon} />
              <Text style={styles.resultTitle}>{item.title}</Text>
            </View>
            <Text style={styles.resultDescription}>{item.snippet}</Text>
            <Pressable
              onPress={() => Linking.openURL(item.link)}
              android_ripple={{ color: '#d0e6ff' }}
              style={({ pressed }) => [
                styles.resultLink,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.resultLinkText}>Open Link</Text>
            </Pressable>
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
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
  },
  resultTitle: { fontSize: 18, fontWeight: 'bold', flexShrink: 1 },
  resultDescription: { fontSize: 14, marginTop: 4 },
  resultLink: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#cce5ff',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  resultLinkText: {
    fontSize: 14,
    color: '#004080',
    fontWeight: 'bold',
  },
  placeholder: { marginTop: 40, fontSize: 16, textAlign: 'center', color: '#888' },
});

export default HomeScreen;
