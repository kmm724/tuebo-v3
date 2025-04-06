// src/screens/FavoritesScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchResult {
  term: string;
  summary: string;
  imageUrl?: string;
}

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('favorites');
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorites ❤️</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#e91e63" />
      ) : favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorites yet. Tap the 🤍 to save something!</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultTitle}>🔎 {item.term}</Text>
              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.resultImage} />
              )}
              <Text style={styles.resultSummary}>{item.summary}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 20,
  },
  resultItem: {
    backgroundColor: '#fefefe',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultSummary: {
    fontSize: 16,
  },
  resultImage: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    borderRadius: 6,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});
