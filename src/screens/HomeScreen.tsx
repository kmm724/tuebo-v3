import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button,
  Alert,
} from 'react-native';
import axios from 'axios';
import SearchBar from '../components/SearchBar';

type HomeScreenProps = {
  favorites: { term: string; summary: string; imageUrl: string | null }[];
  setFavorites: React.Dispatch<
    React.SetStateAction<
      { term: string; summary: string; imageUrl: string | null }[]
    >
  >;
  history: string[];
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
};

type SearchResultItem = {
  title: string;
  snippet: string;
  pageid: number;
};

export default function HomeScreen({
  favorites,
  setFavorites,
  history,
  setHistory,
}: HomeScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setError('');
    setLoading(true);
    setResults([]);

    try {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&format=json&srsearch=${encodeURIComponent(
          term
        )}`
      );

      const searchResults = response.data.query.search;

      const formattedResults = searchResults.map((item: any) => ({
        title: item.title,
        snippet: item.snippet.replace(/<[^>]+>/g, ''),
        pageid: item.pageid,
      }));

      setResults(formattedResults);

      if (formattedResults.length > 0) {
        console.log('📚 Adding to history:', term);
        setHistory((prev) => [...prev, term]);
      }
    } catch (err) {
      setError('Something went wrong. Try another word!');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToFavorites = (item: SearchResultItem) => {
    const alreadyExists = favorites.some(
      (fav) => fav.term.toLowerCase() === item.title.toLowerCase()
    );

    if (alreadyExists) {
      Alert.alert('Already Saved', `"${item.title}" is already in your favorites.`);
      return;
    }

    const newFavorite = {
      term: item.title,
      summary: item.snippet,
      imageUrl: null,
    };

    setFavorites((prev) => [...prev, newFavorite]);
    Alert.alert('Saved!', `"${item.title}" has been added to your favorites.`);
  };

  const renderItem = ({ item }: { item: SearchResultItem }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.snippet}>{item.snippet}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Save to Favorites ❤️" onPress={() => handleSaveToFavorites(item)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />
      <Text style={styles.header}>Welcome to TUEBO! 🚀</Text>

      {loading && <ActivityIndicator size="large" color="#888" style={{ marginTop: 20 }} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={results}
        keyExtractor={(item) => item.pageid.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#f9faff',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  snippet: {
    fontSize: 15,
    color: '#555',
    lineHeight: 20,
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 12,
  },
});
