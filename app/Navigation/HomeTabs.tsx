import React from "react";
import Home from "../Screens/Home";
import CalorieCalculator from "../Screens/CaloriesCalculator/CalorieCalculator";
import Recipes from "../Screens/Recipes";
import FastingTimer from "../Screens/FastingTimer";
import Profile from "../Screens/Profile";
import { FontAwesome } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

const Tab = createMaterialBottomTabNavigator();

function HomeTabs() {
    const tabScreens = [
        { name: 'Home', component: Home, iconName: 'home' },
        { name: 'Calculator', component: CalorieCalculator, iconName: 'calculator' },
        { name: 'Recipes', component: Recipes, iconName: 'book' },
        { name: 'FastingTime', component: FastingTimer, iconName: 'clock-o' },
        { name: 'Profile', component: Profile, iconName: 'user' },
    ];

    return (
        <Tab.Navigator activeColor="black" barStyle={{ backgroundColor: 'white' }}>
            {tabScreens.map((screen) => (
                <Tab.Screen
                    key={screen.name} // Don't forget to add a unique key
                    name={screen.name} // Use the name from the array
                    component={screen.component} // Use the component from the array
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <FontAwesome
                                name={screen.iconName as any}
                                size={24}
                                color={focused ? '#fff' : 'black'}
                            />

                        ),
                    }}
                />
            ))}
        </Tab.Navigator>
    );
}

export default HomeTabs;
