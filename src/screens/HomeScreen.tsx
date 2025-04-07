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
  Modal,
  Pressable,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';

interface SearchResult {
  term: string;
  summary: string;
  imageUrl?: string;
  isFavorite?: boolean;
}

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [blockedWords, setBlockedWords] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    loadHistory();
    loadFavorites();
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

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (event) => {
      const spokenText = event.value[0];
      setSearchTerm(spokenText);
      fetchSummary(spokenText);
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

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

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  };

  const saveHistory = async () => {
    try {
      await AsyncStorage.setItem('searchHistory', JSON.stringify(results));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  };

  const saveFavorites = async (newFavorites: SearchResult[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const toggleFavorite = (item: SearchResult) => {
    const exists = favorites.find((fav) => fav.term === item.term);
    const updatedFavorites = exists
      ? favorites.filter((fav) => fav.term !== item.term)
      : [item, ...favorites];
    saveFavorites(updatedFavorites);
  };

  const fetchSummary = async (term: string) => {
    const normalizedTerm = term.toLowerCase().trim();

    if (blockedWords.includes(normalizedTerm)) {
      setSearchTerm('');
      setShowBlockedModal(true);
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
      Keyboard.dismiss();
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchSummary(searchTerm);
    }
  };

  const startListening = async () => {
    Alert.alert(
      '🎤 Voice Search Coming Soon!',
      'We’re working hard to add real voice search. Try typing your search instead!'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌟 Welcome to TUEBO! 🌟</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Type something to learn about..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Go!</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.micButton} onPress={startListening}>
        <Text style={styles.micText}>{isListening ? '🎙️ Listening...' : '🎤 Tap to Speak'}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#FFB703" style={{ marginTop: 20 }} />}

      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <View style={styles.rowBetween}>
              <Text style={styles.resultTitle}>📚 {item.term}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(item)}>
                <Text style={{ fontSize: 24 }}>{favorites.find(f => f.term === item.term) ? '🌟' : '☆'}</Text>
              </TouchableOpacity>
            </View>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.resultImage} />
            )}
            <Text style={styles.resultSummary}>{item.summary}</Text>
          </View>
        )}
      />

      <View style={styles.spacer} />

      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('ParentSettings')}>
        <Text style={styles.settingsButtonText}>👩‍👧 Parent Settings</Text>
      </TouchableOpacity>

      <Modal
        visible={showBlockedModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBlockedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🚫 Search Blocked</Text>
            <Text style={styles.modalMessage}>
              That search isn’t allowed. Try something fun like dinosaurs or space!
            </Text>
            <Pressable style={styles.modalButton} onPress={() => setShowBlockedModal(false)}>
              <Text style={styles.modalButtonText}>Okay!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFF8E1',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FB8500',
  },
  searchInput: {
    borderWidth: 2,
    borderColor: '#FFD166',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#FFB703',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  micButton: {
    alignSelf: 'center',
    backgroundColor: '#219EBC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 10,
  },
  micText: {
    color: 'white',
    fontSize: 18,
  },
  resultItem: {
    backgroundColor: '#E0F7FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#006D77',
  },
  resultSummary: {
    fontSize: 16,
    color: '#333',
  },
  resultImage: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 8,
  },
  spacer: {
    height: 30,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsButton: {
    backgroundColor: '#FFB703',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 40,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#E63946',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#FB8500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
