import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ParentToolsScreen() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [history, setHistory] = useState([]);
  const correctPin = '1234'; // You can change this PIN as needed

  const handlePinSubmit = () => {
    if (pin === correctPin) {
      setIsAuthenticated(true);
      loadSearchHistory();
    } else {
      Alert.alert('Incorrect PIN', 'Please try again.');
      setPin('');
    }
  };

  const loadSearchHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('searchHistory');
      if (data) {
        const parsed = JSON.parse(data);
        const termsOnly = parsed.map((item) => item.term);
        setHistory(termsOnly);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPin('');
    setHistory([]);
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>🔒 Enter Parent PIN</Text>
        <TextInput
          style={styles.input}
          value={pin}
          onChangeText={setPin}
          placeholder="Enter PIN"
          keyboardType="numeric"
          secureTextEntry
        />
        <Button title="Unlock" onPress={handlePinSubmit} color="#f77f00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👨‍👩‍👧 Parent Tools</Text>
      <Text style={styles.subHeader}>📜 Search History</Text>
      {history.length === 0 ? (
        <Text style={styles.empty}>No search history available.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyText}>🔎 {item}</Text>
            </View>
          )}
        />
      )}
      <View style={styles.logoutButtonWrapper}>
        <Button title="🔒 Log Out" onPress={handleLogout} color="#e63946" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff3e6',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#f77f00',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 16,
    fontSize: 16,
  },
  historyItem: {
    backgroundColor: '#ffe5b4',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  historyText: {
    fontSize: 16,
    color: '#333',
  },
  empty: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
  logoutButtonWrapper: {
    marginTop: 20,
  },
});
