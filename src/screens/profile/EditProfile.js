import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { calculateAge } from "../../utils/dateUtils";
import UserService from "../../api/userService";
import Calendar from "../../components/Calendar";
import { useUser } from "../../context/UserContext";

export default function EditProfile({ route, navigation }) {
  const { user } = useUser();

  const [userData, setUserData] = useState({
    name: user.name || "",
    surname: user.surname || "",
    email: user.email || "",
    password: user.password || "",
    birthdate: new Date(user.birthdate),
  });

  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSave = async () => {
    const { name, surname, email } = userData;

    if (!name.trim() || !surname.trim() || !email.trim()) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError("El correo electrónico no tiene un formato válido.");
      return;
    }

    try {
      const updatedUser = {
        id: user.id,
        name: userData.name.trim(),
        surname: userData.surname.trim(),
        email: userData.email.trim(),
        password: userData.password.trim(),
        birthdate: userData.birthdate.toISOString(),
        lastPeriod: new Date(user.lastPeriod).toISOString(),
        lastCycleLength: Number(user.lastCycleLength),
        menstruationDuration: Number(user.menstruationDuration),
      };

      console.log("Actualizando usuario:", updatedUser);

      await UserService.updateUser(user.id, updatedUser);
      navigation.goBack();
    } catch (err) {
      console.log("Error al actualizar:", err);
      setError("Error al guardar los cambios. Inténtalo nuevamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={userData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <Text style={styles.label}>Apellido:</Text>
      <TextInput
        style={styles.input}
        value={userData.surname}
        onChangeText={(text) => handleChange("surname", text)}
      />

      <Text style={styles.label}>Correo electrónico:</Text>
      <TextInput
        style={styles.input}
        value={userData.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        style={styles.input}
        value={userData.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
      />

      <Text style={styles.label}>Fecha de nacimiento:</Text>
      <Calendar
        date={userData.birthdate}
        onChangeDate={(selectedDate) => handleChange("birthdate", selectedDate)}
      />

      <Text style={styles.label}>
        Edad actual: {calculateAge(userData.birthdate)} años
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.button}>
        <Button title="Guardar" onPress={handleSave} color="#600000" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    color: "#444",
  },
  input: {
    height: 40,
    width: 300,
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginTop: 5,
  },
  button: {
    marginTop: 30,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});
