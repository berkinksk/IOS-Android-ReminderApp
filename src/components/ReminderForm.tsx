import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string | null;
  notificationId?: string;
  frequency?: 'none' | 'daily' | 'weekly' | 'custom';
  customSchedule?: {
    weekday: number; // 1=Mon ... 7=Sun
    hour: number;
    minute: number;
  }[];
}

interface ReminderFormProps {
  onSave: (reminder: Reminder) => void;
  initialValues?: Reminder;
}

// For the "custom" frequency option:
const weekdaysMap = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 7 },
];

const ReminderForm: React.FC<ReminderFormProps> = ({ onSave, initialValues }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [date, setDate] = useState<Date>(initialValues ? new Date(initialValues.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [image, setImage] = useState<{ uri: string } | null>(
    initialValues?.image ? { uri: initialValues.image } : null
  );

  // Frequency state
  const [frequency, setFrequency] = useState<'none' | 'daily' | 'weekly' | 'custom'>(
    initialValues?.frequency || 'none'
  );

  // For "custom" frequency, store multiple day/time combos
  const [customSchedule, setCustomSchedule] = useState<
    { weekday: number; hour: number; minute: number }[]
  >(initialValues?.customSchedule || []);

  // Modal visibility states
  const [frequencyModalVisible, setFrequencyModalVisible] = useState(false);
  const [dayPickerVisible, setDayPickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  // Temporary picks for day/time
  const [tempWeekday, setTempWeekday] = useState<number>(1);
  const [tempTime, setTempTime] = useState<Date>(new Date());

  // ====================== Date/time for the main "date" field ======================
  const handleDateChange = (_: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  // ====================== Image picking ======================
  const openImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need permission to access your gallery!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets?.length) {
      setImage({ uri: result.assets[0].uri });
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need permission to access your camera!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets?.length) {
      setImage({ uri: result.assets[0].uri });
    }
  };

  // ====================== Custom frequency logic ======================
  const addCustomDayTime = () => {
    setTempWeekday(1);
    setTempTime(new Date());
    setDayPickerVisible(true);
  };

  const confirmDayPicker = () => {
    setDayPickerVisible(false);
    setTempTime(new Date());
    setTimePickerVisible(true);
  };

  const handleTimePicked = (_: any, selectedDate?: Date) => {
    setTimePickerVisible(false);
    if (selectedDate) {
      setTempTime(selectedDate);
    }
    const hour = selectedDate ? selectedDate.getHours() : tempTime.getHours();
    const minute = selectedDate ? selectedDate.getMinutes() : tempTime.getMinutes();
    setCustomSchedule((prev) => [
      ...prev,
      {
        weekday: tempWeekday,
        hour,
        minute,
      },
    ]);
  };

  const removeCombo = (index: number) => {
    setCustomSchedule((prev) => prev.filter((_, i) => i !== index));
  };

  // ====================== Saving the reminder ======================
  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title for your reminder.');
      return;
    }
    const reminder: Reminder = {
      id: initialValues?.id || Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      date: date.toISOString(),
      image: image ? image.uri : null,
      frequency,
      customSchedule: frequency === 'custom' ? customSchedule : undefined,
    };
    onSave(reminder);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter reminder title"
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter reminder description (optional)"
        multiline
      />

      {/* Date & Time */}
      <Text style={styles.label}>Date & Time</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{date.toLocaleString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Frequency Picker Field */}
      <Text style={styles.label}>Frequency</Text>
      <TouchableOpacity
        style={styles.frequencyButton}
        onPress={() => setFrequencyModalVisible(true)}
      >
        <Text style={styles.frequencyText}>
          {frequency === 'none'
            ? 'No Repeat'
            : frequency === 'daily'
            ? 'Daily'
            : frequency === 'weekly'
            ? 'Weekly'
            : 'Custom'}
        </Text>
      </TouchableOpacity>

      {/* Frequency Picker Modal */}
      <Modal
        visible={frequencyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFrequencyModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={frequency}
              onValueChange={(val) =>
                setFrequency(val as 'none' | 'daily' | 'weekly' | 'custom')
              }
              style={styles.picker}
            >
              <Picker.Item label="No Repeat" value="none" color="#000" />
              <Picker.Item label="Daily" value="daily" color="#000" />
              <Picker.Item label="Weekly" value="weekly" color="#000" />
              <Picker.Item label="Custom" value="custom" color="#000" />
            </Picker>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setFrequencyModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* If user chose "custom," show day/time combos */}
      {frequency === 'custom' && (
        <View style={styles.customContainer}>
          <Text style={styles.label}>Custom Days/Times</Text>
          {customSchedule.map((item, index) => {
            const dayLabel =
              weekdaysMap.find((w) => w.value === item.weekday)?.label || '???';
            const hour = item.hour.toString().padStart(2, '0');
            const minute = item.minute.toString().padStart(2, '0');
            return (
              <View key={index} style={styles.customItem}>
                <Text style={styles.customItemText}>
                  {dayLabel} at {hour}:{minute}
                </Text>
                <TouchableOpacity onPress={() => removeCombo(index)}>
                  <Text style={styles.removeItemText}>×</Text>
                </TouchableOpacity>
              </View>
            );
          })}
          <TouchableOpacity style={styles.addComboButton} onPress={addCustomDayTime}>
            <Text style={styles.addComboButtonText}>+ Add Day/Time</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Day Picker Modal */}
      <Modal
        visible={dayPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDayPickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Select Day of Week</Text>
            <Picker
              // The key fix: convert the numeric day to string in <Picker.Item>, parse it back here
              selectedValue={String(tempWeekday)}
              onValueChange={(val) => setTempWeekday(parseInt(val))}
              style={styles.picker}
            >
              {weekdaysMap.map((w) => (
                <Picker.Item
                  key={w.value}
                  label={w.label}
                  value={String(w.value)}
                  color="#000"
                />
              ))}
            </Picker>
            <TouchableOpacity style={styles.modalButton} onPress={confirmDayPicker}>
              <Text style={styles.modalButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      {timePickerVisible && (
        <DateTimePicker
          value={tempTime}
          mode="time"
          display="default"
          onChange={(event, selectedDate) => {
            setTimePickerVisible(false);
            if (selectedDate) {
              setTempTime(selectedDate);
            }
            const hour = selectedDate ? selectedDate.getHours() : tempTime.getHours();
            const minute = selectedDate ? selectedDate.getMinutes() : tempTime.getMinutes();
            setCustomSchedule((prev) => [...prev, { weekday: tempWeekday, hour, minute }]);
          }}
        />
      )}

      {/* Image Picker */}
      <Text style={styles.label}>Attach Image</Text>
      <View style={styles.imagePickerContainer}>
        <TouchableOpacity style={styles.imagePickerButton} onPress={openImagePicker}>
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imagePickerButton} onPress={takePicture}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      {image && (
        <View style={styles.imagePreviewContainer}>
          <Image source={image} style={styles.previewImage} resizeMode="cover" />
          <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
            <Text style={styles.removeImageText}>×</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Reminder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  frequencyButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  frequencyText: {
    fontSize: 16,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  picker: {
    height: 200,
    width: '100%',
    color: '#000',
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  customContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  customItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  customItemText: {
    fontSize: 16,
    color: '#333',
  },
  removeItemText: {
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
  },
  addComboButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addComboButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  imagePickerButton: {
    flex: 0.48,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    marginTop: 10,
    position: 'relative',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReminderForm;
