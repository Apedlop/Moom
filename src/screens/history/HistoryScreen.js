import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import CycleService from "../../api/cycleService";
import SymptomService from "../../api/symptomService";
import { useUser } from "../../context/UserContext";
import { useFocusEffect } from "@react-navigation/native";
import { formatDate } from "../../utils/dateUtils";

export default function HistoryScreen() {
  const { user } = useUser();
  const userId = user.id;

  const [expandedCycleIds, setExpandedCycleIds] = useState([]);
  const [expandedDays, setExpandedDays] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // En la función fetchData, modifica esta parte:
  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      const cyclesResponse = await CycleService.getAllCycles();
      const userCycles = cyclesResponse.data
        .filter((cycle) => cycle.userId === userId)
        // Ordenar por fecha de inicio (más reciente primero)
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

      setCycles(userCycles);

      const symptomsResponse = await SymptomService.getAllSymptoms();
      const userSymptoms = symptomsResponse.data.filter(
        (symptom) => symptom.userId === userId
      );
      setSymptoms(userSymptoms);

      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setRefreshing(false);
    }
  }, [userId]);

  // Actualizar al montar el componente
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Actualizar cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = () => {
    fetchData();
  };

  const calculateDurationPhases = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const toggleCycleExpand = (id) => {
    setExpandedCycleIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const toggleDayExpand = (cycleId, dayDate) => {
    setExpandedDays((prev) =>
      prev.some((d) => d.cycleId === cycleId && d.dayDate === dayDate)
        ? prev.filter((d) => !(d.cycleId === cycleId && d.dayDate === dayDate))
        : [...prev, { cycleId, dayDate }]
    );
  };

  const calculateCycleEndDate = (startDateStr, cycleLength) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + cycleLength - 1);
    return endDate.toISOString().split("T")[0];
  };

  const generateDaysWithSymptoms = (cycle) => {
    const cycleSymptoms = symptoms.filter((s) => s.cycleId === cycle.id);

    const dateMap = {};

    cycleSymptoms.forEach((symptom) => {
      const dateStr = new Date(symptom.date).toISOString().split("T")[0];
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = [];
      }
      dateMap[dateStr].push(symptom);
    });

    const days = Object.keys(dateMap).map((dateStr) => {
      const daySymptoms = dateMap[dateStr];

      return {
        date: dateStr,
        symptoms: daySymptoms.flatMap((s) =>
          Array.isArray(s.typePeriod) ? s.typePeriod : []
        ),
        pains: daySymptoms.flatMap((s) =>
          Array.isArray(s.typePain) ? s.typePain : []
        ),
        emotions: daySymptoms.flatMap((s) =>
          Array.isArray(s.typeEmotion) ? s.typeEmotion : []
        ),
        notes: daySymptoms[0]?.notes || "",
      };
    });

    days.sort((a, b) => new Date(a.date) - new Date(b.date));

    return days;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#600000"]}
          tintColor="#600000"
        />
      }
    >
      {cycles.map((cycle) => {
        const daysWithSymptoms = generateDaysWithSymptoms(cycle);
        const totalDays = cycle.cycleLength;

        return (
          <View key={cycle.id} style={styles.cycleContainer}>
            <View style={styles.header}>
              <Text style={styles.dateText}>{formatDate(cycle.startDate)}</Text>
              <Text style={styles.dateText}>Duración: {totalDays} días</Text>
              <Text style={styles.dateText}>
                {formatDate(calculateCycleEndDate(cycle.startDate, cycle.cycleLength))}
              </Text>
            </View>

            <View style={styles.progressBar}>
              {cycle.phases.map((phase, index) => {
                const phaseDays = calculateDurationPhases(
                  phase.startDay,
                  phase.endDay
                );
                const widthPercent = (phaseDays / totalDays) * 100;
                return (
                  <View
                    key={index}
                    style={[
                      styles.phaseSegment,
                      {
                        backgroundColor: phase.color,
                        width: `${widthPercent}%`,
                      },
                    ]}
                  />
                );
              })}
            </View>

            <View style={styles.phaseLabels}>
              {cycle.phases.map((phase, index) => {
                const phaseDays = calculateDurationPhases(
                  phase.startDay,
                  phase.endDay
                );
                return (
                  <View key={index} style={styles.phaseLabelContainer}>
                    <View
                      style={[
                        styles.colorBox,
                        { backgroundColor: phase.color },
                      ]}
                    />
                    <Text style={styles.phaseLabelText}>
                      {phase.phaseCycle} ({phaseDays}d)
                    </Text>
                  </View>
                );
              })}
            </View>

            {daysWithSymptoms.length > 0 && (
              <>
                <TouchableOpacity
                  onPress={() => toggleCycleExpand(cycle.id)}
                  style={styles.expandButton}
                >
                  <Text style={styles.expandButtonText}>
                    {expandedCycleIds.includes(cycle.id)
                      ? "Ocultar días con síntomas"
                      : `Mostrar días con síntomas (${daysWithSymptoms.length})`}
                  </Text>
                </TouchableOpacity>

                {expandedCycleIds.includes(cycle.id) && (
                  <View style={styles.detailsContainer}>
                    {daysWithSymptoms.map((day) => {
                      const isDayExpanded = expandedDays.some(
                        (d) => d.cycleId === cycle.id && d.dayDate === day.date
                      );
                      return (
                        <View key={day.date} style={styles.dayContainer}>
                          <TouchableOpacity
                            onPress={() => toggleDayExpand(cycle.id, day.date)}
                            style={styles.dayHeader}
                          >
                            <Text style={styles.dayTitle}>Día: {formatDate(day.date)}</Text>
                            <Text style={styles.expandButtonText}>
                              {isDayExpanded ? "▲" : "▼"}
                            </Text>
                          </TouchableOpacity>

                          {isDayExpanded && (
                            <View style={styles.dayDetails}>
                              {day.symptoms.length > 0 && (
                                <>
                                  <Text style={styles.subTitle}>
                                    Tipo de sangrado:
                                  </Text>
                                  {day.symptoms.map((symptom, i) => (
                                    <Text key={i} style={styles.detailText}>
                                      • {symptom}
                                    </Text>
                                  ))}
                                </>
                              )}

                              {day.pains.length > 0 && (
                                <>
                                  <Text style={styles.subTitle}>Dolores:</Text>
                                  {day.pains.map((pain, i) => (
                                    <Text key={i} style={styles.detailText}>
                                      • {pain}
                                    </Text>
                                  ))}
                                </>
                              )}

                              {day.emotions.length > 0 && (
                                <>
                                  <Text style={styles.subTitle}>
                                    Emociones:
                                  </Text>
                                  {day.emotions.map((emotion, i) => (
                                    <Text key={i} style={styles.detailText}>
                                      • {emotion}
                                    </Text>
                                  ))}
                                </>
                              )}

                              {day.notes && (
                                <>
                                  <Text style={styles.subTitle}>Notas:</Text>
                                  <Text style={styles.detailText}>
                                    {day.notes}
                                  </Text>
                                </>
                              )}
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}
              </>
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
  lastUpdateText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginBottom: 10,
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
