// src/screens/ParentSettings.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ParentSettings = () => {
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (!route?.params?.fromPIN) {
      navigation.navigate('Settings');
    }
  }, [route]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👩‍👧 Parent Tools</Text>

      <TouchableOpacity
        style={styles.toolButton}
        onPress={() => navigation.navigate('HistoryScreen')}
      >
        <Text style={styles.toolButtonText}>🕵️ View Search History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.toolButton, styles.disabledButton]}
        onPress={() => {}}
      >
        <Text style={styles.toolButtonText}>🚫 Manage Blocked Words (coming soon)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.toolButton}
        onPress={() => navigation.navigate('MainTabs')}
      >
        <Text style={styles.toolButtonText}>⬅️ Return to Home</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#FB8500',
  },
  toolButton: {
    backgroundColor: '#FFB703',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  toolButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
