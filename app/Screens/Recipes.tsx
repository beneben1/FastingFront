import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import axios from 'axios';
import { CheckBox } from 'react-native-elements';

interface Recipe {
    id: number;
    name: string;
    ingredient: string;
    directions: string;
    nutrition_facts: string;
    protein_type: string;
    contains_carbs: boolean;
    image: string;
}

const Recipes = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [filterProteins, setFilterProteins] = useState<string[]>([]); // Array to store selected proteins
    const [filterVegetarian, setFilterVegetarian] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        // Fetch recipes from your Django API
        axios
          .get("https://fastingapp-back.onrender.com/recipes/")
          .then((response) => {
            // Update the recipes state with the fetched data
            setRecipes(response.data);
          })
          .catch((error) => {
            console.error("Error fetching recipes:", error);
          });
    }, []);

    const openRecipeDetail = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setModalVisible(true);
    };

    const toggleProteinFilter = (protein: string) => {
        // Check if the protein is already in the filters array
        if (filterProteins.includes(protein)) {
            // Remove it if it's already selected
            setFilterProteins(filterProteins.filter((p) => p !== protein));
        } else {
            // Add it to the filters array if not selected
            setFilterProteins([...filterProteins, protein]);
        }
    };

    const filterRecipes = (recipe: Recipe) => {
        if (
            (filterProteins.length > 0 && !filterProteins.includes(recipe.protein_type)) ||
            (filterVegetarian && !recipe.protein_type.toLowerCase().includes('vegetarian'))
        ) {
            return false;
        }

        return true;
    };

    return (
        <View style={styles.container}>
            <View style={styles.filters}>
                <Text style={styles.proteinTitle}>Protein Type:</Text>
                <View style={styles.proteinRow}>
                    <CheckBox
                        title="Chicken"
                        checked={filterProteins.includes('chicken')}
                        onPress={() => toggleProteinFilter('chicken')}
                    />
                    <CheckBox
                        title="Salmon"
                        checked={filterProteins.includes('salmon')}
                        onPress={() => toggleProteinFilter('salmon')}
                    />
                    <CheckBox
                        title="Beef"
                        checked={filterProteins.includes('beef')}
                        onPress={() => toggleProteinFilter('beef')}
                    />
                </View>
                <CheckBox
                    title="Vegetarian"
                    checked={filterVegetarian}
                    onPress={() => setFilterVegetarian(!filterVegetarian)}
                />
                <TouchableOpacity onPress={() => setFilterProteins([])}>
                    <Text style={styles.proteinTitle}>Clear Filters</Text>
                </TouchableOpacity>
            </View>
            {recipes.length === 0 ? (
                <Text>No recipes available.</Text>
            ) : (
                <FlatList
                    data={recipes.filter(filterRecipes)}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => openRecipeDetail(item)}>
                            <View style={styles.recipeItem}>
                                <Text style={styles.recipeName}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                {selectedRecipe ? (
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalHeader}>Recipe Details</Text>
                        {selectedRecipe.image && (
                            <Image
                                source={{ uri: selectedRecipe.image }}
                                style={styles.selectedRecipeImage}
                                resizeMode="cover"
                            />
                        )}


                        <Text style={styles.sectionHeader}>Ingredients:</Text>
                        <View style={styles.modalContent}>
                            {selectedRecipe.ingredient.split('\n').map((ingredient, index) => (
                                <Text style={styles.modalText} key={index}>{` ${ingredient}`}</Text>
                            ))}
                        </View>

                        <Text style={styles.sectionHeader}>Directions:</Text>
                        <View style={styles.modalContent}>
                            {selectedRecipe.directions.split('\n').map((direction, index) => (
                                <Text style={styles.modalText} key={index}>{` ${direction}`}</Text>
                            ))}
                        </View>

                        <Text style={styles.sectionHeader}>Nutrition Facts:</Text>
                        <View style={styles.modalContent}>
                            {selectedRecipe.nutrition_facts.split('\n').map((fact, index) => (
                                <Text style={styles.modalText} key={index}>{` ${fact}`}</Text>
                            ))}
                        </View>

                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        top: 50,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    filters: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    proteinRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    proteinTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        top: 2,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', // Center the modal content horizontally
        padding: 16,
    },
    selectedRecipeImage: {
        width: 100,
        height: 200,
        marginVertical: 8,
    },
    modalContent: {
        marginTop: 8,
    },
    modalText: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 8,
    },
    modalHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    closeButton: {
        fontSize: 18,
        color: 'blue',
        marginTop: 16,
        alignSelf: 'center',
    },
    recipeItem: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
    },
    recipeName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Recipes;
