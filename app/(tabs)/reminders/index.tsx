import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

import ReminderList from '../../../src/components/ReminderList';
import NotificationService from '../../../src/services/NotificationService';
import { Reminder } from '../../../src/components/ReminderForm';

export default function RemindersIndex() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem('reminders');
      if (storedReminders) {
        setReminders(JSON.parse(storedReminders));
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    // Find the reminder to delete
    const reminderToDelete = reminders.find((r) => r.id === id);
    
    if (reminderToDelete) {
      try {
        // Cancel the single notification if it exists
        if (reminderToDelete.notificationId) {
          await NotificationService.cancelNotification(reminderToDelete.notificationId);
        }
        
        // Cancel multiple notifications if they exist (for custom schedules)
        if (reminderToDelete.notificationIds && reminderToDelete.notificationIds.length > 0) {
          await NotificationService.cancelMultipleNotifications(reminderToDelete.notificationIds);
        }
        
        // Update the reminders list
        const updatedReminders = reminders.filter((r) => r.id !== id);
        setReminders(updatedReminders);
        
        // Save the updated list to storage
        await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
      } catch (error) {
        console.error('Error during reminder deletion:', error);
        alert('There was a problem deleting your reminder');
      }
    }
  };

  const handlePressReminder = (reminder: Reminder) => {
    // Navigate to edit with an absolute path
    router.push({
      pathname: '/(tabs)/reminders/edit',
      params: { reminder: JSON.stringify(reminder) },
    });
  };

  const handleAddReminder = () => {
    // Absolute path for the new reminder screen
    router.push('/(tabs)/reminders/new');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reminders</Text>
      </View>

      <ReminderList
        reminders={reminders}
        onPressReminder={handlePressReminder}
        onDeleteReminder={handleDeleteReminder}
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddReminder}>
        <AntDesign name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    elevation: 8,
  },
});