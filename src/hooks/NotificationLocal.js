import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

async function NotificationLocal(titulo, cuerpo) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: cuerpo,
    },
    trigger: null, // Inmediato
  });
}