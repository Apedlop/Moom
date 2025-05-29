import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function FloatingButton({ pageScreen, children, params = {} }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(pageScreen, params); 
  };

  return (
    <View style={styles.floatingContainer}>
      <TouchableOpacity style={styles.floatingButton} onPress={handlePress}>
        <Text style={styles.buttonText}>{children}</Text> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 9999, // Asegura que esté por encima de todo.
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#600000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10, // Sombra en Android (aumenta el valor si es necesario).
    shadowColor: "#000", // Sombra en iOS.
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  buttonText: {
    color: "white",
  },
});
