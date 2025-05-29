import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogIn from "../screens/authentication/LogIn";
import SignUp from "../screens/authentication/SignUp";
import ForgotPassword from "../screens/authentication/ForgotPassword";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack({ onLoginSuccess }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LogIn">
        {(props) => <LogIn {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {(props) => <SignUp {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
}
