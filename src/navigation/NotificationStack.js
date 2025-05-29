import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from "../components/Header";
import NotificationsScreen from "../screens/notifications/NotificationsScreen";

const Stack = createNativeStackNavigator();

export default function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Notifications"
        children={ () => (
          <Header screenName="Notificaciones">
            <NotificationsScreen />
          </Header>
        )}
      />
    </Stack.Navigator>
  );
}
