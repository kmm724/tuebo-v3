// src/screens/ParentSettings.tsx
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
import { useNavigation } from '@react-navigation/native';

const ParentSettings = () => {
  const [pin, setPin] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);
  const [blockedWord, setBlockedWord] = useState('');
  const [blockedWords, setBlockedWords] = useState<string[]>([]);
  const correctPIN = '1234';
  const navigation = useNavigation();

  useEffect(() => {
    loadBlockedWords();
  }, []);

  const loadBlockedWords = async () => {
    try {
      const stored = await AsyncStorage.getItem('blockedWords');
      if (stored) {
        setBlockedWords(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading blocked words:', err);
    }
  };

  const saveBlockedWords = async (words: string[]) => {
    try {
      await AsyncStorage.setItem('blockedWords', JSON.stringify(words));
    } catch (err) {
      console.error('Error saving blocked words:', err);
    }
  };

  const handleSubmit = () => {
    if (pin === correctPIN) {
      setAccessGranted(true);
    } else {
      Alert.alert('Incorrect PIN', 'Please try again.');
    }
    setPin('');
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('searchHistory');
      Alert.alert('History Cleared', 'The child’s search history has been erased.', [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('MainTabs', {
              screen: 'Search',
              params: { cleared: true },
            }),
        },
      ]);
    } catch (error) {
      console.error('Failed to clear history:', error);
      Alert.alert('Error', 'Failed to clear history.');
    }
  };

  const handleAddBlockedWord = () => {
    const word = blockedWord.trim().toLowerCase();
    if (word && !blockedWords.includes(word)) {
      const updated = [word, ...blockedWords];
      setBlockedWords(updated);
      saveBlockedWords(updated);
      setBlockedWord('');
    }
  };

  return (
    <View style={styles.container}>
      {!accessGranted ? (
        <>
          <Text style={styles.title}>Enter Parent PIN</Text>
          <TextInput
            style={styles.input}
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
          <Button title="Submit" onPress={handleSubmit} />
        </>
      ) : (
        <>
          <Text style={styles.title}>Parent Access Granted</Text>

          <Button title="Clear Search History" onPress={clearHistory} />

          <View style={styles.section}>
            <Text style={styles.subtitle}>Blocked Words</Text>
            <TextInput
              style={styles.input}
              value={blockedWord}
              onChangeText={setBlockedWord}
              placeholder="Enter word or phrase to block"
            />
            <Button title="Add to Block List" onPress={handleAddBlockedWord} />
            <FlatList
              data={blockedWords}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.blockedItem}>🚫 {item}</Text>
              )}
            />
          </View>

          <View style={{ height: 20 }} />
          <Button title="Back to Home" onPress={() => navigation.goBack()} />
        </>
      )}
    </View>
  );
};

export default ParentSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    fontSize: 18,
    borderRadius: 6,
  },
  section: {
    marginTop: 30,
  },
  blockedItem: {
    fontSize: 16,
    paddingVertical: 4,
  },
});
