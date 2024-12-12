import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./app/screens/LoginScreen";
import AboutScreen from "./app/screens/AboutScreen";
import HomeScreen from "./app/screens/HomeScreen";
import SignupScreen from "./app/screens/SignupScreen";
import WriteStoryScreen from "./app/screens/WriteStoryScreen";
import StoryListScreen from "./app/screens/StoryListScreen";
import BookDetails from "./app/screens/BookDetails";
import ReadBookScreen from "./app/screens/ReadBookScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} />
        <Stack.Screen name="WriteStoryScreen" component={WriteStoryScreen} />
        <Stack.Screen name="StoryListScreen" component={StoryListScreen} />
        <Stack.Screen name="BookDetails" component={BookDetails} />
        <Stack.Screen name="ReadBookScreen" component={ReadBookScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
