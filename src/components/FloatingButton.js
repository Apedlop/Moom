import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function FloatingButton({ pageScreen, icon }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(pageScreen); // Navegar a la pantalla pasada como prop
  };

  return (
    <View style={styles.floatingContainer}>
      <TouchableOpacity style={styles.floatingButton} onPress={handlePress}>
        <Text style={styles.buttonText}>{icon}</Text> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#600000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 100,
  },
  buttonText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
});
