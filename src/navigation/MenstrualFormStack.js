import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from "../components/Header";
import HistoryScreen from "../screens/history/HistoryScreen";

const Stack = createNativeStackNavigator();

export default function MenstrualFormStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MenstrualForm"
        children={({ navigation, route }) => (
          <Header screenName="Historial">
            <HistoryScreen navigation={navigation} route={route} />
          </Header>
        )}
      />
    </Stack.Navigator>
  );
}
