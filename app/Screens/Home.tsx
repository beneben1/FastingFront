import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    ActivityIndicator,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";

const Home = () => {
    const navigation = useNavigation() as any;

    const fadeAnim = new Animated.Value(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../assets/fasting.jpg")}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => FIREBASE_AUTH.signOut()}
                >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <Animated.View style={{ ...styles.intro, opacity: fadeAnim }}>
                    <View style={styles.textBox}>
                        <Text style={styles.title}>What is intermittent fasting?</Text>
                        <Text style={styles.text}>
                            Many diets focus on what to eat, but intermittent fasting is all
                            about when you eat. With intermittent fasting, you only eat during
                            a specific time. Research shows fasting for a certain number of
                            hours each day or eating just one meal a couple days a week may
                            have health benefits. Extra calories and less activity can mean a
                            higher risk of obesity, type 2 diabetes, heart disease and other
                            illnesses. Scientific studies are showing that intermittent
                            fasting may help reverse these trends.
                        </Text>
                    </View>
                </Animated.View>

                <Animated.View
                    style={{
                        ...styles.buttonContainer,
                        opacity: fadeAnim,
                        transform: [{ scale: fadeAnim }],
                    }}
                >
                    <TouchableOpacity
                        style={styles.getStartedButton}
                        onPress={() => {
                            navigation.navigate("Questions");
                            setIsLoading(true);
                            setTimeout(() => {
                                setIsLoading(false);
                            }, 1000);
                        }}
                    >
                        <Text style={styles.getStartedButtonText}>Get Started</Text>
                    </TouchableOpacity>

                    {isLoading && <ActivityIndicator />}
                </Animated.View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        width: "100%",
        height: "100%",
    },
    intro: {
        alignItems: "center",
        marginTop: 100,
    },
    textBox: {
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 40,
        alignItems: "center",
    },
    getStartedButton: {
        backgroundColor: "#00bfff",
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 3,
    },
    getStartedButtonText: {
        color: "#FFF",
        fontSize: 16,
    },
    logoutBtn: {
        position: "absolute",
        top: 40,
        left: 15,
        borderRadius: 25,
        backgroundColor: "#00bfff",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    logoutText: {
        color: "#FFF",
        fontSize: 16,
    },
});

export default Home;