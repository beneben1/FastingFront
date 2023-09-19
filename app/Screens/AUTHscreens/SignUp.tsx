import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";

const SignUp = () => {
    const navigation = useNavigation() as any;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log(response);
        } catch (error: any) {
            console.log(error);
            alert("Sign In failed:" + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hello friends</Text>
        <Text style={styles.subtitle}>Please Sign up to continue!</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
          />
          <TextInput
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder="Password"
          />
          <TextInput
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            placeholder="Confirm Password"
          />
        </View>
        <TouchableOpacity style={styles.signUpButton} onPress={signUp}>
          <Text style={styles.signUpButtonText}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.button}
        >
          <Text style={styles.text}>Go back, I have an account!</Text>
        </TouchableOpacity>
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
  signUpButton: {
    backgroundColor: "#006400",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  signUpButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#006400",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  text: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
});

export default SignUp;