import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../context/UserContext";
import { colors } from "../../config/colors";
import PredictionService from "../../api/predictionService";
import CycleService from "../../api/cycleService";
import CycleCircle from "../../components/CycleCircle";
import FloatingButton from "../../components/FloatingButton";
import KeyMap from "../../components/KeyMap";

export default function HomeScreen() {
  const { user } = useUser();
  const [prediction, setPrediction] = useState(null);
  const [cycle, setCycle] = useState(null);

  const fetchAllData = async () => {
    try {
      const userId = user?.id;
      if (!userId) {
        console.warn("ID de usuario no disponible.");
        return;
      }

      const predictionRes = await PredictionService.predictNextCycle(userId);
      setPrediction(predictionRes.data);

      const cycleRes = await CycleService.getCyclesByUserId(userId);
      if (Array.isArray(cycleRes.data) && cycleRes.data.length > 0) {
        const today = new Date();

        const mostRecentCycle = cycleRes.data
          .filter((c) => new Date(c.startDate) <= today)
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];

        if (mostRecentCycle) {
          setCycle(mostRecentCycle);
        } else {
          console.warn(
            "No hay ciclos que hayan comenzado antes o en la fecha actual."
          );
        }
      } else {
        console.warn("No se encontraron ciclos.");
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (!user.id || !prediction || !cycle) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <KeyMap phases={cycle.phases} />
        <CycleCircle user={user} prediction={prediction} cycle={cycle} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
});
