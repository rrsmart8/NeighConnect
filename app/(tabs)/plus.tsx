import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, Image, ScrollView, Alert } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol'; // Assuming IconSymbol is the icon component
import { ThemedText } from '@/components/ThemedText'; // Assuming you're using ThemedText for consistent styling
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Independent ProfileIcon Component
const ProfileIcon = ({ imageUri }: { imageUri: string | null }) => (
  <View style={styles.profileContainer}>
    {imageUri ? (
      <Image source={{ uri: imageUri }} style={styles.profileImage} />
    ) : (
      <IconSymbol
        name="person.circle.fill"
        size={120}
        color="#4C8C99"
        style={styles.profileIcon}
      />
    )}
  </View>
);

export default function TabTwoScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState('Rares Carbunaru');
  const [bio, setBio] = useState('A passionate developer.');
  const [editing, setEditing] = useState(false);

  // Monthly points and levels for ranking system
  const monthlyPoints = {
    Jan: 50,
    Feb: 80,
    Mar: 120,
    Apr: 70,
    May: 90,
    Jun: 60,
    Jul: 110,
    Aug: 100,
    Sep: 130,
    Oct: 140,
    Nov: 150,
    Dec: 160,
  };

  // Define levels and their thresholds
  const levels = [
    { level: 1, name: 'Newbie', threshold: 0 },
    { level: 2, name: 'Beginner', threshold: 100 },
    { level: 3, name: 'Intermediate', threshold: 250 },
    { level: 4, name: 'Skilled', threshold: 400 },
    { level: 5, name: 'Pro', threshold: 600 },
    { level: 6, name: 'Elite', threshold: 800 },
    { level: 7, name: 'Master', threshold: 1000 },
  ];

  // Calculate total points
  const totalPoints = Object.values(monthlyPoints).reduce((acc, val) => acc + val, 0);

  // Determine current level
  const currentLevel = levels
    .slice()
    .reverse()
    .find(lvl => totalPoints >= lvl.threshold) || levels[0];

  // Determine if the user has reached the maximum level
  const isMaxLevel = currentLevel.level === levels.length;

  // Calculate progress towards next level
  let pointsIntoLevel = 0;
  let pointsForNextLevel = 0;
  let progress = 0;

  if (!isMaxLevel) {
    const nextLevel = levels[currentLevel.level];
    pointsIntoLevel = totalPoints - currentLevel.threshold;
    pointsForNextLevel = nextLevel.threshold - currentLevel.threshold;
    progress = Math.min(pointsIntoLevel / pointsForNextLevel, 1);
  }

  // Activity Meter Settings for Stars
  const maxStars = 5;
  const pointsPerStar = 200;
  const filledStars = Math.min(Math.floor(totalPoints / pointsPerStar), maxStars);
  const cappedFilledStars = isMaxLevel ? maxStars : filledStars;

  // Load saved data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedName = await AsyncStorage.getItem('profileName');
        const savedBio = await AsyncStorage.getItem('profileBio');
        const savedImageUri = await AsyncStorage.getItem('profileImageUri');

        if (savedName) setName(savedName);
        if (savedBio) setBio(savedBio);
        if (savedImageUri) setImageUri(savedImageUri);
      } catch (error) {
        console.log('Error loading profile:', error);
      }
    };

    loadProfile();
  }, []);

  // Function to launch the image picker for library
  const pickImageFromLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaType: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      } else {
        console.log('User canceled image picker');
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'An error occurred while picking the image.');
    }
  };

  // Function to launch the camera
  const takePhotoWithCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need permission to access your camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaType: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: false,
        allowsEditing: true,
        saveToPhotos: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      } else {
        console.log('User canceled camera');
      }
    } catch (error) {
      console.log('Error taking photo:', error);
      Alert.alert('Error', 'An error occurred while taking the photo.');
    }
  };

  // Handle saving the changes
  const saveChanges = async () => {
    try {
      await AsyncStorage.setItem('profileName', name);
      await AsyncStorage.setItem('profileBio', bio);
      if (imageUri) {
        await AsyncStorage.setItem('profileImageUri', imageUri);
      }
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.log('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Image and Edit Button */}
      <View style={styles.profileSection}>
        <ProfileIcon imageUri={imageUri} />
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditing(!editing)}
        >
          <IconSymbol name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Name and Bio */}
      <View style={styles.infoSection}>
        <ThemedText style={styles.nameText}>{name}</ThemedText>
        <ThemedText style={styles.bioText}>{bio}</ThemedText>
      </View>

      {/* Profile Edit Form */}
      {editing && (
        <View style={styles.editForm}>
          {/* Profile Image Picker */}
          <Text style={styles.sectionTitle}>Update Profile Picture</Text>
          <View style={styles.imagePickerContainer}>
            <TouchableOpacity
              onPress={pickImageFromLibrary}
              style={styles.pickImageButton}
            >
              <IconSymbol name="image" size={20} color="#fff" />
              <Text style={styles.pickImageText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={takePhotoWithCamera}
              style={styles.pickImageButton}
            >
              <IconSymbol name="camera" size={20} color="#fff" />
              <Text style={styles.pickImageText}>Selfie</Text>
            </TouchableOpacity>
          </View>

          {/* Name Input */}
          <Text style={styles.sectionTitle}>Update Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#999"
          />

          {/* Bio Input */}
          <Text style={styles.sectionTitle}>Update Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Enter your bio"
            placeholderTextColor="#999"
            multiline
          />

          {/* Save Changes Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveChanges}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Level and Rank Display */}
      <View style={styles.levelContainer}>
        <Text style={styles.levelLabel}>
          Level {currentLevel.level}: {currentLevel.name}
        </Text>
        {!isMaxLevel && (
          <>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { flex: progress }]} />
              <View style={[styles.remainingProgress, { flex: 1 - progress }]} />
            </View>
            <Text style={styles.pointsText}>
              {pointsIntoLevel} / {pointsForNextLevel} points to next level
            </Text>
          </>
        )}
        {isMaxLevel && (
          <Text style={styles.maxLevelText}>
            Congratulations! You've reached the maximum level.
          </Text>
        )}
      </View>

      {/* Star-based Implication Meter */}
      <View style={styles.activityMeterContainer}>
        <Text style={styles.activityLabel}>Implication</Text>
        <View style={styles.starsContainer}>
          {Array.from({ length: maxStars }).map((_, index) => {
            const filled = index < cappedFilledStars;
            return (
              <IconSymbol
                key={index}
                name={filled ? 'star.fill' : 'star'}
                size={28}
                color={filled ? '#FFD700' : '#CCCCCC'}
                style={styles.star}
              />
            );
          })}
        </View>
        <Text style={styles.totalText}>{totalPoints} Points</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 50,
  },
  profileSection: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#6c757d',
    marginTop: 50,
  },
  profileIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#495057',
    padding: 6,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#212529',
    marginBottom: 4,
  },
  bioText: {
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  editForm: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 8,
    marginTop: 10,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    flex: 1,
    justifyContent: 'center',
  },
  pickImageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 14,
    color: '#495057',
    backgroundColor: '#f1f3f5',
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#198754',
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  levelContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  levelLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  progressBar: {
    flexDirection: 'row',
    height: 10,
    width: '90%',
    backgroundColor: '#dee2e6',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progress: {
    backgroundColor: '#6c757d',
  },
  remainingProgress: {
    backgroundColor: '#dee2e6',
  },
  pointsText: {
    fontSize: 12,
    color: '#6c757d',
  },
  maxLevelText: {
    fontSize: 16,
    color: '#198754',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  activityMeterContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    marginHorizontal: 4,
  },
  totalText: {
    fontSize: 18,
    color: '#212529',
    fontWeight: '600',
    marginTop: 8,
  },
});
