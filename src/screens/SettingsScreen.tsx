// src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const [pin, setPin] = useState('');
  const navigation = useNavigation();

  const handleAccess = () => {
    if (pin === '1234') {
      navigation.navigate('ParentSettings', { fromPIN: true });
    } else {
      Alert.alert('Access Denied', 'The PIN you entered is incorrect.');
    }
    setPin('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔒 Enter Parent PIN</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter PIN"
        secureTextEntry
        keyboardType="number-pad"
        value={pin}
        onChangeText={setPin}
      />
      <Button title="Submit" onPress={handleAccess} color="#FB8500" />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#FFF8E1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FB8500',
  },
  input: {
    borderWidth: 2,
    borderColor: '#FFD166',
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
});
