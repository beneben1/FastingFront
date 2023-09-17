import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Modal } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../../FirebaseConfig";
import { Button, TextInput } from "react-native-paper";
import { Platform } from "react-native";
import { Picker } from '@react-native-picker/picker';
import Loader from "../../Loaders/Loader";
import { addCalories } from "./CalorieDataStore";

export interface Food {
    Category: string;
    Food: string;
    Grams: number;
    Calories: number;
    Carbs: number;
    Protein: number;
    Fat: number;
    Fiber: number;
    Measure: string;
}

const categories = [
    'Dairy products',
    'Fats, Oils, Shortenings',
    'Meat, Poultry',
    'Fish, Seafood',
    'Vegetables A-E',
    'Vegetables F-P',
    'Vegetables R-Z',
    'Fruits A-F',
    'Fruits G-P',
    'Fruits R-Z',
    'Breads, cereals, fastfood,grains',
    'Soups',
    'Desserts, sweets',
    'Jams, Jellies',
    'Desserts, sweets',
    'Seeds and Nuts',
    'Drinks,Alcohol, Beverages'

];
const CalorieCalculator = () => {
    const foodCollection = collection(FIREBASE_DB, "nutrients_csvfile");
    const [foodData, setFoodData] = useState<Food[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loader, setloader] = useState(true);
    const [servingSize, setServingSize] = useState<number>(0);

    const handleServingChange = (text: string) => {
        const grams = parseFloat(text);
        if (!isNaN(grams)) {
            setServingSize(grams);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(foodCollection);

            if (!querySnapshot.empty) {
                const data = querySnapshot.docs.map((doc) => doc.data() as Food);
                setFoodData(data);
                setloader(false)
            }
        };

        fetchData();
    }, []);

    const filteredData = foodData
        .filter((item) =>
            item.Food.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((item) => {
            if (selectedCategory === "") {
                return true;
            }
            return item.Category === selectedCategory;
        });

    const handleFoodPress = (item: Food) => {
        setSelectedFood(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const filteredFoodData = foodData.filter((item) =>
        item.Food.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const sortedFoodData = filteredFoodData.sort((a, b) =>
        a.Food.localeCompare(b.Food)
    );
    const handleAddToDailyCalories = () => {
        if (selectedFood && servingSize > 0) {
            const caloriesToAdd = (selectedFood.Calories * servingSize) / selectedFood.Grams;
            addCalories(caloriesToAdd);
            closeModal();
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                label="Search food..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />
            <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue: React.SetStateAction<string>) => setSelectedCategory(itemValue)}
            >
                <Picker.Item label="All Categories" value="" />
                {categories.map(cat => (
                    <Picker.Item key={cat} label={cat} value={cat} />
                ))}
            </Picker>
            <View>
                {loader ? (
                    <Loader />
                ) : (
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={styles.headerRow}>
                                <Text style={styles.headerText}>Food</Text>
                                <Text style={styles.headerText}>Calories</Text>
                            </View>

                            {filteredData.map(item => (
                                <TouchableOpacity
                                    key={item.Food}
                                    style={styles.dataRow}
                                    onPress={() => handleFoodPress(item)}
                                >
                                    <Text style={styles.dataText}>{item.Food}</Text>
                                    <Text style={styles.dataText}>{item.Calories}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeModal}
                        >
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>

                        {selectedFood && (
                            <>
                                <Text style={styles.modalFoodText}>{selectedFood.Food}</Text>
                                <Text>Grams: {selectedFood.Grams}</Text>
                                <Text>Measure: {selectedFood.Measure}</Text>
                                <Text>Calories: {selectedFood.Calories}</Text>
                                <Text>Carbs: {selectedFood.Carbs}</Text>
                                <Text>Protein: {selectedFood.Protein}</Text>
                                <Text>Fat: {selectedFood.Fat}</Text>
                                <Text>Fiber: {selectedFood.Fiber}</Text>
                                <TextInput
                                    style={styles.servingInput}
                                    label="Serving (grams)"
                                    keyboardType="numeric"
                                    onChangeText={(text) => handleServingChange(text)}
                                />
                            </>
                        )}
                        <TouchableOpacity
                            style={styles.addToCaloriesButton}
                            onPress={handleAddToDailyCalories}
                        >
                            <Text style={styles.buttonText}>Add to Daily Calories</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

        </View >
    );
};

export default CalorieCalculator;
const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        paddingTop: Platform.OS === "ios" ? 50 : 0,
        paddingHorizontal: 5,
    },
    searchBar: {
        marginBottom: 8,
    },
    searchContainer: {
        marginBottom: 16,
    },
    picker: {
        height: 50,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    dataContainer: {
        flexDirection: "column",
    },
    headerRow: {
        flexDirection: "row",
        backgroundColor: "#f0f0f0",
        paddingVertical: 8,
        marginVertical: 1,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    headerText: {
        flex: 1,
        paddingHorizontal: 4,
        fontSize: 12,
        textTransform: "uppercase",
        fontWeight: "bold",
        textAlign: "center",
    },
    dataRow: {
        flexDirection: "row",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        textAlign: "center",
        backgroundColor: "#fafafa",
    },
    dataText: {
        flex: 1,
        paddingHorizontal: 4,
        fontSize: 12,
        textAlign: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        maxHeight: "80%",
        position: "relative",
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    closeButtonText: {
        fontSize: 18,
    },
    modalFoodText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    servingInput: {
        marginTop: 10,
        marginBottom: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        fontSize: 16,
    },

    addToCaloriesButton: {
        backgroundColor: "#007bff",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },

    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});