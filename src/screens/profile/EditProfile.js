import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { formatDate, calculateAge } from '../../utils/dateUtils'; // Importar las funciones

export default function EditProfile({ route, navigation }) {
  const { user } = route.params;

  const [name, setName] = useState(user.name);
  const [surname, setsurname] = useState(user.surname);
  const [email, setEmail] = useState(user.email);
  const [birthDate, setBirthDate] = useState(new Date(user.birthDate));
  const [birthDateInput, setBirthDateInput] = useState(formatDate(new Date(user.birthDate))); // Inicializar con la fecha en formato DD/MM/YYYY

  const handleSave = () => {
    const updatedUser = {
      name,
      surname,
      email,
      birthDate: birthDate.toISOString().split('T')[0], // Convertir a formato ISO
    };
    console.log("Usuario actualizado:", updatedUser);
    navigation.goBack();
  };

  // Función para actualizar la fecha cuando el usuario la edita
  const handleDateChange = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    const newDate = new Date(year, month - 1, day);
    if (newDate instanceof Date && !isNaN(newDate)) {
      setBirthDate(newDate);
    }
    setBirthDateInput(dateString);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Apellido:</Text>
      <TextInput style={styles.input} value={surname} onChangeText={setsurname} />

      <Text style={styles.label}>Correo electrónico:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>Fecha de nacimiento:</Text>
      <TextInput
        style={styles.input}
        value={birthDateInput}
        onChangeText={handleDateChange} // Cambiar fecha en formato DD/MM/YYYY
        placeholder="DD/MM/YYYY"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Edad actual: {calculateAge(birthDate)} años</Text>

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
    fontWeight: '600',
    marginTop: 15,
    color: '#444',
  },
  input: {
    height: 40,
    width: 300,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  button: {
    marginTop: 30,
  },
});
