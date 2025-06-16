// app/(tabs)/explore.tsx - Web-compatible version
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useParks } from '../../contexts/ParksContext';
import { router } from 'expo-router';

const FEATURE_OPTIONS = [
  'Fenced',
  'Water Station', 
  'Large Dogs',
  'Small Dogs',
  'Walking Trails',
  'Open Space',
  'Parking',
  'Beach',
  'Swimming',
  'Creek Access',
];

// Web-compatible alert function
const showAlert = (title: string, message: string, buttons?: Array<{text: string, onPress?: () => void}>) => {
  if (Platform.OS === 'web') {
    const result = window.confirm(`${title}\n\n${message}`);
    if (result && buttons && buttons[0]?.onPress) {
      buttons[0].onPress();
    }
  } else {
    // This would work on mobile
    // Alert.alert(title, message, buttons);
  }
};

export default function AddParkScreen() {
  const { addPark } = useParks();
  const [parkName, setParkName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const clearForm = () => {
    setParkName('');
    setAddress('');
    setDescription('');
    setSelectedFeatures([]);
    setRating(0);
    setSuccessMessage('');
  };

  const handleSubmit = () => {
    console.log('Submit button pressed!');
    console.log('Park name:', parkName);
    console.log('Address:', address);
    
    if (!parkName.trim() || !address.trim()) {
      console.log('Missing required fields');
      setSuccessMessage('❌ Please enter at least a park name and address.');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    console.log('Adding park...');
    
    try {
      addPark({
        name: parkName.trim(),
        address: address.trim(),
        description: description.trim(),
        features: selectedFeatures,
        rating: rating || 3.0,
      });
      
      console.log('Park added successfully!');
      
      setSuccessMessage(`✅ Success! ${parkName} has been added to WindsorWolfPack!`);
      
      // Clear form after 3 seconds
      setTimeout(() => {
        clearForm();
      }, 3000);
      
    } catch (error) {
      console.log('Error adding park:', error);
      setSuccessMessage('❌ Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ onStarPress, currentRating }: { onStarPress: (rating: number) => void; currentRating: number }) => (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onStarPress(star)}>
          <Ionicons
            name={star <= currentRating ? 'star' : 'star-outline'}
            size={32}
            color="#FFD700"
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>🐕 Add a Dog Park</Text>
          <Text style={styles.subtitle}>
            Help grow the WindsorWolfPack community!
          </Text>
        </View>

        {/* Success/Error Message */}
        {successMessage ? (
          <View style={[styles.messageBox, successMessage.includes('✅') ? styles.successBox : styles.errorBox]}>
            <Text style={styles.messageText}>{successMessage}</Text>
            {successMessage.includes('✅') && (
              <TouchableOpacity 
                style={styles.viewParksButton}
                onPress={() => router.push('/(tabs)')}
              >
                <Text style={styles.viewParksButtonText}>View Parks List</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        <View style={styles.form}>
          {/* Park Name */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Park Name *</Text>
            <TextInput
              style={styles.textInput}
              value={parkName}
              onChangeText={setParkName}
              placeholder="e.g. Riverside Dog Park"
              placeholderTextColor="#999"
            />
          </View>

          {/* Address */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.textInput}
              value={address}
              onChangeText={setAddress}
              placeholder="e.g. 123 Main St, Windsor, ON"
              placeholderTextColor="#999"
            />
          </View>

          {/* Description */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Tell other dog owners what makes this place special..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Rating */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Your Rating</Text>
            <StarRating onStarPress={setRating} currentRating={rating} />
            {rating > 0 && (
              <Text style={styles.ratingText}>You rated this park {rating} stars!</Text>
            )}
          </View>

          {/* Features */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Features</Text>
            <Text style={styles.sublabel}>Tap to select features this park has:</Text>
            <View style={styles.featuresGrid}>
              {FEATURE_OPTIONS.map((feature, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.featureChip,
                    selectedFeatures.includes(feature) && styles.featureChipSelected
                  ]}
                  onPress={() => toggleFeature(feature)}
                >
                  <Text style={[
                    styles.featureChipText,
                    selectedFeatures.includes(feature) && styles.featureChipTextSelected
                  ]}>
                    {feature}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Adding Park...' : 'Add Park to WindsorWolfPack'}
            </Text>
          </TouchableOpacity>

          {/* Clear Form Button */}
          <TouchableOpacity style={styles.clearButton} onPress={clearForm}>
            <Ionicons name="refresh-outline" size={20} color="#666" />
            <Text style={styles.clearButtonText}>Clear Form</Text>
          </TouchableOpacity>

          {/* Info Note */}
          <View style={styles.infoNote}>
            <Ionicons name="information-circle-outline" size={20} color="#2E8B57" />
            <Text style={styles.infoText}>
              Your submission will be added to the parks list immediately and help other dog owners in Windsor find great places to take their pups!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  messageBox: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  successBox: {
    backgroundColor: '#E8F5E8',
    borderColor: '#2E8B57',
  },
  errorBox: {
    backgroundColor: '#FFE8E8',
    borderColor: '#FF6B6B',
  },
  messageText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  viewParksButton: {
    backgroundColor: '#2E8B57',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewParksButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  star: {
    marginHorizontal: 4,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#2E8B57',
    fontWeight: '600',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  featureChipSelected: {
    backgroundColor: '#2E8B57',
    borderColor: '#2E8B57',
  },
  featureChipText: {
    fontSize: 14,
    color: '#666',
  },
  featureChipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  clearButton: {
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
    marginLeft: 6,
  },
  infoNote: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#2E8B57',
    lineHeight: 20,
  },
});