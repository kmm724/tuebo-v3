import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function SettingsScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');

  const correctPin = '1234'; // You can change this later!

  const handleLogin = () => {
    if (pin === correctPin) {
      setIsAuthenticated(true);
    } else {
      Alert.alert('Incorrect PIN', 'That’s not the right code!');
    }
  };

  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <>
          <Text style={styles.title}>Parents Only 🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter PIN"
            secureTextEntry
            keyboardType="numeric"
            value={pin}
            onChangeText={setPin}
          />
          <Button title="Enter" onPress={handleLogin} />
        </>
      ) : (
        <>
          <Text style={styles.title}>Settings ⚙️</Text>
          <Text style={styles.message}>You’re in the grown-up zone!</Text>
          {/* More settings can go here later */}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    fontSize: 18,
    borderRadius: 10,
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});
