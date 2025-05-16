import React, { useEffect, useParams, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import UserService from "../../api/userService";

export default function ProfileScreen() {
  const [user, setUser] = React.useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    UserService.getUser(123)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = calculateAge(user.birthdate);

  const handleEdit = () => {
    navigation.navigate("EditProfile", { user });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenida, {user.name}!</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{user.name}</Text>

        <Text style={styles.label}>Apellido:</Text>
        <Text style={styles.value}>{user.surname}</Text>

        <Text style={styles.label}>Correo electrónico:</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Fecha de nacimiento:</Text>
        <Text style={styles.value}>
          {new Date(user.birthdate).toLocaleDateString("es-ES")}
        </Text>

        <Text style={styles.label}>Edad:</Text>
        <Text style={styles.value}>{age} años</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Eliminar cuenta</Text>
      </TouchableOpacity>

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
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#555",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#000",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#600000",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#D64545",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
