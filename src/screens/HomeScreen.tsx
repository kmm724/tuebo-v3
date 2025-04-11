import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  Keyboard,
  Linking,
  Pressable,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = 'AIzaSyB84VMq1SlOqk2Ul3hL8jjtXW5nR54cRXo';
const SEARCH_ENGINE_ID = 'f73c36ac849f74759';

type SearchResult = {
  title: string;
  snippet: string;
  link: string;
  imageUrl?: string;
};

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const saveFavorites = async (newFavs: string[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const toggleFavorite = async (link: string) => {
  try {
    const isAlreadyFavorite = favorites.includes(link);
    const updated = isAlreadyFavorite
      ? favorites.filter(fav => fav !== link)
      : [...favorites, link];

    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    setFavorites(updated);

    const favDetailsRaw = await AsyncStorage.getItem('favoriteDetails');
    const favDetails = favDetailsRaw ? JSON.parse(favDetailsRaw) : [];

    if (isAlreadyFavorite) {
      // Remove it from favoriteDetails
      const filtered = favDetails.filter((item: SearchResult) => item.link !== link);
      await AsyncStorage.setItem('favoriteDetails', JSON.stringify(filtered));
    } else {
      // Add the full result to favoriteDetails
      const itemToAdd = results.find(r => r.link === link);
      if (itemToAdd) {
        const combined = [itemToAdd, ...favDetails].filter(
          (item, index, self) => index === self.findIndex(i => i.link === item.link)
        );
        await AsyncStorage.setItem('favoriteDetails', JSON.stringify(combined));
      }
    }
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
  }
};

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
        imageUrl: item.pagemap?.cse_image?.[0]?.src || '',
      }));

      setResults(items);
      // Merge with previous search results
      const existingResultsRaw = await AsyncStorage.getItem('searchResults');
      const existingResults: SearchResult[] = existingResultsRaw ? JSON.parse(existingResultsRaw) : [];

      // Combine and deduplicate by link
      const combinedResults = [...items, ...existingResults].filter(
        (item, index, self) => index === self.findIndex(i => i.link === item.link)
      ).slice(0, 50); // Keep only the latest 50

      await AsyncStorage.setItem('searchResults', JSON.stringify(combinedResults));
      await loadFavorites();
    } catch (error) {
      console.error('Failed to fetch search results:', error);
    }

    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Tuebo Safe Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Type something curious..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Go Explore!" onPress={handleSearch} color="#5cb85c" />
      <FlatList
        data={results}
        keyExtractor={(item) => item.link}
        renderItem={({ item }) => (
          <View style={styles.resultCard}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.resultImage} resizeMode="cover" />
            ) : null}
            <View style={styles.resultHeader}>
              <Ionicons name="search" size={22} color="#007aff" style={styles.icon} />
              <Text style={styles.resultTitle}>{item.title}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(item.link)}>
                <Ionicons
                  name={favorites.includes(item.link) ? 'heart' : 'heart-outline'}
                  size={favorites.includes(item.link) ? 26 : 22}
                  color={favorites.includes(item.link) ? '#e63946' : '#555'}
                  style={styles.heartIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.resultDescription}>{item.snippet}</Text>
            <Pressable
              onPress={() => Linking.openURL(item.link)}
              android_ripple={{ color: '#c0f0ff' }}
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
          <Text style={styles.placeholder}>Type a fun topic and tap Go Explore!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e8f4ff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#007acc' },
  input: {
    borderColor: '#007acc',
    borderWidth: 1.5,
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  resultCard: {
    padding: 15,
    backgroundColor: '#ffffff',
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cce6ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
  },
  heartIcon: {
    marginLeft: 'auto',
  },
  resultTitle: { fontSize: 18, fontWeight: '600', flexShrink: 1, color: '#333' },
  resultDescription: { fontSize: 14, marginTop: 4, color: '#555' },
  resultLink: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#d0f0ff',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  resultLinkText: {
    fontSize: 14,
    color: '#005b99',
    fontWeight: 'bold',
  },
  placeholder: { marginTop: 40, fontSize: 16, textAlign: 'center', color: '#888' },
});

export default HomeScreen;
