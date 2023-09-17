import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './app/Screens/Login';
import Questions from './app/Screens/Questions';
import SignUp from './app/Screens/SignUp';
import HomeTabs from './app/Screens/HomeTabs';
const Stack = createNativeStackNavigator();
const auth = getAuth();


export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser && authUser.email) {
        console.log(authUser.email);
        AsyncStorage.setItem('userMail', authUser.email)
          .then(() => {
            console.log('User email saved in AsyncStorage');
          })
          .catch((error) => {
            console.error('Error saving user email to AsyncStorage:', error);
          });
        setUser(authUser);
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
              options={{ title: 'Questions', headerShown: false }}
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
