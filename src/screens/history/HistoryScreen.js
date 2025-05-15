import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const sampleCycles = [
  {
    id: "1",
    startDate: "2025-04-01",
    endDate: "2025-04-28",
    phases: [
      { name: "Menstruación", days: 5, color: "#FF6B6B" },
      { name: "Folicular", days: 9, color: "#FFD93D" },
      { name: "Ovulación", days: 2, color: "#6BCB77" },
      { name: "Lútea", days: 12, color: "#4D96FF" },
    ],
    menstruationDays: [
      {
        date: "2025-04-01",
        sintomas: ["Cansancio", "Dolor abdominal"],
        dolores: ["Dolor lumbar"],
        notas: "Muy cansada por la mañana.",
      },
      {
        date: "2025-04-02",
        sintomas: ["Dolor de cabeza"],
        dolores: ["Dolor lumbar", "Sensibilidad en los senos"],
        notas: "El dolor fue más fuerte después del mediodía.",
      },
      {
        date: "2025-04-03",
        sintomas: ["Cansancio"],
        dolores: [],
        notas: "",
      },
      {
        date: "2025-04-04",
        sintomas: [],
        dolores: ["Dolor abdominal"],
        notas: "Mejoró un poco.",
      },
      {
        date: "2025-04-05",
        sintomas: ["Náuseas"],
        dolores: ["Dolor lumbar"],
        notas: "Noté náuseas al despertar.",
      },
    ],
  },
  {
    id: "2",
    startDate: "2025-03-01",
    endDate: "2025-03-27",
    phases: [
      { name: "Menstruación", days: 4, color: "#FF6B6B" },
      { name: "Folicular", days: 10, color: "#FFD93D" },
      { name: "Ovulación", days: 3, color: "#6BCB77" },
      { name: "Lútea", days: 10, color: "#4D96FF" },
    ],
    menstruationDays: [
      {
        date: "2025-03-01",
        sintomas: ["Dolor lumbar"],
        dolores: ["Dolor abdominal"],
        notas: "Día fuerte de dolor.",
      },
      {
        date: "2025-03-02",
        sintomas: ["Cansancio"],
        dolores: [],
        notas: "Sentí un poco mejor.",
      },
      {
        date: "2025-03-03",
        sintomas: [],
        dolores: ["Dolor de cabeza"],
        notas: "",
      },
      {
        date: "2025-03-04",
        sintomas: ["Náuseas"],
        dolores: ["Dolor abdominal"],
        notas: "Náuseas leves.",
      },
    ],
  },
];

