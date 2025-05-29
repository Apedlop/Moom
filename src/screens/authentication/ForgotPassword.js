import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../config/colors";
import Toast from "react-native-toast-message";
import { useUser } from "../../context/UserContext";
import UserService from "../../api/userService";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user, setUser } = useUser();
  const navigation = useNavigation();

  const handleEmailSubmit = async () => {
    try {
      await login(email);
      setStep(2);
      setError("");
    } catch (err) {
      setError("Correo no encontrado. Intenta nuevamente.");
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const updatedUser = { ...user, password: newPassword };
      const response = await UserService.updateUser(user.id, updatedUser);
      setUser(response.data);
      Toast.show({
        type: "success",
        text1: "Contraseña cambiada",
        text2: "Ya puedes iniciar sesión",
      });
      navigation.navigate("LogIn"); // Asegúrate que 'Login' esté definido en tu stack
    } catch (err) {
      setError("Error al actualizar la contraseña. Intenta más tarde.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>

        {step === 1 && (
          <View>
            <Text style={styles.label}>Correo electrónico:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleEmailSubmit}>
              <Text style={styles.buttonText}>Verificar correo</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && user && (
          <View>
            <Text style={styles.info}>
              Correo verificado: <Text style={styles.bold}>{user.email}</Text>
            </Text>
            <Text style={styles.label}>Nueva contraseña:</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handlePasswordSubmit}
            >
              <Text style={styles.buttonText}>Cambiar contraseña</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.goldMedium,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    color: colors.primary,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.goldDark,
    backgroundColor: colors.white,
    color: colors.black,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: colors.goldLight,
    fontWeight: "bold",
  },
  error: {
    color: colors.error,
    marginTop: 15,
    textAlign: "center",
  },
  info: {
    marginBottom: 10,
    fontSize: 14,
  },
  bold: {
    fontWeight: "bold",
  },
});
