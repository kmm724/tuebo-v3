// src/screens/ParentSettings.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ParentSettings = () => {
  const [pin, setPin] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);
  const correctPIN = '1234';
  const navigation = useNavigation();

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
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    fontSize: 20,
  },
});
