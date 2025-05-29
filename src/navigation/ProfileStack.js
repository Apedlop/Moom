import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from "../components/Header";
import ProfileScreen from "../screens/profile/ProfileScreen";
import EditProfile from "../screens/profile/EditProfile";
import LogIn from "../screens/authentication/LogIn"; 
import SignUp from "../screens/authentication/SignUp";
import ForgotPassword from "../screens/authentication/ForgotPassword";

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
      <Stack.Screen
        name="LogIn"
        children={({ navigation }) => (
          <LogIn onLoginSuccess={() => navigation.replace("ProfileMain")} />
        )}
      />
      <Stack.Screen name="SignUp">
              {(props) => <SignUp {...props} onLoginSuccess={onLoginSuccess} />}
            </Stack.Screen>
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
}
