import React from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReminderForm from '../components/ReminderForm';
import NotificationService from '../services/NotificationService';

const NewReminderScreen = ({ navigation }) => {
  const handleSaveReminder = async (reminder) => {
    // Schedule notification
    const notificationId = await NotificationService.scheduleNotification(reminder);
    const newReminder = { ...reminder, notificationId };
    
    try {
      // Get existing reminders
      const storedReminders = await AsyncStorage.getItem('reminders');
      const reminders = storedReminders ? JSON.parse(storedReminders) : [];
      
      // Add new reminder
      const updatedReminders = [...reminders, newReminder];
      
      // Save to storage
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
      
      // Navigate back to home
      navigation.goBack();
    } catch (error) {
      console.error('Error saving reminder', error);
      alert('There was a problem saving your reminder');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Reminder</Text>
        <View style={{ width: 70 }} />
      </View>
      
      <ReminderForm onSave={handleSaveReminder} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007AFF',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancelButton: {
    color: '#fff',
    fontSize: 16,
    width: 70,
  },
});

export default NewReminderScreen;