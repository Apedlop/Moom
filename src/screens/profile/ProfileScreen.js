import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import UserService from "../../api/userService";
import FloatingButton from "../../components/FloatingButton";
import { useUser } from "../../context/UserContext";

export default function ProfileScreen() {
 const { user, setUser, logout } = useUser();
  const [localUser, setLocalUser] = useState(user);
  const navigation = useNavigation();

  const fetchUserData = useCallback(async () => {
    if (!user?.id) return; // Protege si el ID es nulo
    try {
      const response = await UserService.getUser(user.id);
      setLocalUser(response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    }
  }, [user?.id, setUser]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchUserData();
      }
    }, [user?.id])
  );

  if (!user.id) return null; // Protege si el usuario es nulo

  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
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

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás segura de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          onPress: () => {
            navigation.navigate("LogIn"); 
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Eliminar cuenta",
      "¿Estás segura de que quieres eliminar tu cuenta permanentemente? Todos tus datos se perderán.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await UserService.deleteUser(user.id);
             navigation.navigate("LogIn"); 
            } catch (error) {
              console.error("Error al eliminar cuenta:", error);
              Alert.alert(
                "Error",
                "No se pudo eliminar la cuenta. Inténtalo de nuevo."
              );
            }
          },
        },
      ]
    );
  };

  if (!localUser) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const age = calculateAge(localUser.birthdate);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenida, {localUser.name}!</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{localUser.name}</Text>

        <Text style={styles.label}>Apellido:</Text>
        <Text style={styles.value}>{localUser.surname}</Text>

        <Text style={styles.label}>Correo electrónico:</Text>
        <Text style={styles.value}>{localUser.email}</Text>

        <Text style={styles.label}>Fecha de nacimiento:</Text>
        <Text style={styles.value}>
          {new Date(localUser.birthdate).toLocaleDateString("es-ES")}
        </Text>

        <Text style={styles.label}>Edad:</Text>
        <Text style={styles.value}>{age} años</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteButtonText}>Eliminar cuenta</Text>
        </TouchableOpacity>
      </View>

      <FloatingButton
        pageScreen={"EditProfile"}
        params={{ user: localUser, onSave: fetchUserData }}
      >
        <Ionicons name="create-outline" size={24} color="#fff" />
      </FloatingButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "95%",
    marginTop: "10%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#600000",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    width: 300,
    alignItems: "center",
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#600000",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#000",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    width: 300,
    gap: 10,
  },
  logoutButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "45%",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#D64545",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "45%",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
