import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { Ionicons } from '@expo/vector-icons'; // For adding icons

const IssueForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState(''); // Corrected state name
  const [storyOutput, setStoryOutput] = useState('');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Function to handle form submission
  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !category.trim() || !location.trim()) {
      Alert.alert('Validation Error', 'Please fill in all the fields.');
      return;
    }

    // Placeholder for actual submission logic
    setStoryOutput('Your AI-generated story will appear here.');
    Alert.alert('Success', 'Issue submitted successfully!');
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false); // Close picker on Android after selection
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const selectImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('Image Picker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setImage(response.assets[0].uri);
        }
      }
    );
  };

  const categoryOptions = [
    'Road',
    'Water',
    'Electricity',
    'Sanitation',
    'Organisation',
    'Legal',
    'Support',
    'Pets',
    'Events',
    'Disruption',
    'Cleanliness',
    'Other',
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Report an Issue</Text>

      {/* Title Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Brief title of the issue"
          placeholderTextColor="#A0A0A0"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Description Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Detailed description of the issue"
          placeholderTextColor="#A0A0A0"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      {/* Date and Photo Row */}
      <View style={styles.row}>
        {/* Date Picker */}
        <View style={styles.flexItem}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#ffffff" />
            <Text style={styles.dateButtonText}>
              {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {/* DateTimePicker Component */}
          {showDatePicker && Platform.OS === 'ios' ? (
            <Modal
              transparent
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalHeader}>Select a Date</Text>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={onChangeDate}
                    textColor="#2C3E50" // Visible text color for iOS
                  />
                  <TouchableOpacity
                    style={styles.okButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.okButtonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          ) : (
            showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default" // 'default' display for Android
                onChange={onChangeDate}
                textColor={Platform.OS === 'ios' ? '#2C3E50' : undefined}
              />
            )
          )}
        </View>

        {/* Photo Upload */}
        <View style={styles.flexItem}>
          <Text style={styles.label}>Photo</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
            <Ionicons
              name={image ? 'image-outline' : 'camera-outline'}
              size={20}
              color="#ffffff"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.uploadButtonText}>
              {image ? 'Change Photo' : 'Upload Photo'}
            </Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        </View>
      </View>

      {/* Category Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Ionicons
            name={category ? 'checkmark-circle-outline' : 'add-circle-outline'}
            size={20}
            color="#ffffff"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.uploadButtonText}>
            {category || 'Select a Category'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Modal */}
      <Modal
        transparent
        visible={categoryModalVisible}
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select a Category</Text>
            <FlatList
              data={categoryOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setCategory(item);
                    setCategoryModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCategoryModalVisible(false)}
            >
              <Ionicons name="close-circle-outline" size={20} color="#ffffff" />
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Location Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the location of the issue"
          placeholderTextColor="#A0A0A0"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Ionicons name="send-outline" size={20} color="#ffffff" style={{ marginRight: 5 }} />
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* AI Generated Story Output */}
      {storyOutput && (
        <View style={styles.storyOutputContainer}>
          <Text style={styles.storyOutputText}>{storyOutput}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9fafd',
    flexGrow: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 35,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#34495E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  flexItem: {
    flex: 1,
    marginRight: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5DADE2', // Blue background for date button
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3498DB', // Lighter blue border
  },
  dateButtonText: {
    color: '#ffffff', // White text for contrast
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5DADE2', // Blue background for upload button
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3498DB', // Lighter blue border
  },
  uploadButtonText: {
    color: '#ffffff', // White text for contrast
    fontSize: 14,
    fontWeight: 'bold',
  },
  imagePreview: {
    marginTop: 8,
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    maxHeight: '80%',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#BDC3C7',
    width: '100%',
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 16,
    color: '#34495E',
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff5252', // Red background for close button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#ffffff', // White text for contrast
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#2ECC71', // Green background for submit button
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  storyOutputContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#E8F8F5',
    borderRadius: 12,
    borderColor: '#2ECC71',
    borderWidth: 1,
  },
  storyOutputText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  okButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#5DADE2', // Blue background for OK button
    borderRadius: 8,
  },
  okButtonText: {
    color: '#ffffff', // White text for contrast
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IssueForm;
