// src/screens/ParentSettings.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ParentSettings = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👩‍👧 Parent Access Granted</Text>
      <Text style={styles.message}>
        Here you’ll be able to manage blocked words, monitor search history, and more.
      </Text>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>⬅️ Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ParentSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#FFF8E1',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FB8500',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#444',
  },
  backButton: {
    backgroundColor: '#219EBC',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
