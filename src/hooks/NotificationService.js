import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración global de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Inicialización con más controles
export const initNotifications = async () => {
  try {
    // Configuración para Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('period-reminder', {
        name: 'Period Reminder',
        importance: Notifications.AndroidImportance.HIGH,
        sound: true,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    // Verificar permisos existentes primero
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Solo pedir permisos si no los tenemos
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error inicializando notificaciones:', error);
    return false;
  }
};

// Notificación diaria mejorada
export const scheduleDailyNotification = async (title, body, hour, minute) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: {
      hour,
      minute,
      repeats: true, // importante para notificación diaria
    },
  });
};

export const scheduleNotificationOnDate = async (title, body, date, hour, minute) => {
  const scheduledDate = new Date(date);
  scheduledDate.setHours(hour);
  scheduledDate.setMinutes(minute);
  scheduledDate.setSeconds(0);

  if (scheduledDate < new Date()) {
    console.warn("La fecha programada ya pasó");
    return false;
  } else {
    console.log("Esperando que llegue el día.")
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: scheduledDate, // sin `repeats`
  });

  return true;
};

// Verificar notificaciones programadas (para debug)
export const checkScheduledNotifications = async () => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log('Notificaciones programadas:', scheduled);
  return scheduled;
};

// Historial de notificaciones
export const getNotificationHistory = async () => {
  try {
    const stored = await AsyncStorage.getItem('notificationHistory');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    return [];
  }
};

export const clearNotificationHistory = async () => {
  try {
    await AsyncStorage.removeItem('notificationHistory');
    return true;
  } catch (error) {
    console.error('Error limpiando historial:', error);
    return false;
  }
};

async function scheduleNotificationOnDateOnOff(title, body, date) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true, // para que suene la notificación
      },
      trigger: date, // puede ser objeto Date o { seconds: n, repeats: false }
    });
    return true;
  } catch (e) {
    console.error("Error programando notificación:", e);
    return false;
  }
}
