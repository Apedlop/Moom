import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { getNextMenstruationDate } from "../../utils/dateUtils";
import { format, differenceInDays, isAfter } from "date-fns";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// Configuración para mostrar notificaciones cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Función para pedir permisos para notificaciones
async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permiso para notificaciones denegado");
      return false;
    }
    return true;
  } else {
    alert("Debes usar un dispositivo físico para las notificaciones");
    return false;
  }
}

// Función para enviar notificación local inmediata
async function enviarNotificacionLocal(titulo, cuerpo) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: cuerpo,
    },
    trigger: null, // dispara inmediatamente
  });
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function init() {
      const permiso = await registerForPushNotificationsAsync();
      if (!permiso) return;

      const today = new Date();
      const nextMenstruation = getNextMenstruationDate();

      const daysUntilNext = differenceInDays(nextMenstruation, today);

      const messages = [];

      if (daysUntilNext === 2) {
        messages.push("🩸 Tu menstruación llegará en 2 días. ¡Prepárate!");
        await enviarNotificacionLocal(
          "Recordatorio menstrual",
          "🩸 Tu menstruación llegará en 2 días."
        );
      }

      if (differenceInDays(today, nextMenstruation) === 1 && isAfter(today, nextMenstruation)) {
        messages.push("⚠️ Tu menstruación parece estar retrasada. ¿Quieres registrar algo?");
        await enviarNotificacionLocal(
          "Aviso retraso menstrual",
          "⚠️ Tu menstruación parece estar retrasada."
        );
      }

      setNotifications(messages);
    }

    init();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      {notifications.length === 0 ? (
        <Text style={styles.empty}>No hay notificaciones por ahora 🎉</Text>
      ) : (
        notifications.map((msg, idx) => (
          <View key={idx} style={styles.notification}>
            <Text style={styles.message}>{msg}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  notification: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#e91e63",
  },
  message: {
    fontSize: 16,
  },
  empty: {
    fontSize: 16,
    textAlign: "center",
    color: "#999",
  },
});
