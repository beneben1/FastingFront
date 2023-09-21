import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { Image } from 'react-native';

const Logo = require('../../../assets/fastingproslogo.png');

const Login = () => {
    const navigation = useNavigation() as any;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error: any) {
            console.log(error);
            alert("Sign In failed: " + "Username or password is incorrect");
        } finally {
            setLoading(false);
        }
    };
    // Function to send a password reset email
    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent. Check your inbox.");
        } catch (error) {
            console.error("Error sending reset email:", error);
            alert("Failed to send reset email. Check your email address.");
        }
    };

    return (
        <View style={styles.container}>
            <View >
                <Image
                    source={Logo}
                    style={{ width: 400, height: 250 ,marginTop:10 }}
                    resizeMode="contain" // or "cover" based on your design
                />
            </View>
            <Text style={styles.title}>Login</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholder="Email"
                />
                <TextInput
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    value={password}
                    placeholder="Password"
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => resetPassword(email)}
                >
                    <Text style={styles.forgotPasswordText}>Forget Password?</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.signInButton} onPress={signIn}>
                <Text style={styles.signInButtonText}>Sign in</Text>
            </TouchableOpacity>
            <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Dont have an accout yet? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                    <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 30,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 27,
        fontWeight: "600",
        marginBottom: 20,
        color: "#333",
        fontStyle:'italic'

    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 32,
        width: "100%",
    },
    input: {
        backgroundColor: "lightgrey",
        padding: 25,
        borderRadius: 4,
        marginBottom: 16,
        fontStyle: "italic",
        fontWeight: 'bold',
        
    },
    forgotPassword: {
        alignSelf: "flex-end",
    },
    forgotPasswordText: {
        color: "black",
    },
    signInButton: {
        backgroundColor: "lightskyblue",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 16,
    },
    signInButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    signUpContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    signUpText: {
        fontSize: 16,
        color: "#333",
    },
    signUpLink: {
        color: "lightskyblue",
        fontWeight: "bold",
    },
    googleSignInButton: {
        backgroundColor: "#006400",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 50,
    },
});

export default Login;