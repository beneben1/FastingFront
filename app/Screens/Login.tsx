import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    Button,
    KeyboardAvoidingView,
    TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithCredential,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

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
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue!</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholder="Email ID"
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
        backgroundColor: "#e0ffff",
        paddingTop: 50,
        paddingHorizontal: 16,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 8,
        color: "#333",
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
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 4,
        marginBottom: 16,
    },
    forgotPassword: {
        alignSelf: "flex-end",
    },
    forgotPasswordText: {
        color: "black",
    },
    signInButton: {
        backgroundColor: "#006400",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
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
        fontSize: 14,
        color: "#333",
    },
    signUpLink: {
        color: "#006400",
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