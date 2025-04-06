import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

type FavoriteItem = {
  term: string;
  summary: string;
  imageUrl: string | null;
};

type FavoritesScreenProps = {
  favorites: FavoriteItem[];
};

export default function FavoritesScreen({ favorites }: FavoritesScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorites ❤️</Text>

      {favorites.length === 0 ? (
        <Text style={styles.empty}>No favorites saved yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.term}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              )}
              <Text style={styles.term}>{item.term}</Text>
              <Text style={styles.summary}>{item.summary}</Text>
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
  card: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 10,
  },
  term: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summary: {
    fontSize: 14,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
});
