// src/screens/HistoryScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const HistoryScreen = () => {
  const [history, setHistory] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const clearHistory = async () => {
    Alert.alert('Clear All?', 'Do you want to delete your entire search history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('history');
          setHistory([]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Your Search History</Text>
      {history.length === 0 ? (
        <Text style={styles.emptyText}>💤 Nothing here yet!</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyText}>🔎 {item}</Text>
            </View>
          )}
        />
      )}
      {history.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearButtonText}>🗑 Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFF8E1',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FB8500',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
  },
  historyItem: {
    backgroundColor: '#E0F7FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyText: {
    fontSize: 18,
    color: '#006D77',
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: '#FFB703',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});
