// HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { saveData, loadData } from '../utils/storage';

const HomeScreen = ({ favorites, setFavorites, history, setHistory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Load history from storage on focus
  useEffect(() => {
    if (isFocused) {
      setResults([]);
      loadData('history', []).then(setHistory);
    }
  }, [isFocused]);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;
    Keyboard.dismiss();

    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      const resultItem = {
        term: searchTerm,
        summary: data.extract || `No summary found for ${searchTerm}`,
        imageUrl: data.thumbnail?.source || null,
      };
      setResults([resultItem]);
      const updatedHistory = [searchTerm, ...history];
      setHistory(updatedHistory);
      saveData('history', updatedHistory);
    } catch (error) {
      setResults([{ term: searchTerm, summary: `Failed to fetch results. Please try again.`, imageUrl: null }]);
    }
  };

  const handleFavorite = (item) => {
    console.log('⭐ Attempting to favorite:', item);
    if (!favorites.some((fav) => fav.term === item.term)) {
      const updatedFavorites = [...favorites, item];
      setFavorites(updatedFavorites);
      saveData('favorites', updatedFavorites);
      console.log('✅ Favorite added and saved:', item);
    } else {
      console.log('⚠️ Already favorited:', item.term);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 What do you want to learn about?</Text>

      <TextInput
        placeholder="Type a topic..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.input}
      />

      <Button title="Search" onPress={handleSearch} />

      <FlatList
        data={results}
        keyExtractor={(item) => item.term}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
            <Text style={styles.resultText}>{item.summary}</Text>
            <Button title="⭐ Favorite" onPress={() => handleFavorite(item)} />
          </View>
        )}
        style={{ marginTop: 20 }}
      />

      <TouchableOpacity
        style={styles.videoButton}
        onPress={() => navigation.navigate('VideoExplorer')}
      >
        <Text style={styles.videoButtonText}>🎥 Watch Videos</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8E1',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FB8500',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  resultItem: {
    backgroundColor: '#FFECB3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 6,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 8,
  },
  videoButton: {
    backgroundColor: '#FFB703',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  videoButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
