import React from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

import ReminderForm, { Reminder } from '../../../src/components/ReminderForm';
import NotificationService from '../../../src/services/NotificationService';

export default function EditReminderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // "reminder" is passed as a JSON string
  const reminderStr = params.reminder as string;
  const reminder: Reminder = JSON.parse(reminderStr);

  const handleSaveReminder = async (updatedReminder: Reminder) => {
    try {
      if (reminder.notificationId) {
        await NotificationService.cancelNotification(reminder.notificationId);
      }
      const notificationId = await NotificationService.scheduleNotification(updatedReminder);

      const storedReminders = await AsyncStorage.getItem('reminders');
      let reminders = storedReminders ? JSON.parse(storedReminders) : [];
      reminders = reminders.map((item: Reminder) =>
        item.id === reminder.id ? { ...updatedReminder, notificationId } : item
      );
      await AsyncStorage.setItem('reminders', JSON.stringify(reminders));
      router.replace('/(tabs)/reminders'); // Return to the Reminders list
    } catch (error) {
      console.error('Error updating reminder', error);
      alert('There was a problem updating your reminder');
    }
  };

  const handleCancel = () => {
    router.replace('/(tabs)/reminders');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Cancel => absolute path to reminders list */}
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Reminder</Text>
        <View style={{ width: 70 }} />
      </View>
      <ReminderForm initialValues={reminder} onSave={handleSaveReminder} />
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
