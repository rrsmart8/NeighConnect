import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, ActivityIndicator, Image, Button } from 'react-native';
import { FAB } from 'react-native-paper';  // Import FAB from react-native-paper
import ProfileCard from '@/components/ProfileCard';
import * as SplashScreen from 'expo-splash-screen';  // Import SplashScreen from expo

SplashScreen.preventAutoHideAsync();  // Prevent the splash screen from auto-hiding

const apiHome = 'http://10.40.5.151:13339/api/issues';


export default function HomeScreen() {
  interface Issue {
    title: string;
    description: string;
    id: number;
    details: string;
    imageSource: { uri: string } | number;  // Updated property for image source
    profileImage: any;  // Property for profile image
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [testResponse, setTestResponse] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch(`${apiHome}?populate=photo`);  // Use populate to get the photo field
        const data = await response.json();
        console.log('Fetched issues:', data);

        // Handle the 'photo' field correctly by checking if it's null or undefined
        const formattedIssues: Issue[] = data.data.map((issue: any) => ({
          ...issue,
          // Assign imageSource as either remote URL or local image
          imageSource: issue.photo && issue.photo.length > 0
            ? { uri: `${apiHome.replace('api/issues', '')}${issue.photo[0].url}` }
            : require('../../assets/images/10.jpg'), // Default image if no photo
          profileImage: getRandomProfileImage(),  // Assign a random profile image when fetching the data
        }));

        setIssues(formattedIssues);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);  // Empty dependency array ensures this runs only once when the component mounts

  const openModal = (issue: Issue) => {
    setSelectedIssue(issue);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedIssue(null);
  };

  const testBackendConnection = async () => {
    try {
      const response = await fetch(apiHome);
      if (response.ok) {
        const data = await response.json();
        console.log('Test response:', data);
        setTestResponse('Backend is working correctly!');
      } else {
        setTestResponse('Failed to connect to the backend.');
      }
    } catch (error) {
      console.error('Error testing the backend:', error);
      setTestResponse('Error connecting to the backend.');
    }
  };

  // Array of profile images (static references)
  const profileImages = [
    require('../../assets/images/1.jpg'),
    require('../../assets/images/2.jpg'),
    require('../../assets/images/3.jpg'),
    require('../../assets/images/4.jpg'),
    require('../../assets/images/5.jpg'),
  ];

  // Function to generate a random profile image
  const getRandomProfileImage = () => {
    const randomNum = Math.floor(Math.random() * profileImages.length); // Random index between 0 and 4
    return profileImages[randomNum];  // Return the randomly selected image
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.welcomeText}>NeighConnect</Text>
      <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" style={styles.loadingIndicator} />
        ) : (
          issues.length > 0 ? (
            issues.map((issue, index) => (
              <ProfileCard
                key={index}
                imageSource={issue.profileImage}  // Use the profile image from the issue data
                name={issue.title}  // Use issue title as the name
                description={issue.description}  // Use issue description
                onPress={() => openModal(issue)}  // Open modal on press
              />
            ))
          ) : (
            <Text style={styles.noIssuesText}>No issues available</Text>
          )
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          console.log("Floating action button pressed");
        }}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedIssue && (
              <>
                <Text style={styles.modalTitle}>{selectedIssue.title}</Text>
                <Text style={styles.modalDescription}>{selectedIssue.description}</Text>
                <Text style={styles.modalDetails}>{selectedIssue.details}</Text>

                {/* Show the image in the modal */}
                {selectedIssue.imageSource && (
                  <Image
                    source={selectedIssue.imageSource}
                    style={styles.modalImage} // Add styles for the image in the modal
                  />
                )}

                {/* Smaller, styled exit button */}
                <FAB
                  style={styles.closeModalButton}
                  icon="close"
                  onPress={closeModal}
                />
              </>
            )}
          </View>
        </View>
      </Modal>

      <Button title="Test Backend Connection" onPress={testBackendConnection} />
      {testResponse && (
        <Text style={styles.testResponseText}>{testResponse}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,

  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noIssuesText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1abc9c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    height: '60%',
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
    marginTop: 30,
  },
  modalDescription: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    marginTop: 10,
  },
  modalDetails: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  modalImage: {
    width: '100%',  // Adjust width as needed
    height: 200,    // Set a fixed height or use other sizing methods
    resizeMode: 'cover', // Make sure the image is properly cropped or scaled
    marginBottom: 20,  // Add some space below the image
  },
  closeModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,  // Smaller size for the button
    height: 40,
    backgroundColor: '#ff4d4d',
    borderRadius: 20,  // Make the button circular
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,  // Add a slight shadow for better visibility
  },
  testResponseText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#28a745',
  },
});
