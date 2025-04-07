// src/screens/FavoritesScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface SearchResult {
  term: string;
  summary: string;
  imageUrl?: string;
}

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<SearchResult[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const removeFavorite = async (term: string) => {
    const updated = favorites.filter((item) => item.term !== term);
    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  const renderItem = ({ item }: { item: SearchResult }) => (
    <View style={styles.resultItem}>
      <View style={styles.rowBetween}>
        <Text style={styles.resultTitle}>⭐ {item.term}</Text>
        <TouchableOpacity onPress={() => removeFavorite(item.term)}>
          <Text style={styles.removeText}>❌</Text>
        </TouchableOpacity>
      </View>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.resultImage} />}
      <Text style={styles.resultSummary}>{item.summary}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorite Topics</Text>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>💤 You haven’t added any favorites yet!</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  resultItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeText: {
    fontSize: 20,
    color: 'red',
  },
});
