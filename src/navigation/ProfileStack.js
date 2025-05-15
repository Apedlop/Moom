import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from "../components/Header";
import ProfileScreen from "../screens/profile/ProfileScreen";
import EditProfile from "../screens/profile/EditProfile";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ProfileMain"
        children={({ navigation, route }) => (
          <Header screenName="Perfil">
            <ProfileScreen navigation={navigation} route={route} />
          </Header>
        )}
      />
      <Stack.Screen
        name="EditProfile"
        children={({ navigation, route }) => (
          <Header screenName="Editar Perfil">
            <EditProfile navigation={navigation} route={route} />
          </Header>
        )}
      />
    </Stack.Navigator>
  );
}
