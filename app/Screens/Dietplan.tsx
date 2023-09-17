import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from Expo icons
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    SafeAreaView,
    ScrollView,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import React from "react";

export default function App() {
    const [orientation, setOrientation] =
        useState<ScreenOrientation.Orientation>();

    useEffect(() => {
        let isMounted = true;

        const changeScreenOrientation = async () => {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
            );
        };

        (async () => {
            await changeScreenOrientation();
        })();

        return () => {
            isMounted = false;
            if (isMounted) {
                ScreenOrientation.unlockAsync();
            }
        };
    }, []);

    const renderGrid = () => {
    const days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
    const timeSlots = [
      "00:00-04:00",
      "04:00-08:00",
      "08:00-12:00",
      "12:00-16:00",
      "16:00-20:00",
      "20:00-24:00",
    ];
    const rows = 6;
    const columns = 7;
    const grid = [];

        // Create the row for day labels
    const dayLabels = days.map((day, index) => (
      <View key={index} style={{ flex: 1, alignItems: "center" }}>
        <Text>{day}</Text>
      </View>
    ));
    const timeLabels = timeSlots.map((timeSlot, index) => (
      <View key={index} style={{ alignItems: "center", marginTop: 10 }}>
        <Text>{timeSlot}</Text>
      </View>
    ));

    grid.push(
      <View
        key="dayLabels"
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          borderColor: "black",
          marginTop: 30,
        }}
      >
        {dayLabels}
      </View>
    );

        // Create the grid of input fields and pickers
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < columns; j++) {
                row.push(
                    <View
                        key={j}
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: "black",
                            padding: 1,
                        }}
                    >
                        <TextInput placeholder="Action" />
                        <Picker>
                            <Picker.Item label="Eating" value="Eating" />
                            <Picker.Item label="Fasting" value="Fasting" />
                        </Picker>
                    </View>
                );
            }
            grid.push(
                <View key={i} style={{ flexDirection: "row" }}>
                    {row}
                </View>
            );
        }

        return grid;
    };

    const changeOrientation = async (
        newOrientation: ScreenOrientation.OrientationLock
    ) => {
        console.log("newOrientation: ", newOrientation);
        await ScreenOrientation.lockAsync(newOrientation);
    };

    return (
        <ScrollView>
            <SafeAreaView style={styles.container}>
                <View style={styles.gridContainer}>{renderGrid()}</View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.btn, { marginTop: 15 }]}
                        onPress={() =>
                            changeOrientation(ScreenOrientation.OrientationLock.PORTRAIT_UP)
                        }
                    >
                        <Ionicons name="phone-portrait" size={50} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() =>
                            changeOrientation(
                                ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
                            )
                        }
                    >
                        <Ionicons name="phone-landscape" size={50} color="black" />
                    </TouchableOpacity>
                </View>
                <StatusBar style="auto" />
            </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    gridContainer: {
        flex: 3, // Adjust as needed
        flexDirection: "column",
        width: "100%",
        justifyContent: "space-between",
    },
    buttonContainer: {
        flex: 1, // Adjust as needed
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        marginRight: 10,
    },
    btn: {
        padding: 10,
    },
});
