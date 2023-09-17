import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { StyleSheet } from 'react-native';
import { Modal } from 'react-native';
import { FIREBASE_APP, } from '../../FirebaseConfig';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const FastingTimer = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTiming, setSelectedTiming] = useState<string>("");
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
    const fastingTimings = {
        "16-8": 16 * 3600,
        "12-12": 12 * 3600,
        "14-10": 14 * 3600,
    };
    const [countdownDuration, setCountdownDuration] = useState<number>(0);
    const [previewDuration, setPreviewDuration] = useState<number | null>(null);
    const db = getFirestore(FIREBASE_APP);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    // Load timer data from Firestore during app initialization
    useEffect(() => {
        const timerDocRef = doc(db, 'timers', 'user1'); // Reference to the 'user1' document in 'timers' collection

        getDoc(timerDocRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data) {
                        setSelectedTiming(data.selectedTiming);
                        setCountdownDuration(data.countdownDuration || 0); // Ensure the duration is set, default to 0 if not present
                        setIsTimerRunning(false); // Ensure the timer is not running initially
                    }
                }
            })
            .catch((error) => {
                console.error('Error loading timer data:', error);
            });
    }, []);

    // Save selected timing and timer state to Firestore when they change
    useEffect(() => {
        if (selectedTiming || countdownDuration > 0) {
            const timerDocRef = doc(db, 'timers', 'user1'); // Reference to the 'user1' document in 'timers' collection
            const data = {
                selectedTiming,
                countdownDuration,
            };

            setDoc(timerDocRef, data)
                .then(() => {
                    console.log('Timer data saved to Firestore!');
                })
                .catch((error) => {
                    console.error('Error saving timer data:', error);
                });
        }
    }, 
    [selectedTiming, countdownDuration]);
    useEffect(() => {
        if (selectedTiming) {
            setPreviewDuration(fastingTimings[selectedTiming as keyof typeof fastingTimings]);
            setCountdownDuration(0); // Reset countdown when an option is selected
        }
    }, [selectedTiming]);

    return (
        <View style={styles.container}>
            <View style={styles.timingSection}>
                <Text style={styles.timerTitle}>Fasting Timer</Text>

                <CountdownCircleTimer
                    key={countdownDuration}
                    isPlaying={isTimerRunning}
                    duration={countdownDuration}
                    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                    colorsTime={[7, 5, 2, 0]}
                    onComplete={() => {
                        setIsTimerRunning(false);
                        setSelectedTiming("");
                        setPreviewDuration(null);
                        setCountdownDuration(0);
                        
                    }}

                    size={300}
                >
                    {({ remainingTime }) => (
                        <Text style={styles.timerText}>
                            {`${Math.floor(remainingTime / 3600)}:${Math.floor((remainingTime % 3600) / 60)
                                .toString()
                                .padStart(2, "0")}:${(remainingTime % 60).toString().padStart(2, "0")}`}
                        </Text>
                    )}
                </CountdownCircleTimer>

                {isTimerRunning ? (
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={() => {
                            setIsTimerRunning(false);
                            setCountdownDuration(previewDuration || 0); // Reset countdown duration
                        }}
                    >
                        <Text style={styles.resetButtonText}>Reset</Text>
                    </TouchableOpacity>
                ) : (
                    <View>
                        <View style={styles.timingButtonsRow}>
                            {Object.keys(fastingTimings).map((timing) => (
                                <TouchableOpacity
                                    key={timing}
                                    style={[
                                        styles.timingButton,
                                        selectedTiming === timing ? styles.selectedTimingButton : null,
                                    ]}
                                    onPress={() => setSelectedTiming(timing)}
                                >
                                    <Text style={styles.timingText}>{timing}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {selectedTiming && (
                            <TouchableOpacity style={styles.startButton} onPress={() => {
                                setIsTimerRunning(true);
                                setCountdownDuration(previewDuration || 0);
                            }}>
                                <Text style={styles.startButtonText}>Start Fast</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                <View>
                    <TouchableOpacity onPress={toggleModal} style={styles.buttonContainer}>
                        <Text style={styles.buttonTitle}>What is fasting hours?</Text>
                    </TouchableOpacity>

                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        onRequestClose={toggleModal}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalText}>
                                    Intermittent fasting involves alternating between periods of fasting and eating. The most common intermittent fasting methods differ in the ratio of fasting hours to eating hours.
                                </Text>

                                <Text style={[styles.modalTitle]}>1. 16:8</Text>
                                <Text style={styles.modalText}>- Fasting for 16 hours and eating within an 8 hour window</Text>
                                <Text style={styles.modalText}>- Triggers autophagy after 16 hours of fasting</Text>
                                <Text style={styles.modalText}>- May lead to more weight loss</Text>
                                <Text style={styles.modalText}>- Best for achieving full benefits of intermittent fasting</Text>

                                <Text style={[styles.modalTitle]}>2. 14:10</Text>
                                <Text style={styles.modalText}>- Fasting for 14 hours and eating within a 10 hour window</Text>
                                <Text style={styles.modalText}>- Some weight loss</Text>
                                <Text style={styles.modalText}>- Lowered blood pressure and cholesterol levels</Text>
                                <Text style={styles.modalText}>- Better sleep and energy</Text>

                                <Text style={[styles.modalTitle]}>3. 12:12</Text>
                                <Text style={styles.modalText}>- Fasting for 12 hours and eating within a 12 hour window</Text>
                                <Text style={styles.modalText}>- Easy to follow for beginners</Text>
                                <Text style={styles.modalText}>- May improve brain health</Text>
                                <Text style={styles.modalText}>- Slower weight loss results</Text>

                                <Text style={styles.modalText}>
                                    Longer fasting windows like 16:8 offer the greatest potential benefits but may be harder to stick to. Shorter fasts of 12:12 or 14:10 are more gentle ways to start intermittent fasting.
                                </Text>

                                <Text style={styles.modalText}>
                                    The best plan depends on your lifestyle, preferences, and goals. Most importantly, consult your healthcare provider before starting any new diet plan.
                                </Text>
                                <TouchableOpacity onPress={toggleModal} style={styles.buttonContainer}>
                                    <Text style={styles.buttonTitle}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
    },
    buttonContainer: {
        fontSize: 45,
        fontWeight: 'bold',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
        backgroundColor: '#007AFF',
        top: 15,
    },
    buttonTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },

    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 4
    },

    modalText: {
        fontSize: 13,
        lineHeight: 24,
        fontWeight: '400',
        color: '#333333'
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    },
    timingSection: {
        marginTop: 60,
        alignItems: "center",
    },
    timerTitle: {
        fontSize: 45, // Adjust font size as needed
        fontWeight: "bold",
        marginBottom: 40, // Add some spacing below the title
    },
    timingButtonsRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30
    },

    timingButton: {
        backgroundColor: "#DDDDDD",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 10, // Add some spacing between buttons
    },
    selectedTimingButton: {
        backgroundColor: "#007AFF", // Change the background color for the selected timing
    },
    timingText: {
        fontSize: 25,
        color: "black", // Adjust the text color
    },
    startButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    startButtonText: {
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
    },
    timerText: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#000000",
    },
    resetButton: {
        backgroundColor: "#FF3B30",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 30
    },
    resetButtonText: {
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
    },
});

export default FastingTimer;