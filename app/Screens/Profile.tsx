import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Block } from "galio-framework";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDailyCalories, resetDailyCalories } from "./CalorieDataStore";
import { useIsFocused } from "@react-navigation/native";

const BMIImage = require("../../assets/body-mass-index.jpg");

const ProfileScreen: React.FC = () => {
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [fastMethod, setFastMethod] = useState('16-8');
    const [dailyCalories, setDailyCalories] = useState(0);
    const [key, setKey] = useState(Date.now());
    const isFocused = useIsFocused();
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [selectedFoodItems, setSelectedFoodItems] = useState<{ food: string; calories: number }[]>([]);
    const [userData, setUserData] = useState<any>({ name: "", age: 0, height: 0, weight: 0 });
    const [bmi, setBMI] = useState<number | null>(null);
    
    useEffect(() => {
        // Calculate BMI
        if (userData.height && userData.weight) {
            const heightInMeters = userData.height / 100;
            const bmiValue = userData.weight / (heightInMeters * heightInMeters);
            setBMI(bmiValue);
        }
    }, [userData]);
    
    useEffect(() => {
        if (isFocused) {
            (async () => {
                const calories = await getDailyCalories();
                setDailyCalories(calories);
            })();
        }
    }, [isFocused]);

    const handleChooseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const newImageUri = result.assets[0].uri;

            // Save the new image URI to AsyncStorage
            try {
                setSelectedImages([newImageUri]); // Replace existing images with new image
                await AsyncStorage.setItem("selectedImages", JSON.stringify([newImageUri]));
            } catch (error) {
                console.log("Error storing image:", error);
            }
        }
    };

    const loadSavedImages = async () => {
        try {
            const storedImages = await AsyncStorage.getItem("selectedImages");
            if (storedImages) {
                setSelectedImages(JSON.parse(storedImages));
            }
        } catch (error) {
            console.log("Error loading images:", error);
        }
    };

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            setHasCameraPermission(status === "granted");
            loadSavedImages(); // Load saved images when component mounts

            // Load user data from AsyncStorage
            try {
                const userDataJson = await AsyncStorage.getItem("userData");
                if (userDataJson) {
                    const parsedUserData = JSON.parse(userDataJson);
                    setUserData(parsedUserData);
                }
            } catch (error) {
                console.log("Error loading user data from AsyncStorage:", error);
            }
        })();
    }, [isFocused]);

    const handleTakePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const newImageUri = result.assets[0].uri;
            setSelectedImages([...selectedImages, result.assets[0].uri]);

            try {
                setSelectedImages([newImageUri]); // Replace existing images with new image
                await AsyncStorage.setItem("selectedImages", JSON.stringify([newImageUri]));
            } catch (error) {
                console.log("Error storing image:", error);
            }
        }
    };





    useEffect(() => {
        // Fetch and set the daily calorie intake each time the component is rendered
        const fetchDailyCalories = async () => {
            const calories = await getDailyCalories();
            setDailyCalories(calories);
        };
        fetchDailyCalories();
    }, [key]); // Add 'key' as a dependency

    const handleResetDailyCalories = () => {
        resetDailyCalories();
        setDailyCalories(0);
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.topSection}>
                <TouchableOpacity onPress={handleChooseImage}>
                    <Block style={styles.imageContainer}>
                        {/* Display selected image or default icon */}
                        {selectedImages.length > 0 ? (
                            selectedImages.map((imageUri, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: imageUri }}
                                    style={styles.squareImage}
                                />
                            ))
                        ) : (
                            <Text>Select Image</Text>
                        )}
                    </Block>
                </TouchableOpacity>
                <View style={styles.photoOptions}>
                    <View style={styles.iconBackground}>
                        <TouchableOpacity onPress={handleChooseImage}>
                            <MaterialIcons name="photo-library" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconBackground}>
                        <TouchableOpacity onPress={handleTakePhoto}>
                            <MaterialIcons name="photo-camera" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.middleSection} contentContainerStyle={styles.middleContent}>
                    <View style={styles.detailsSection}>
                        <Text style={styles.welcomeText}>Welcome, {userData.name}!</Text>
                        <Text style={styles.userDetail}>Age: {userData.age} years</Text>
                        <Text style={styles.userDetail}>Height: {userData.height} cm</Text>
                        <Text style={styles.userDetail}>Weight: {userData.weight} kg</Text>
                        {bmi !== null && (
                            <View style={styles.bmiSection}>
                                <Text style={styles.bmiText}>Your BMI is: {bmi.toFixed(2)}</Text>
                                {BMIImage && <Image source={BMIImage} style={styles.bmiImage} />}
                            </View>
                        )}
                    </View>

                    <View style={styles.calorieContainer}>
                        <Text style={styles.calorieText}>Daily Calorie Intake:</Text>
                        <Text style={styles.calorieValue}>{dailyCalories}</Text>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={handleResetDailyCalories}
                        >
                            <Text style={styles.resetButtonText}>Reset Daily Calories</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <ScrollView
                    style={styles.scrollSection}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.emptySection}>
                        {/* ... (content for generated recipes) */}
                    </View>
                </ScrollView>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
    },
    topSection: {
        alignItems: "center",
        marginBottom: 10,
    },
    middleSection: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        paddingHorizontal: 16,
        paddingVertical: 24,
        top: 20,
    },
    middleContent: {
        alignItems: "center",
    },
    detailsSection: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 16,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bmiSection: {
        alignItems: "center",
        marginTop: 16,
    },
    bmiText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    bmiImage: {
        width: 300, // Adjust the width as needed
        height: 200, // Adjust the height as needed
        resizeMode: "contain", // Ensure the image fits within the container
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    userDetail: {
        fontSize: 18,
        marginBottom: 12,

    },
    iconBackground: {
        width: 40,
        height: 40,
        borderRadius: 20, // Makes it a circle
        backgroundColor: 'gray', // Set the background color to gray
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },

    emptySection: {
        marginBottom: 24,
    },
    graphSection: {
        alignItems: "center",
    },
    usernameText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    photoOptions: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 116,
        left: 140
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    imageContainer: {
        width: '91%',
        height: 70,
        borderRadius: 50,
        backgroundColor: "#e5e5e5",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    scrollSection: {
        flex: 1,
        marginBottom: 24,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 24,
    },
    squareImage: {
        width: '120%',// Make image width 100% of the container width

        aspectRatio: 1, // Maintain 1:1 aspect ratio to make it square
        borderRadius: 0, // No border radius to make it square
    },
    calorieContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 2,
        padding: 10,
        borderRadius: 10,
        marginTop: 15,
    },
    calorieText: {
        fontSize: 16,
        fontWeight: "bold",
        bottom: 9,
    },
    calorieValue: {
        fontSize: 20,
        alignItems: "center",
        fontWeight: "bold",
    },
    resetButton: {
        backgroundColor: "#ff6b6b",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        top: 9
    },
    resetButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
export default ProfileScreen;