// HistoryScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { loadData } from '../utils/storage';

const HistoryScreen = ({ history: initialHistory }) => {
  const [history, setHistory] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      loadData('history', []).then(setHistory);
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🕘 Search History</Text>
      {history.length === 0 ? (
        <Text style={styles.emptyText}>No search history found.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.itemBox}>
              <Text style={styles.itemText}>🔎 {item}</Text>
            </View>
          )}
        />
      )}
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.homeButtonText}>🔙 Back to Parent Tools</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FB8500',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  itemBox: {
    backgroundColor: '#FFECB3',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  homeButton: {
    marginTop: 20,
    backgroundColor: '#FFB703',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
