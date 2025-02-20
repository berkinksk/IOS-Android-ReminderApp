import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export const getTabScreenOptions = () => ({
  tabBarLabel: 'Home',
  title: 'Home Page',
});

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* About This App Box */}
      <View style={styles.box}>
        <Text style={styles.boxTitle}>About This App</Text>
        <Text style={styles.boxText}>
          This is a simple, user-friendly Reminder app designed to help you keep track of your tasks and events. Whether it’s daily chores or important deadlines, this app ensures you won’t miss a thing.
        </Text>
      </View>
      
      {/* User Guide Box */}
      <View style={styles.box}>
        <Text style={styles.boxTitle}>How to Use</Text>
        <Text style={styles.boxText}>
          1. Tap the <Text style={styles.bold}>Reminders</Text> tab to see your current reminders.
        </Text>
        <Text style={styles.boxText}>2. Press the "+" button to create a new reminder.</Text>
        <Text style={styles.boxText}>3. Enter a title, description, and choose the date/time.</Text>
        <Text style={styles.boxText}>
          4. Set how often you want to be reminded—once, daily, weekly, or custom days.
        </Text>
        <Text style={styles.boxText}>5. Attach a photo if you like, and save your reminder.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  box: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  boxTitle: {
    fontSize: 24,         // Bigger title
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  boxText: {
    fontSize: 18,         // Larger text for readability
    lineHeight: 26,
    marginBottom: 8,
    color: '#555',
  },
  bold: {
    fontWeight: 'bold',
    color: '#007AFF',     // Highlight "Reminders" in blue
  },
});
