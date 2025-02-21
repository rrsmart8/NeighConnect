import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType, TouchableOpacity } from 'react-native';

interface ProfileCardProps {
  imageSource: ImageSourcePropType;
  name: string;
  description: string;
  onPress: () => void;  // Add the onPress function as a prop
}

const ProfileCard: React.FC<ProfileCardProps> = ({ imageSource, name, description, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}> {/* Wrap in TouchableOpacity for onPress */}
      <Image source={imageSource} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // For Android shadow effect
    marginBottom: 5, // Space between cards
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25, // Make the image round
    marginRight: 15, // Space between image and text
  },
  textContainer: {
    flex: 1, // Ensure text takes the rest of the space
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
});

export default ProfileCard;
