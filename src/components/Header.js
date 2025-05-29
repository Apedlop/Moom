import { StyleSheet, View, Dimensions, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../config/colors"; 

const { width, height } = Dimensions.get("window");

export default function Header({ children, screenName }) {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  return (
    <View style={styles.container}>
      <View style={styles.cloudWrapper}>
        <View style={styles.cloud}>
          <View style={styles.circleSmall} />
          <View style={styles.circleLarge} />
          <View style={styles.circleSmall} />
        </View>
        <View style={styles.centeredTextContainer}>
          <Text style={styles.cloudText}>{screenName}</Text>
        </View>
        {canGoBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Contenedor scrollable */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.goldLight,

  },
  cloudWrapper: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    width: width,
    height: height * 0.23,
    position: "relative",
  },
  cloud: {
    flexDirection: "row",
    alignItems: "center",
    transform: [{ rotate: "180deg" }],
    marginTop: -height * 0.10,
  },
  circleSmall: {
    width: width * 0.45,
    height: width * 0.50,
    borderRadius: width * 0.325,
    marginHorizontal: -width * 0.06,
    backgroundColor: "#600000",
    marginTop: height * 0.05,
  },
  circleLarge: {
    width: width * 0.55,
    height: width * 0.65,
    borderRadius: width * 0.325,
    marginHorizontal: -width * 0.06,
    backgroundColor: "#600000",
  },
  centeredTextContainer: {
    position: "absolute",
    top: "35%",
    left: 0,
    right: 0,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  cloudText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 40,
  },
});
