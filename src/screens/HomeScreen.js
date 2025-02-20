import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReminderList from '../components/ReminderList';
import NotificationService from '../services/NotificationService';

const HomeScreen = ({ navigation }) => {
  const [reminders, setReminders] = useState([]);

  // Load reminders from storage on app start
  useEffect(() => {
    loadReminders();
    
    // Setup a focus listener to reload reminders when returning to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      loadReminders();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadReminders = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem('reminders');
      if (storedReminders !== null) {
        setReminders(JSON.parse(storedReminders));
      }
    } catch (error) {
      console.error('Error loading reminders', error);
    }
  };

  const handleDeleteReminder = async (id) => {
    // Find the reminder to get its notification ID
    const reminderToDelete = reminders.find(r => r.id === id);
    if (reminderToDelete && reminderToDelete.notificationId) {
      await NotificationService.cancelNotification(reminderToDelete.notificationId);
    }
    
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
    
    try {
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
    } catch (error) {
      console.error('Error saving reminders', error);
    }
  };

  const handlePressReminder = (reminder) => {
    navigation.navigate('EditReminder', { reminder });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Enhanced Reminders</Text>
      </View>
      
      <ReminderList 
        reminders={reminders} 
        onPressReminder={handlePressReminder} 
        onDeleteReminder={handleDeleteReminder} 
      />
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('NewReminder')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;