import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

type SearchBarProps = {
  onSearch: (term: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [term, setTerm] = useState('');

  const handleSubmit = () => {
    if (term.trim() !== '') {
      onSearch(term.trim());
      setTerm('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What do you want to learn about?"
        value={term}
        onChangeText={setTerm}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        placeholderTextColor="#888"
      />
      <View style={styles.buttonWrapper}>
        <Button title="Go" onPress={handleSubmit} color="#e91e63" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  buttonWrapper: {
    alignSelf: 'flex-end',
    width: 100,
  },
});
