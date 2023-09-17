import { View, ImageBackground, StyleSheet, SafeAreaView } from "react-native";
import React from "react";

const Dietplan12 = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require("../../../assets/fastingimages/12-12.jpg")}
                style={[styles.image]}
                resizeMode="contain" // or "cover"
            />
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
});

export default Dietplan12;