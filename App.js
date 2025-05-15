import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./src/navigation/TabNavigation";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <>
      <NavigationContainer>
        <TabNavigation />
      </NavigationContainer>
      <Toast />
    </>
  );
}
