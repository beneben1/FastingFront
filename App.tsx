import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "./app/Screens/AUTHscreens/Login";
import Questions from "./app/Screens/Questions";
import SignUp from "./app/Screens/AUTHscreens/SignUp";
import HomeTabs from "./app/Navigation/HomeTabs";
import Dietplan12 from "./app/Screens/fastinghours/Dietplan12";
import Dietplan14 from "./app/Screens/fastinghours/Dietplan14";
import Dietplan16 from "./app/Screens/fastinghours/Dietplan16";
const Stack = createNativeStackNavigator();
const auth = getAuth();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
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
            <Stack.Screen
              name="Diet plan(12-12)"
              component={Dietplan12}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Diet plan(14-10)"
              component={Dietplan14}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Diet plan(16-8)"
              component={Dietplan16}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}