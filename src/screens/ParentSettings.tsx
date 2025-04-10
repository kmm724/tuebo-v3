// ParentSettings.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { saveData } from '../utils/storage';

const ParentSettings = ({ setHistory }) => {
  const navigation = useNavigation();

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete the entire search history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            saveData('history', []);
            setHistory([]);
            ToastAndroid.show('🧹 Search history cleared!', ToastAndroid.SHORT);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧩 Parent Tools</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.buttonText}>📜 View Search History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleClearHistory}>
        <Text style={styles.buttonText}>🧹 Clear Search History</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.buttonText}>🏠 Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ParentSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FB8500',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#FFB703',
    padding: 14,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
