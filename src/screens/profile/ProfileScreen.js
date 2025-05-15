import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation();

  const userInfo = {
    name: "María",
    surname: "López García",
    email: "maria.lopez@example.com",
    birthDate: "1995-04-10", // Formato ISO (YYYY-MM-DD)
  };

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const age = calculateAge(userInfo.birthDate);

  const handleEdit = () => {
    navigation.navigate("EditProfile", { user: userInfo });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenida, {userInfo.name}!</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{userInfo.name}</Text>

        <Text style={styles.label}>Apellido:</Text>
        <Text style={styles.value}>{userInfo.surname}</Text>

        <Text style={styles.label}>Correo electrónico:</Text>
        <Text style={styles.value}>{userInfo.email}</Text>

        <Text style={styles.label}>Fecha de nacimiento:</Text>
        <Text style={styles.value}>
          {new Date(userInfo.birthDate).toLocaleDateString('es-ES')}
        </Text>

        <Text style={styles.label}>Edad:</Text>
        <Text style={styles.value}>{age} años</Text>
      </View>

      <TouchableOpacity style={styles.fab} onPress={handleEdit}>
        <Ionicons name="create-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#600000',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
