// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchResult {
  term: string;
  summary: string;
  imageUrl?: string;
}

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [blockedWords, setBlockedWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadBlockedWords();
    }, [])
  );

  useEffect(() => {
    if (route.params?.cleared) {
      setResults([]);
    }
  }, [route.params]);

  useEffect(() => {
    saveHistory();
  }, [results]);

  const loadHistory = async () => {
    try {
      const storedResults = await AsyncStorage.getItem('searchHistory');
      if (storedResults) {
        setResults(JSON.parse(storedResults));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const loadBlockedWords = async () => {
    try {
      const stored = await AsyncStorage.getItem('blockedWords');
      if (stored) {
        setBlockedWords(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load blocked words:', err);
    }
  };

  const saveHistory = async () => {
    try {
      await AsyncStorage.setItem('searchHistory', JSON.stringify(results));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  };

  const fetchSummary = async (term: string) => {
    const normalizedTerm = term.toLowerCase().trim();

    if (blockedWords.includes(normalizedTerm)) {
      Alert.alert('Blocked Search', 'This search is not allowed.');
      setSearchTerm('');
      return;
    }

    const alreadyExists = results.some(
      (item) => item.term.toLowerCase().trim() === normalizedTerm
    );
    if (alreadyExists) {
      setSearchTerm('');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`
      );
      const data = await response.json();

      const newResult: SearchResult = {
        term,
        summary: data.extract || 'No summary found.',
        imageUrl: data.thumbnail?.source || undefined,
      };

      setResults([newResult, ...results]);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setResults([{ term, summary: 'Something went wrong.' }, ...results]);
    } finally {
      setLoading(false);
      setSearchTerm('');
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchSummary(searchTerm);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TUEBO</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Type something to learn about..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <Button title="Search" onPress={handleSearch} />

      {loading && <ActivityIndicator size="large" color="#e91e63" style={{ marginTop: 20 }} />}

      <FlatList
        data={results}
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

      <View style={styles.spacer} />

      <Button
        title="Parent Settings"
        onPress={() => navigation.navigate('ParentSettings')}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 18,
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
  spacer: {
    height: 30,
  },
});
