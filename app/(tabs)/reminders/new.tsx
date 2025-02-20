import React from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import ReminderForm, { Reminder } from '../../../src/components/ReminderForm';
import NotificationService from '../../../src/services/NotificationService';

export default function NewReminderScreen() {
  const router = useRouter();

  const handleSaveReminder = async (reminder: Reminder) => {
    const notificationId = await NotificationService.scheduleNotification(reminder);
    const newReminder = { ...reminder, notificationId };

    try {
      const storedReminders = await AsyncStorage.getItem('reminders');
      const reminders = storedReminders ? JSON.parse(storedReminders) : [];
      const updatedReminders = [...reminders, newReminder];
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));

      // Return to the Reminders list
      router.replace('/(tabs)/reminders');
    } catch (error) {
      console.error('Error saving reminder', error);
      alert('There was a problem saving your reminder');
    }
  };

  const handleCancel = () => {
    // Cancel => Return to the Reminders list
    router.replace('/(tabs)/reminders');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Reminder</Text>
        <View style={{ width: 70 }} />
      </View>

      <ReminderForm onSave={handleSaveReminder} />
    </SafeAreaView>
  );
}

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
