import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

export default function ParentToolsScreen() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const correctPin = '1234'; // You can change this PIN as needed

  const handlePinSubmit = () => {
    if (pin === correctPin) {
      setIsAuthenticated(true);
    } else {
      Alert.alert('Incorrect PIN', 'Please try again.');
      setPin('');
    }
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
      <Text style={styles.content}>Here you can view search history, adjust filters, or block keywords (coming soon!).</Text>
      {/* Add real tools here in future updates */}
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
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 16,
    fontSize: 16,
  },
  content: {
    fontSize: 16,
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
});
