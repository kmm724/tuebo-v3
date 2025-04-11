import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface FavoriteItem {
  title: string;
  snippet: string;
  link: string;
  imageUrl?: string;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadFavorites();
    }
  }, [isFocused]);

  const loadFavorites = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('favoriteDetails');
      if (storedItems) {
        const allResults: FavoriteItem[] = JSON.parse(storedItems);
        setFavorites(allResults);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const toggleFavorite = async (link: string) => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      const current: string[] = stored ? JSON.parse(stored) : [];
      const updated = current.includes(link)
        ? current.filter((fav) => fav !== link)
        : [...current, link];
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));

      const storedDetails = await AsyncStorage.getItem('favoriteDetails');
      let currentDetails: FavoriteItem[] = storedDetails ? JSON.parse(storedDetails) : [];

      if (current.includes(link)) {
        currentDetails = currentDetails.filter(item => item.link !== link);
      }

      await AsyncStorage.setItem('favoriteDetails', JSON.stringify(currentDetails));
      loadFavorites();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <View style={styles.card}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : null}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(item.link)}>
          <Ionicons name="heart" size={24} color="#e63946" />
        </TouchableOpacity>
      </View>
      <Text style={styles.snippet}>{item.snippet}</Text>
      <Pressable
        onPress={() => Linking.openURL(item.link)}
        style={({ pressed }) => [
          styles.linkButton,
          pressed && { opacity: 0.6 },
        ]}
      >
        <Text style={styles.linkText}>Open Link</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⭐ Your Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.link}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No favorites yet!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f2faff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#007acc' },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: '#cce6ff',
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: 'bold', flex: 1, marginRight: 10, color: '#333' },
  snippet: { fontSize: 14, color: '#555', marginBottom: 8 },
  linkButton: {
    backgroundColor: '#d0f0ff',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  linkText: { color: '#007acc', fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 16 },
});
