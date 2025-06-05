import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../config/colors"; 
import HomeStack from "./HomeStack";
import ProfileStack from "./ProfileStack";
import HistoryStack from "./HistoryStack";
import NotificationStack from "./NotificationStack";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Inicio")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Perfil")
            iconName = focused ? "person" : "person-outline";
          else if (route.name === "Historial")
            iconName = focused ? "calendar" : "calendar-outline";
          else if (route.name === "Notificaciones")
            iconName = focused ? "notifications" : "notifications-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
      })}
    >
      <Tab.Screen name="Inicio" component={HomeStack} />
      <Tab.Screen name="Historial" component={HistoryStack} />
      <Tab.Screen name="Notificaciones" component={NotificationStack} />
      <Tab.Screen name="Perfil" component={ProfileStack} />
    </Tab.Navigator>
  );
}
