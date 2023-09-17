import React, { Component } from "react";
import {
    Text,
    View,
    StyleSheet,
    Animated,
    Easing,
    TouchableOpacity,
} from "react-native";
import BouncingPreloader from 'react-native-bouncing-preloader';

const icons = [
    require("../../assets/heart.png"),
    require("../../assets/dumbbell.png"),
]

export default class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <BouncingPreloader
                    icons={icons}
                    leftDistance={150}
                    rightDistance={150}
                    speed={1500}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        width: "100%",
        height: "100%",
    },
});