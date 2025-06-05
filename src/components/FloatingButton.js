import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function FloatingButton({ pageScreen, children, params = {} }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(pageScreen, params);
  };

  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#600000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    zIndex: 9999,
  },
});
