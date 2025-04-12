import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  Keyboard,
  Linking,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'AIzaSyB84VMq1SlOqk2Ul3hL8jjtXW5nR54cRXo'; // Replace with your real key

export default function VideoSearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    Keyboard.dismiss();

    try {
      // Save search term to history
      const existing = await AsyncStorage.getItem('searchHistory');
      const parsed = existing ? JSON.parse(existing) : [];
      const newHistory = [{ term: searchQuery }, ...parsed].slice(0, 10);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }

    try {
      const ytRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          searchQuery
        )}&type=video&maxResults=6&key=${API_KEY}`
      );
      const ytData = await ytRes.json();

      if (!Array.isArray(ytData.items)) {
        console.warn('Unexpected API response:', ytData);
        setVideos([]);
        return;
      }

      const ytVideos = ytData.items.map((item) => {
        const videoId = item.id?.videoId;
        const title = item.snippet?.title;
        const thumbnail = item.snippet?.thumbnails?.high?.url;

        if (videoId && title && thumbnail) {
          return {
            title,
            link: `https://www.youtube.com/watch?v=${videoId}`,
            thumbnail,
          };
        } else {
          return null;
        }
      }).filter(Boolean);

      setVideos(ytVideos);
    } catch (err) {
      console.error('Video search error', err);
      setVideos([]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🎥 Video Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Search videos..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search Videos" onPress={handleSearch} color="#ff6f61" />

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#e63946' },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  videoCard: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#d0e7ff',
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
  resultLink: {
    backgroundColor: '#d0f0ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  resultLinkText: {
    fontSize: 14,
    color: '#005b99',
    fontWeight: 'bold',
  },
});
