import { Text, View, StyleSheet } from 'react-native';
import React from 'react';

export default function InfoPhase({ selectedPhase }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedPhase.name}</Text>
      <Text style={styles.description}>{selectedPhase.description}</Text> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: "justify",
  },
});