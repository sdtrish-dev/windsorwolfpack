// app/park-detail.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

export default function ParkDetailScreen() {
  const { parkData } = useLocalSearchParams();
  const park = JSON.parse(parkData as string);
  
  const [userRating, setUserRating] = useState(0);
  const [hasVisited, setHasVisited] = useState(false);

  const handleRate = (rating: number) => {
    setUserRating(rating);
    Alert.alert('Thanks!', `You rated ${park.name} ${rating} stars!`);
  };

  const handleVisitLog = () => {
    setHasVisited(!hasVisited);
    Alert.alert(
      hasVisited ? 'Visit Removed' : 'Visit Logged!',
      hasVisited 
        ? `Removed visit to ${park.name}` 
        : `Logged a visit to ${park.name} with Wolf! 🐕`
    );
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
      {/* Header with back button */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2E8B57" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Park Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.parkName}>{park.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>{park.rating} average rating</Text>
          </View>
        </View>

        {/* Address & Quick Info */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#2E8B57" />
            <Text style={styles.address}>{park.address}</Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            {park.features.map((feature: string, index: number) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#2E8B57" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Park</Text>
          <Text style={styles.description}>{park.description}</Text>
        </View>

        {/* Rate This Park */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rate This Park</Text>
          <StarRating onStarPress={handleRate} currentRating={userRating} />
          {userRating > 0 && (
            <Text style={styles.ratingText}>You rated this park {userRating} stars!</Text>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleVisitLog}>
            <Ionicons 
              name={hasVisited ? "checkmark-circle" : "add-circle-outline"} 
              size={24} 
              color="#fff" 
            />
            <Text style={styles.actionButtonText}>
              {hasVisited ? "✓ Visited with Wolf!" : "Log a Visit"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => Alert.alert('Coming Soon!', 'Directions feature will be added soon!')}
          >
            <Ionicons name="navigate-outline" size={24} color="#2E8B57" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Get Directions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fun Wolf Facts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🐺 Did You Know?</Text>
          <View style={styles.wolfFact}>
            <Text style={styles.wolfFactText}>
              Dogs can smell up to 100,000 times better than humans! 
              Your pup is experiencing this park in ways we can&apos;t even imagine.
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSpacer: {
    width: 40,
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
  parkName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    marginLeft: 12,
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
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
  actionButton: {
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2E8B57',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#2E8B57',
  },
  wolfFact: {
    backgroundColor: '#FFF8DC',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57',
  },
  wolfFactText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 22,
  },
});