import React from "react";
import {
    View,
    ImageBackground,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Dietplan16 = () => {
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require("../../../assets/fastingimages/16-8.jpg")}
                style={[styles.image]}
                resizeMode="contain" // or "cover"
            >
                <TouchableOpacity
                    style={[styles.backButton, { transform: [{ rotate: "90deg" }] }]}
                    onPress={handleBackPress}
                >
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        width: "100%",
        height: "100%",
        marginTop: 7,
        marginBottom: 0.5,
    },
    backButton: {
        position: "absolute",
        bottom: 20,
        left: 18,
        backgroundColor: "#00bfff", // Set a background color for the button
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
    },
    backButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Dietplan16;