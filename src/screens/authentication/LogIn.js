import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import UserService from "../../api/userService";
import { colors } from "../../config/colors";
import { useUser } from "../../context/UserContext";

export default function LogIn({ onLoginSuccess }) {
  const { setUser } = useUser();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // useEffect(() => {
  //   setUser(null); // Limpiar el usuario 
  // }, []);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!isValidEmail(email)) {
      setErrorMessage("Formato de email no válido");
      return;
    }

    try {
      const response = await UserService.getAll();
      const users = response.data;

      const foundUser = users.find((u) => u.email === email);

      if (!foundUser) {
        setErrorMessage("Usuario no encontrado");
        return;
      }

      if (foundUser.password !== password) {
        setErrorMessage("Contraseña incorrecta");
        return;
      }

      setUser(foundUser); // Usuario autenticado al contexto
      setSuccessMessage(`Bienvenida, ${foundUser.name} ${foundUser.surname}`);
      onLoginSuccess();
    } catch (error) {
      setErrorMessage("Error al conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>Bienvenida de vuelta</Text>

        {errorMessage !== "" && (
          <Text style={styles.error}>{errorMessage}</Text>
        )}
        {successMessage !== "" && (
          <Text style={styles.success}>{successMessage}</Text>
        )}

        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.linkText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.goldMedium,
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 25,
    marginHorizontal: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.goldDark,
    marginBottom: 18,
    color: colors.black,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 5,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: colors.goldLight,
    fontSize: 17,
    fontWeight: "600",
  },
  error: {
    color: "#fff",
    backgroundColor: colors.error,
    padding: 12,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 18,
    fontSize: 14,
    alignSelf: "center",
    width: "100%",
  },
  success: {
    color: "#fff",
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 18,
    fontSize: 14,
    alignSelf: "center",
    width: "100%",
  },
  link: {
    marginTop: 18,
    alignItems: "center",
  },
  linkText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
