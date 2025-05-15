import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import CycleCircle from "../../components/CycleCircle";
import FloatingButton from "../../components/FloatingButton";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <CycleCircle />
      </ScrollView>
      <FloatingButton pageScreen={"MenstrualForm"} icon={"+"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
});
