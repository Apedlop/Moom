import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/home/HomeScreen";
import InfoPhase from "../components/InfoPhase";
import MenstrualForm from "../screens/home/MenstrualForm";
import Header from "../components/Header";

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
          children={({ route }) => (
            <Header screenName="Formulario">
              <MenstrualForm route={route} />
            </Header>
          )}
        />
      </Stack.Navigator>
    </>
  );
}
