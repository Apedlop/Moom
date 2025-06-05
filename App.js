import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./src/navigation/TabNavigation";
import AuthStack from "./src/navigation/AuthStack";
import Toast from "react-native-toast-message";
import { UserProvider } from './src/context/UserContext';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go',
  '`expo-notifications` functionality is not fully supported in Expo Go',
]);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permisos de notificación no concedidos');
      }
      console.log('Permisos de notificación concedidos:', status);
    };
    requestPermissions();
  }, []);

  return (
    <UserProvider>
      <NavigationContainer>
        {isAuthenticated ? (
          <TabNavigation />
        ) : (
          <AuthStack onLoginSuccess={() => setIsAuthenticated(true)} />
        )}
      </NavigationContainer>
      <Toast />
    </UserProvider>
  );
}
