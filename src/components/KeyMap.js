import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatDate  } from "../utils/dateUtils";

export default function KeyMap({ phases }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {phases.map((phase) => (
          <View key={phase.id} style={styles.column}>
            <View style={styles.item}>
              <View
                style={[styles.colorBox, { backgroundColor: phase.color }]}
              />
              <Text style={styles.label}>
                {phase.phaseCycle} - {formatDate(phase.startDay)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  column: {
    width: "50%",
    marginBottom: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  label: {
    fontSize: 13,
    color: "#555",
    flexShrink: 1,
  },
});
