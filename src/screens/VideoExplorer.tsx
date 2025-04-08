// src/screens/VideoExplorer.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const videoList = [
  {
    id: '1',
    title: 'Learn About Sharks!',
    thumbnail: 'https://img.youtube.com/vi/Q5F-KFqW9f8/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Q5F-KFqW9f8',
  },
  {
    id: '2',
    title: 'Space Facts for Kids 🚀',
    thumbnail: 'https://img.youtube.com/vi/k-73nFI0yWc/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=k-73nFI0yWc',
  },
  {
    id: '3',
    title: 'Dinosaurs Roar! 🦕',
    thumbnail: 'https://img.youtube.com/vi/w0ZtV2FTO44/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=w0ZtV2FTO44',
  },
];

const VideoExplorer = () => {
  const navigation = useNavigation();

  const openVideo = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎬 Explore Videos!</Text>
      <FlatList
        data={videoList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openVideo(item.url)}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>⬅️ Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VideoExplorer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8E1',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FB8500',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFECB3',
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#FFB703',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
