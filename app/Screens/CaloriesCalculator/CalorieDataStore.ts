// CalorieDataStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const CALORIE_STORAGE_KEY = "dailyCalories";

export const getDailyCalories = async () => {
    try {
        const calories = await AsyncStorage.getItem(CALORIE_STORAGE_KEY);
        return calories ? parseInt(calories) : 0;
    } catch (error) {
        console.error("Error getting daily calories:", error);
        return 0;
    }
};

export const addCalories = async (caloriesToAdd: number) => {
    try {
        const currentCalories = await getDailyCalories();
        const newCalories = currentCalories + caloriesToAdd;
        await AsyncStorage.setItem(CALORIE_STORAGE_KEY, newCalories.toString());
    } catch (error) {
        console.error("Error adding calories:", error);
    }
};

export const resetDailyCalories = async () => {
    try {
        await AsyncStorage.removeItem(CALORIE_STORAGE_KEY);
    } catch (error) {
        console.error("Error resetting daily calories:", error);
    }
};
