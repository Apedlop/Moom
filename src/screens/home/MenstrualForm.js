import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Importa useNavigation
import Toast from "react-native-toast-message"; // Importa la librería de Toast

const symptomOptions = [
  "Dolor abdominal",
  "Dolor de cabeza",
  "Dolor lumbar",
  "Sensibilidad en los senos",
  "Cansancio",
  "Náuseas",
];

const moodOptions = [
  "Irritabilidad",
  "Tristeza",
  "Ansiedad",
  "Euforia",
  "Sensibilidad emocional",
  "Estabilidad",
];

const flowOptions = ["Restos", "Poco", "Normal", "Abundante"];

export default function MenstrualForm({ selectedDate }) {
  const navigation = useNavigation(); // Utiliza el hook para navegación

  const [date, setDate] = useState("");
  const [flow, setFlow] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = () => {
    console.log("Formulario enviado:");
    console.log("Fecha:", date);
    console.log("Flujo:", flow);
    console.log("Síntomas:", selectedSymptoms);
    console.log("Emociones:", selectedMoods);
    console.log("Notas:", notes);
  
    Toast.show({
      type: "success",
      position: "bottom",
      text1: "Formulario enviado",
      text2: "Se ha añadido tu registro correctamente.",
      visibilityTime: 4000,
      autoHide: true,
    });
  
    navigation.navigate("HomeMain");
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Formulario del Ciclo Menstrual</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Fecha (automática según bolita):</Text>
        <TextInput style={styles.input} value={date} editable={false} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Flujo:</Text>
        {flowOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, flow === option && styles.optionSelected]}
            onPress={() => setFlow(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Síntomas físicos:</Text>
        {symptomOptions.map((symptom) => (
          <TouchableOpacity
            key={symptom}
            style={[styles.option, selectedSymptoms.includes(symptom) && styles.optionSelected]}
            onPress={() => toggleSelection(symptom, selectedSymptoms, setSelectedSymptoms)}
          >
            <Text style={styles.optionText}>{symptom}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Emociones:</Text>
        {moodOptions.map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[styles.option, selectedMoods.includes(mood) && styles.optionSelected]}
            onPress={() => toggleSelection(mood, selectedMoods, setSelectedMoods)}
          >
            <Text style={styles.optionText}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Notas personales (opcional):</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Escribe lo que quieras..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      <Button title="Enviar" onPress={handleSubmit} color="#600000" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  option: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#aaa",
    backgroundColor: "#f0f0f0",
  },
  optionSelected: {
    backgroundColor: "rgba(96, 0, 0, 0.35)",
    borderColor: "rgba(96, 0, 0, 0.79)",
    color: "#fff",
  },
  optionText: {
    fontSize: 14,
  },
  submit: {
    marginTop: 20,
    backgroundColor: "#600000",
    color: "#fff",
  },
});
