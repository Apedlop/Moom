import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/home/HomeScreen";
import InfoPhase from "../components/InfoPhase";
import MenstrualForm from "../screens/home/MenstrualForm";
import Header from "../components/Header";
import Toast from "react-native-toast-message"; 

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="HomeMain"
          children={() => (
            <Header screenName="Inicio">
              <HomeScreen />
            </Header>
          )}
        />
        <Stack.Screen name="Details" children={() => <InfoPhase />} />
        <Stack.Screen
          name="MenstrualForm"
          children={() => (
            <Header screenName="Formulario">
              <MenstrualForm />
            </Header>
          )}
        />
      </Stack.Navigator>
    </>
  );
}
