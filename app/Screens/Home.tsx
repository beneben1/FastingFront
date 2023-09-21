import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    ActivityIndicator,
    TouchableOpacity,
    ImageBackground,
    Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
const Logo = require('../../assets/fastingproslogo.png');
import { SimpleLineIcons } from '@expo/vector-icons';

const Home = () => {
    const navigation = useNavigation() as any;
    const fadeAnim = new Animated.Value(0);
    const translateYTitle = new Animated.Value(0);
    const translateYText = new Animated.Value(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(translateYTitle, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(translateYText, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, translateYTitle, translateYText]);
    return (
        <>
        <View style={styles.container}>
            <Image
                source={Logo}
                style={{ width: 400, height: 280, marginTop: 40 ,top: 160}}
                resizeMode="contain" // or "cover" based on your design
            />

            <TouchableOpacity
                style={styles.logoutBtn}
                onPress={() => FIREBASE_AUTH.signOut()}
            >
                <SimpleLineIcons name="logout" size={24} color="black" />
            </TouchableOpacity>

            <Animated.View
                style={{
                    ...styles.intro,
                    opacity: fadeAnim,
                    transform: [{ translateY: translateYTitle }],
                }}
            >
                <Text style={styles.title}>What is intermittent fasting?</Text>
            </Animated.View>
            <Animated.View
                style={{
                    ...styles.textBox,
                    opacity: fadeAnim,
                    transform: [{ translateY: translateYText }],
                }}
            >
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
                    } }
                >
                    <Text style={styles.getStartedButtonText}>Get Started</Text>
                </TouchableOpacity>

                {isLoading && <ActivityIndicator />}
            </Animated.View>
            </View>
            </>

        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        bottom: 60
    },
    intro: {
        alignItems: "center",
        marginTop: 100,
    },
    textBox: {
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 40,
        marginBottom: 100,
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
        marginTop: 60,
        alignItems: "center",
    },
    getStartedButton: {
        backgroundColor: "#00bfff",
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 3,
        bottom: 65
    },
    getStartedButtonText: {
        color: "#FFF",
        fontSize: 16,
        
    },
    logoutBtn: {
        position: "absolute",
        top: 100,
        left: 15,
        borderRadius: 10,
        backgroundColor: 'lightbluesky',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    logoutText: {
        color: "#FFF",
        fontSize: 16,
    },
});

export default Home;