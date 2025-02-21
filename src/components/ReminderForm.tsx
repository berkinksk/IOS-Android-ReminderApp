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
    weekday: number;
    hour: number;
    minute: number;
  }[];
}

interface ReminderFormProps {
  onSave: (reminder: Reminder) => void;
  initialValues?: Reminder;
}

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

  const [frequency, setFrequency] = useState<'none' | 'daily' | 'weekly' | 'custom'>(
    initialValues?.frequency || 'none'
  );
  const [customSchedule, setCustomSchedule] = useState<
    { weekday: number; hour: number; minute: number }[]
  >(initialValues?.customSchedule || []);
  const [frequencyModalVisible, setFrequencyModalVisible] = useState(false);
  const [dayPickerVisible, setDayPickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [tempWeekday, setTempWeekday] = useState<number>(1);
  const [tempTime, setTempTime] = useState<Date>(new Date());

  const handleDateChange = (_: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const addCustomDayTime = () => {
    setTempWeekday(1);
    setTempTime(new Date());
    setDayPickerVisible(true);
  };

  const confirmDayPicker = () => {
    setDayPickerVisible(false);
    setTimePickerVisible(true);
  };

  const handleTimeChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) setTempTime(selectedDate);
  };

  const confirmTimeSelection = () => {
    setTimePickerVisible(false);
    const hour = tempTime.getHours();
    const minute = tempTime.getMinutes();
    setCustomSchedule((prev) => [
      ...prev,
      { weekday: tempWeekday, hour, minute }
    ]);
  };

  const removeCombo = (index: number) => {
    setCustomSchedule((prev) => prev.filter((_, i) => i !== index));
  };

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

  const openImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission needed!');
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
      alert('Camera permission needed!');
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter reminder title"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter reminder description (optional)"
        placeholderTextColor="#666"
        multiline
      />

      {frequency !== 'custom' && (
        <>
          <Text style={styles.label}>Date & Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
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
        </>
      )}

      <Text style={styles.label}>Frequency</Text>
      <TouchableOpacity
        style={styles.frequencyButton}
        onPress={() => setFrequencyModalVisible(true)}
      >
        <Text style={styles.frequencyText}>
          {frequency === 'none' ? 'No Repeat' : 
           frequency === 'daily' ? 'Daily' : 
           frequency === 'weekly' ? 'Weekly' : 'Custom'}
        </Text>
      </TouchableOpacity>

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
              onValueChange={(val) => setFrequency(val as any)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="No Repeat" value="none" />
              <Picker.Item label="Daily" value="daily" />
              <Picker.Item label="Weekly" value="weekly" />
              <Picker.Item label="Custom" value="custom" />
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

      {frequency === 'custom' && (
        <View style={styles.customContainer}>
          <Text style={styles.label}>Custom Days/Times</Text>
          {customSchedule.map((item, index) => {
            const dayLabel = weekdaysMap.find(w => w.value === item.weekday)?.label || '???';
            return (
              <View key={index} style={styles.customItem}>
                <Text style={styles.customItemText}>
                  {dayLabel} at {item.hour.toString().padStart(2, '0')}:{item.minute.toString().padStart(2, '0')}
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

      <Modal
        visible={dayPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDayPickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Select Day</Text>
            <Picker
              selectedValue={String(tempWeekday)}
              onValueChange={(val) => setTempWeekday(parseInt(val))}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {weekdaysMap.map((w) => (
                <Picker.Item 
                  key={w.value} 
                  label={w.label} 
                  value={String(w.value)}
                />
              ))}
            </Picker>
            <TouchableOpacity style={styles.modalButton} onPress={confirmDayPicker}>
              <Text style={styles.modalButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={timePickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Select Time</Text>
            <DateTimePicker
              value={tempTime}
              mode="time"
              display="spinner"
              onChange={handleTimeChange}
              textColor="#000000"
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={confirmTimeSelection}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Attach Image</Text>
      <View style={styles.imagePickerContainer}>
        <TouchableOpacity style={styles.imagePickerButton} onPress={openImagePicker}>
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imagePickerButton} onPress={takePicture}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <View style={styles.imagePreviewContainer}>
          <Image source={image} style={styles.previewImage} resizeMode="cover" />
          <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
            <Text style={styles.removeImageText}>×</Text>
          </TouchableOpacity>
        </View>
      )}

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
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
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
    backgroundColor: '#fff',
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
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
    textAlign: 'center',
  },
  picker: {
    height: 200,
    width: '100%',
  },
  pickerItem: {
    color: '#000',
    fontSize: 18,
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
    fontSize: 16,
  },
  customContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
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