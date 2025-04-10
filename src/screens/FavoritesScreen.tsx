// FavoritesScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { loadData, saveData } from '../utils/storage';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      loadData('favorites', []).then(setFavorites);
    }
  }, [isFocused]);

  const handleRemove = (term) => {
    const updated = favorites.filter((item) => item.term !== term);
    setFavorites(updated);
    saveData('favorites', updated);
    ToastAndroid.show(`❌ Removed ${term} from favorites`, ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⭐ Your Favorite Topics</Text>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../../assets/mascot-search.png')}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>Your favorites list is empty. Tap a ⭐ to add topics!</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.term}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
              <Text style={styles.title}>{item.term}</Text>
              <Text style={styles.summary}>{item.summary}</Text>
              <Button title="❌ Remove" color="#d9534f" onPress={() => handleRemove(item.term)} />
            </View>
          )}
        />
      )}
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Search')}>
        <Text style={styles.homeButtonText}>🏠 Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FB8500',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFECB3',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  summary: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  homeButton: {
    marginTop: 20,
    backgroundColor: '#FFB703',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
