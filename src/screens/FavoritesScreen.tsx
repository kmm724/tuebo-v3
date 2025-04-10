import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoriteItem {
  title: string;
  snippet: string;
  link: string;
  imageUrl?: string;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await AsyncStorage.getItem('favorites');
      if (data) {
        const links: string[] = JSON.parse(data);
        const storedItems = await AsyncStorage.getItem('searchResults');
        if (storedItems) {
          const allResults: FavoriteItem[] = JSON.parse(storedItems);
          const filtered = allResults.filter((item) => links.includes(item.link));
          setFavorites(filtered);
        }
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <View style={styles.card}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : null}
      <Text style={styles.title}>{item.title}</Text>
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
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 6, color: '#333' },
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
