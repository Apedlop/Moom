import { Text, View } from 'react-native';
import React from 'react';

export default function InfoPhase({ selectedPhase }) {
  return (
    <View>
      <Text>{selectedPhase.name}</Text>
      <Text>{selectedPhase.description}</Text> 
    </View>
  );
}
