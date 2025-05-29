import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Calendar from "../../components/Calendar";
import EnumService from "../../api/enumService";
import SymptomService from "../../api/symptomService";
import CycleService from "../../api/cycleService";
import { useUser } from "../../context/UserContext";

export default function MenstrualForm({ route }) {
  const { user } = useUser();
  const { prediction } = route.params;
  const navigation = useNavigation();

  const cycleIdRef = useRef(null);
  const [existingSymptomId, setExistingSymptomId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [typePainOptions, setTypePainOptions] = useState([]);
  const [typeEmotionOptions, setTypeEmotionOptions] = useState([]);
  const [typePeriodOptions, setTypePeriodOptions] = useState([]);

  const [selectedTypePain, setSelectedTypePain] = useState([]);
  const [selectedTypeEmotion, setSelectedTypeEmotion] = useState([]);
  const [selectedTypePeriod, setSelectedTypePeriod] = useState([]);

  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const [showPeriodOptions, setShowPeriodOptions] = useState(false);
  const [showPainOptions, setShowPainOptions] = useState(false);
  const [showEmotionOptions, setShowEmotionOptions] = useState(false);

  // Cargar opciones de enumeraciones
  useEffect(() => {
    const loadEnums = async () => {
      try {
        const [pains, emotions, periods] = await Promise.all([
          EnumService.getTypePain(),
          EnumService.getTypeEmotion(),
          EnumService.getTypePeriod(),
        ]);
        setTypePainOptions(pains.data || []);
        setTypeEmotionOptions(emotions.data || []);
        setTypePeriodOptions(periods.data || []);
      } catch (error) {
        console.error("Error loading enums:", error);
      }
    };

    loadEnums();
  }, []);

  // Cargar síntomas existentes cuando cambia la fecha
  useEffect(() => {
    const loadExistingSymptoms = async () => {
      try {
        // Ajustar fecha para evitar problemas de zona horaria
        const adjustedDate = new Date(date);
        adjustedDate.setHours(12, 0, 0, 0);
        const dateStr = adjustedDate.toISOString().split("T")[0];

        const response = await SymptomService.getSymptomsByUserIdAndDate(
          user.id,
          dateStr
        );

        let symptomData;
        if (Array.isArray(response?.data)) {
          symptomData = response.data.length > 0 ? response.data[0] : null;
        } else {
          symptomData = response?.data || null;
        }

        if (symptomData) {
          // Verificar que la fecha coincide exactamente
          const symptomDate = new Date(symptomData.date)
            .toISOString()
            .split("T")[0];
          if (symptomDate === dateStr) {
            setExistingSymptomId(symptomData.id);
            setIsEditing(true);
            setSelectedTypePain(symptomData.typePain || []);
            setSelectedTypeEmotion(symptomData.typeEmotion || []);
            setSelectedTypePeriod(symptomData.typePeriod || []);
            setNotes(symptomData.notes || "");
            cycleIdRef.current = symptomData.cycleId || null;

            console.log(
              "Loaded existing symptom for date:",
              dateStr,
              symptomData
            );
          } else {
            resetForm();
          }
        } else {
          resetForm();
        }
      } catch (error) {
        console.error("Error loading symptoms:", error);
        resetForm();
      }
    };

    const resetForm = () => {
      setIsEditing(false);
      setExistingSymptomId(null);
      setSelectedTypePain([]);
      setSelectedTypeEmotion([]);
      setSelectedTypePeriod([]);
      setNotes("");
      cycleIdRef.current = null;
    };

    loadExistingSymptoms();
  }, [date]);

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSingleSelection = (item, setItem) => {
    setItem([item]);
  };

  const handleSubmit = async () => {
    try {
      // Validación básica
      if (!selectedTypePeriod.length) {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error",
          text2: "Debes seleccionar al menos un tipo de flujo",
          visibilityTime: 4000,
        });
        return;
      }

      // Ajustar fecha para evitar problemas de zona horaria
      const adjustedDate = new Date(date);
      adjustedDate.setHours(12, 0, 0, 0);
      const formattedDate = adjustedDate.toISOString().split("T")[0];

      // Verificar que el ID exista si estamos en modo edición
      if (isEditing && !existingSymptomId) {
        console.error("Error: Intentando editar sin ID de síntoma");
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error",
          text2: "No se encontró el síntoma a editar",
          visibilityTime: 4000,
        });
        return;
      }

      // Manejo del ciclo menstrual
      let cycleId = null;
      try {
        const cyclesRes = await CycleService.getCyclesByUserId(user.id);
        const cycles = cyclesRes?.data || [];
        const cyclesSorted = cycles.sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate)
        );
        const lastCycle = cyclesSorted[0];

        if (lastCycle) {
          const lastCycleDate = new Date(lastCycle.startDate);
          lastCycleDate.setHours(12, 0, 0, 0);

          const daysSinceLastCycle =
            Math.floor((adjustedDate - lastCycleDate) / (1000 * 60 * 60 * 24)) +
            1;

          if (daysSinceLastCycle >= 20) {
            const menstruationResponse =
              await CycleService.getMenstruationDuration(lastCycle.id);
            await CycleService.updateCycle(lastCycle.id, {
              startDate: lastCycle.startDate,
              cycleLength: daysSinceLastCycle,
              menstruationDuration: menstruationResponse?.data || 5,
            });

            const newCycleRes = await CycleService.addCycle({
              userId: user.id,
              startDate: formattedDate,
              cycleLength: prediction?.cycleLength || 28,
              menstruationDuration: prediction?.menstruationDuration || 5,
            });
            cycleId = newCycleRes.data.id;
          } else {
            cycleId = lastCycle.id;
          }
        } else {
          const newCycleRes = await CycleService.addCycle({
            userId: user.id,
            startDate: formattedDate,
            cycleLength: prediction?.cycleLength || 28,
            menstruationDuration: prediction?.menstruationDuration || 5,
          });
          cycleId = newCycleRes.data.id;
        }
      } catch (cycleError) {
        console.error("Error manejando ciclo:", cycleError);
      }

      // Preparar payload
      const payload = {
        id: existingSymptomId,
        userId: user.id,
        cycleId: cycleId || null,
        date: formattedDate,
        typePain: selectedTypePain,
        typeEmotion: selectedTypeEmotion,
        typePeriod: selectedTypePeriod,
        notes: notes || "",
      };

      console.log("Enviando payload:", {
        ...payload
      });

      // Enviar datos
      if (isEditing) {
        if (!existingSymptomId) {
          throw new Error("ID de síntoma no disponible para edición");
        }
        await SymptomService.updateSymptom(existingSymptomId, payload);
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Actualizado",
          text2: "Síntomas actualizados correctamente",
          visibilityTime: 4000,
        });
      } else {
        await SymptomService.addSymptom(payload);
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Guardado",
          text2: "Síntomas registrados correctamente",
          visibilityTime: 4000,
        });
      }

      navigation.navigate("HomeMain");
    } catch (error) {
      console.error("Error en handleSubmit:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      });

      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error",
        text2:
          error.response?.data?.message ||
          error.message ||
          "Error al guardar los síntomas",
        visibilityTime: 4000,
      });
    }
  };

  const renderOptions = (options, selected, setSelected, single = false) => {
    if (!options || options.length === 0) return null;

    return options.map((item) => (
      <TouchableOpacity
        key={item}
        style={[
          styles.option,
          selected.includes(item) && styles.optionSelected,
        ]}
        onPress={() =>
          single
            ? handleSingleSelection(item, setSelected)
            : toggleSelection(item, selected, setSelected)
        }
      >
        <Text
          style={[
            styles.optionText,
            selected.includes(item) && styles.optionTextSelected,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Fecha del ciclo</Text>
        <Calendar date={date} onChangeDate={setDate} />
      </View>

      {/* Sección Flujo */}
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => setShowPeriodOptions(!showPeriodOptions)}
        >
          <Text style={styles.label}>
            Flujo {showPeriodOptions ? "▲" : "▼"}
          </Text>
          {selectedTypePeriod.length > 0 && (
            <Text style={styles.selectedItems}>
              {selectedTypePeriod.join(", ")}
            </Text>
          )}
        </TouchableOpacity>
        {showPeriodOptions && (
          <View style={styles.optionsContainer}>
            {renderOptions(
              typePeriodOptions,
              selectedTypePeriod,
              setSelectedTypePeriod,
              true
            )}
          </View>
        )}
      </View>

      {/* Sección Dolores */}
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setShowPainOptions(!showPainOptions)}>
          <Text style={styles.label}>
            Dolores {showPainOptions ? "▲" : "▼"}
          </Text>
          {selectedTypePain.length > 0 && (
            <Text style={styles.selectedItems}>
              {selectedTypePain.join(", ")}
            </Text>
          )}
        </TouchableOpacity>
        {showPainOptions && (
          <View style={styles.optionsContainer}>
            {renderOptions(
              typePainOptions,
              selectedTypePain,
              setSelectedTypePain
            )}
          </View>
        )}
      </View>

      {/* Sección Emociones */}
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => setShowEmotionOptions(!showEmotionOptions)}
        >
          <Text style={styles.label}>
            Emociones {showEmotionOptions ? "▲" : "▼"}
          </Text>
          {selectedTypeEmotion.length > 0 && (
            <Text style={styles.selectedItems}>
              {selectedTypeEmotion.join(", ")}
            </Text>
          )}
        </TouchableOpacity>
        {showEmotionOptions && (
          <View style={styles.optionsContainer}>
            {renderOptions(
              typeEmotionOptions,
              selectedTypeEmotion,
              setSelectedTypeEmotion
            )}
          </View>
        )}
      </View>

      {/* Notas personales */}
      <View style={styles.card}>
        <Text style={styles.label}>Notas personales</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Escribe lo que quieras..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      {/* Botón de enviar */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          !selectedTypePeriod.length && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!selectedTypePeriod.length}
      >
        <Text style={styles.submitButtonText}>
          {isEditing ? "Actualizar" : "Guardar"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 330,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#600000",
    marginBottom: 8,
  },
  selectedItems: {
    fontSize: 14,
    color: "#60000080",
    fontStyle: "italic",
    marginTop: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    width: "100%",
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#60000040",
    backgroundColor: "#fff",
    marginRight: 8,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: "#600000",
    borderColor: "#600000",
  },
  optionText: {
    color: "#600000",
    fontSize: 14,
  },
  optionTextSelected: {
    color: "#fff",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: "#600000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#60000060",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