export default function CycleHistoryWithNestedDropdowns() {
  // Para controlar qué ciclos están desplegados
  const [expandedCycleIds, setExpandedCycleIds] = useState([]);
  // Para controlar qué días están desplegados, guardamos objetos { cicloId, diaFecha }
  const [expandedDays, setExpandedDays] = useState([]);

  const toggleCycleExpand = (id) => {
    if (expandedCycleIds.includes(id)) {
      setExpandedCycleIds(expandedCycleIds.filter((cid) => cid !== id));
      // Cuando se cierra ciclo, cerramos también sus días
      setExpandedDays(expandedDays.filter((d) => d.cycleId !== id));
    } else {
      setExpandedCycleIds([...expandedCycleIds, id]);
    }
  };

  const toggleDayExpand = (cycleId, dayDate) => {
    const key = `${cycleId}_${dayDate}`;
    if (expandedDays.some((d) => d.cycleId === cycleId && d.dayDate === dayDate)) {
      setExpandedDays(expandedDays.filter((d) => !(d.cycleId === cycleId && d.dayDate === dayDate)));
    } else {
      setExpandedDays([...expandedDays, { cycleId, dayDate }]);
    }
  };

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    // +1 para incluir ambos días
    const diffTime = endDate - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {sampleCycles.map((cycle) => {
        const totalDays = cycle.phases.reduce((sum, phase) => sum + phase.days, 0);

        return (
          <View key={cycle.id} style={styles.cycleContainer}>
            <View style={styles.header}>
              <Text style={styles.dateText}>{cycle.startDate}</Text>
              <Text style={styles.dateText}>
              Duración: {calculateDuration(cycle.startDate, cycle.endDate)} días
                </Text>
              <Text style={styles.dateText}>{cycle.endDate}</Text>
            </View>

            <View style={styles.progressBar}>
              {cycle.phases.map((phase, index) => {
                const widthPercent = (phase.days / totalDays) * 100;
                return (
                  <View
                    key={index}
                    style={[
                      styles.phaseSegment,
                      { backgroundColor: phase.color, width: `${widthPercent}%` },
                    ]}
                    accessible={true}
                    accessibilityLabel={`${phase.name}: ${phase.days} días`}
                  />
                );
              })}
            </View>

            <View style={styles.phaseLabels}>
              {cycle.phases.map((phase, index) => (
                <View key={index} style={styles.phaseLabelContainer}>
                  <View style={[styles.colorBox, { backgroundColor: phase.color }]} />
                  <Text style={styles.phaseLabelText}>
                    {phase.name} ({phase.days}d)
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => toggleCycleExpand(cycle.id)}
              style={styles.expandButton}
            >
              <Text style={styles.expandButtonText}>
                {expandedCycleIds.includes(cycle.id)
                  ? "Ocultar detalles de menstruación"
                  : "Mostrar detalles de menstruación"}
              </Text>
            </TouchableOpacity>

            {expandedCycleIds.includes(cycle.id) && (
              <View style={styles.detailsContainer}>
                {cycle.menstruationDays.map((day) => {
                  const isDayExpanded = expandedDays.some(
                    (d) => d.cycleId === cycle.id && d.dayDate === day.date
                  );
                  return (
                    <View key={day.date} style={styles.dayContainer}>
                      <TouchableOpacity
                        onPress={() => toggleDayExpand(cycle.id, day.date)}
                        style={styles.dayHeader}
                      >
                        <Text style={styles.dayTitle}>Día: {day.date}</Text>
                        <Text style={styles.expandButtonText}>
                          {isDayExpanded ? "▲" : "▼"}
                        </Text>
                      </TouchableOpacity>

                      {isDayExpanded && (
                        <View style={styles.dayDetails}>
                          <Text style={styles.subTitle}>Síntomas:</Text>
                          {day.sintomas.length > 0 ? (
                            day.sintomas.map((sintoma, i) => (
                              <Text key={i} style={styles.detailText}>• {sintoma}</Text>
                            ))
                          ) : (
                            <Text style={styles.detailText}>—</Text>
                          )}

                          <Text style={styles.subTitle}>Dolores:</Text>
                          {day.dolores.length > 0 ? (
                            day.dolores.map((dolor, i) => (
                              <Text key={i} style={styles.detailText}>• {dolor}</Text>
                            ))
                          ) : (
                            <Text style={styles.detailText}>—</Text>
                          )}

                          <Text style={styles.subTitle}>Notas:</Text>
                          <Text style={styles.detailText}>{day.notas || "—"}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  cycleContainer: {
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#fafafa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateText: {
    fontWeight: "600",
    color: "#444",
  },
  progressBar: {
    flexDirection: "row",
    height: 25,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  phaseSegment: {
    height: "100%",
  },
  phaseLabels: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  phaseLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
    width: "45%",
  },
  colorBox: {
    width: 18,
    height: 18,
    marginRight: 8,
    borderRadius: 4,
  },
  phaseLabelText: {
    fontSize: 14,
    color: "#555",
  },
  expandButton: {
    marginTop: 12,
    paddingVertical: 8,
    backgroundColor: "#600000",
    borderRadius: 6,
  },
  expandButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  detailsContainer: {
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dayContainer: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  dayTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#333",
  },
  dayDetails: {
    paddingLeft: 12,
    paddingBottom: 8,
  },
  subTitle: {
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 2,
    color: "#555",
  },
  detailText: {
    fontSize: 14,
    color: "#444",
  },
});
