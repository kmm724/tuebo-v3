// This will be the updated HomeScreen with video section
// Let's start implementing the new file based on your current app foundation

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Keyboard,
  Linking,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = 'AIzaSyB84VMq1SlOqk2Ul3hL8jjtXW5nR54cRXo';
const SEARCH_ENGINE_ID = 'f73c36ac849f74759';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [videos, setVideos] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const stored = await AsyncStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
  };

  const saveFavorites = async (updated) => {
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    setFavorites(updated);
  };

  const toggleFavorite = async (link) => {
    const isAlready = favorites.includes(link);
    const updated = isAlready ? favorites.filter((f) => f !== link) : [...favorites, link];
    await saveFavorites(updated);

    const raw = await AsyncStorage.getItem('favoriteDetails');
    const favDetails = raw ? JSON.parse(raw) : [];

    if (isAlready) {
      const filtered = favDetails.filter((item) => item.link !== link);
      await AsyncStorage.setItem('favoriteDetails', JSON.stringify(filtered));
    } else {
      const itemToAdd = results.find((r) => r.link === link);
      if (itemToAdd) {
        const combined = [itemToAdd, ...favDetails].filter(
          (item, i, self) => i === self.findIndex((x) => x.link === item.link)
        );
        await AsyncStorage.setItem('favoriteDetails', JSON.stringify(combined));
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    Keyboard.dismiss();

    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      const standard = (data.items || []).filter(item => !item.pagemap?.videoobject);
      setResults(standard.map(item => ({
        title: item.title,
        snippet: item.snippet,
        link: item.link,
        imageUrl: item.pagemap?.cse_image?.[0]?.src || '',
      })));

      // Fetch YouTube videos separately
      const ytRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=5&key=${API_KEY}`
      );
      const ytData = await ytRes.json();
     console.log('🎥 YouTube API response:', ytData);
      const ytVideos = ytData.items?.map((item) => ({
        title: item.snippet.title,
        link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails?.high?.url || '',
      })) || [];

      setVideos(ytVideos);
    } catch (err) {
      console.error('Search error', err);
    }

    setSearchQuery('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔍 Tuebo Safe Search</Text>
      <TextInput
        style={styles.input}
        placeholder="What do you want to learn about?"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Go Explore!" onPress={handleSearch} color="#5cb85c" />

     {results.length === 0 ? (
  <Text style={styles.placeholder}>Try searching something fun!</Text>
) : (
  results.map((item) => (
    <View key={item.link} style={styles.card}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : null}
      <View style={styles.cardHeader}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(item.link)}>
          <Ionicons
            name={favorites.includes(item.link) ? 'heart' : 'heart-outline'}
            size={22}
            color={favorites.includes(item.link) ? '#e63946' : '#555'}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.resultDescription}>{item.snippet}</Text>
      <Pressable
        onPress={() => Linking.openURL(item.link)}
        style={styles.resultLink}
      >
        <Text style={styles.resultLinkText}>Open Link</Text>
      </Pressable>
    </View>
  ))
)}
      {videos.length > 0 && (
        <View style={styles.videoSection}>
          <Text style={styles.videoHeader}>🎥 Videos to Watch</Text>
          {videos.map((video, index) => (
            <View key={index} style={styles.videoCard}>
              {video.thumbnail ? (
                <Image source={{ uri: video.thumbnail }} style={styles.videoThumb} />
              ) : null}
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Pressable onPress={() => Linking.openURL(video.link)} style={styles.resultLink}>
                <Text style={styles.resultLinkText}>Watch Now</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#e8f4ff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#007acc' },
  input: {
    borderColor: '#007acc',
    borderWidth: 1.5,
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  card: {
    padding: 15,
    backgroundColor: '#ffffff',
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cce6ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultTitle: { fontSize: 18, fontWeight: '600', flexShrink: 1, color: '#333' },
  resultDescription: { fontSize: 14, marginTop: 4, color: '#555' },
  resultLink: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#d0f0ff',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  resultLinkText: { fontSize: 14, color: '#005b99', fontWeight: 'bold' },
  placeholder: { marginTop: 40, fontSize: 16, textAlign: 'center', color: '#888' },
  videoSection: { marginTop: 20 },
  videoHeader: { fontSize: 22, fontWeight: 'bold', color: '#007acc', marginBottom: 10 },
  videoCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#cce6ff',
  },
  videoThumb: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
});
