import React, { Component, useState } from "react";
import {
    View,
    Text,
    Button,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';


const QuestionsScreen: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [age, setAge] = useState<number>(25);
    const [height, setHeight] = useState<number>(160);
    const [weight, setWeight] = useState<number>(70);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const fastingOptions = [
        { label: "16-8", value: "16-8" },
        { label: "14-10", value: "14-10" },
        { label: "12-12", value: "12-12" },
    ];
    const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
    const isNameValid: boolean = /^[A-Za-z\s]+$/.test(name);
    const navigation = useNavigation() as any;

    const selectOption = (value: string) => {
        setSelectedOption(value);
    };

    const handleSubmit = async () => {
        if (
            name.trim() === "" ||
            isNaN(age) ||
            isNaN(height) ||
            isNaN(weight) ||
            !selectedOption
        ) {
            console.log("Alert triggered");
            // Handle validation or show an alert here
        } else {
            const userData = {
                name,
                age,
                height,
                weight,
                fastingOption: selectedOption, // Combine selected options into a string
            };

            // Save user data in AsyncStorage
            try {
                await AsyncStorage.setItem("userData", JSON.stringify(userData));
                await AsyncStorage.setItem("fastingOption", selectedOption);
                navigation.navigate("Profile");
                console.log(userData);

            } catch (error) {
                console.error("Error saving data to AsyncStorage:", error);
            }
        }

    };

    const hideAlert = () => {
        setAlertVisible(false);
    };


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.header}>Build Your Profile</Text>
                <View style={styles.questionsContainer}>
                    <View style={styles.questionBox}>
                        <Text style={styles.questionText}>What is your name?</Text>
                        <TextInput
                            style={[styles.input, !isNameValid && styles.inputError]}
                            placeholder="Your name"
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                        {!isNameValid && (
                            <Text style={styles.validationError}>
                                Please enter a valid name
                            </Text>
                        )}
                    </View>

                    <View style={styles.questionBox}>
                        <Text style={styles.questionText}>How old are you?</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={age}
                            onValueChange={(value) => setAge(value)}
                        />
                        <Text style={styles.sliderValue}>{age} years</Text>
                    </View>

                    <View style={styles.questionBox}>
                        <Text style={styles.questionText}>Select your height:</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={100}
                            maximumValue={220}
                            step={1}
                            value={height}
                            onValueChange={(value) => setHeight(value)}
                        />
                        <Text style={styles.sliderValue}>{height.toFixed(0)} cm</Text>
                    </View>

                    <View style={styles.questionBox}>
                        <Text style={styles.questionText}>What is your weight:</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={40}
                            maximumValue={150}
                            step={1}
                            value={weight}
                            onValueChange={(value) => setWeight(value)}
                        />
                        <Text style={styles.sliderValue}>{weight.toFixed(0)} kg</Text>
                    </View>

                    <View style={styles.questionBox}>
                        <Text style={styles.questionText}>
                            Choose your fasting time preference:
                        </Text>
                        <View style={styles.optionContainer}>
                            {fastingOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    onPress={() => selectOption(option.value)}
                                    style={[
                                        styles.radioContainer,
                                        selectedOption === option.value && styles.selectedRadio,
                                    ]}
                                >
                                    <Text>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <Button title="Submit" onPress={handleSubmit} />
                </View>
            </ScrollView>

            <Modal isVisible={isAlertVisible} backdropOpacity={0.5}>
                <View style={styles.alertContainer}>
                    <Text style={styles.alertText}>
                        Please fill in all the answers.
                    </Text>
                    <TouchableOpacity style={styles.okButton} onPress={hideAlert}>
                        <Text style={styles.okButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
        backgroundColor: "white",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        marginTop: 25,
        textAlign: "center",
    },
    scrollContainer: {
        flex: 1,
    },
    questionsContainer: {
        backgroundColor: "#FFF",
        padding: 10,
        borderRadius: 10,
        borderColor: "#CCC",
    },
    questionBox: {
        backgroundColor: "#FFF",
        padding: 16,
        marginBottom: 16,
        borderRadius: 10,
        borderColor: "#CCC",
    },
    questionText: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: "#CCC",
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
    },
    inputError: {
        borderColor: "red",
    },
    validationError: {
        color: "red",
        fontSize: 14,
        marginTop: 4,
    },
    slider: {
        height: 40,
    },
    sliderValue: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 8,
    },
    picker: {
        marginTop: -50,
        borderColor: "#CCC",
    },
    alertContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 16,
        alignItems: "center",
    },
    alertText: {
        fontSize: 18,
        marginBottom: 16,
        textAlign: "center",
    },
    okButton: {
        backgroundColor: "#00bfff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: "center",
    },
    okButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    optionContainer: {
        flexDirection: "row", // Display options in a row
        justifyContent: "space-between",
        
    },
    radioContainer: {
        flex: 1, // Make each option take up equal space in the row
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    selectedRadio: {
        backgroundColor: "#00bfff",
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 30,
        paddingLeft: 20,

    },
});

export default QuestionsScreen;