import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

const PlanFast = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>16/8 Intermittent Fasting</Text>
            <ScrollView >
                <Image
                    source={require('`../../../assets/fastingimages/16-8.jpg')}
                    style={styles.image}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: 1024, // Adjust this width as needed
        height: 482, // Adjust this height as needed
    },
});

export default PlanFast;
