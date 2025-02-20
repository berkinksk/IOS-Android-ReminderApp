import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Reminder } from './ReminderForm';

interface ReminderListProps {
  reminders: Reminder[];
  onPressReminder: (reminder: Reminder) => void;
  onDeleteReminder: (id: string) => void;
}

const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  onPressReminder,
  onDeleteReminder,
}) => {
  const renderItem = ({ item }: { item: Reminder }) => {
    const reminderDate = new Date(item.date);

    return (
      <TouchableOpacity
        style={styles.reminderItem}
        onPress={() => onPressReminder(item)}
      >
        <View style={styles.reminderContent}>
          <Text style={styles.reminderTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {item.description ? (
            <Text style={styles.reminderDescription} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          <Text style={styles.reminderDate}>
            {reminderDate.toLocaleString()}
          </Text>
        </View>

        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.thumbnail, styles.noImage]}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDeleteReminder(item.id)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={reminders}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No reminders yet!</Text>
          <Text>Tap the + button to create a reminder.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  reminderItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reminderContent: {
    flex: 1,
    marginRight: 12,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reminderDescription: {
    color: '#666',
    marginBottom: 8,
  },
  reminderDate: {
    color: '#007AFF',
    fontSize: 14,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  noImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    fontSize: 10,
    color: '#999',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default ReminderList;
