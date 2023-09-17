import { AppRegistry, Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Login from "./app/Screens/Login";
import Home from "./app/Screens/Home";
import CalorieCalculator from "./app/Screens/CalorieCalculator";
import Recipes from "./app/Screens/Recipes";
import Questions from "./app/Screens/Questions";
import React from "react";
import SignUp from "./app/Screens/SignUp";
import Profile from "./app/Screens/Profile";
import FastingTimer from "./app/Screens/FastingTimer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dietplan from "./app/Screens/Dietplan";
import PlanFast from "./app/Screens/fastinghours/PlanFast";


const Stack = createNativeStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const auth = getAuth();

function HomeTabs() {
  return (
    <Tab.Navigator activeColor="black" barStyle={{ backgroundColor: "white" }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={20}
              color={focused ? "#fff" : "black"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Calculator"
        component={CalorieCalculator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="calculator"
              size={20}
              color={focused ? "#fff" : "black"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Recipes"
        component={Recipes}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="book"
              size={20}
              color={focused ? "#fff" : "black"}
            />
          ),
        }}
      />
            <Tab.Screen
        name="FastingTime"
        component={FastingTimer}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="clock-o" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="user" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Test"
        component={PlanFast}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="user" size={24} color="black" />
          ),
        }}
      />
          </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user?.email) {

        console.log(user.email);
        AsyncStorage.setItem("userMail", user.email)
          .then(() => {
            console.log("User email saved in AsyncStorage");
          })
          .catch((error) => {
            console.error("Error saving user email to AsyncStorage:", error);
          });
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Questions"
            component={Questions}
            options={{ title: "Questions", headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}