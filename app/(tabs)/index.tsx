// app/(tabs)/index.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useParks, Park } from '../../contexts/ParksContext';

const ParkCard = ({ park, onPress }: { park: Park; onPress: (park: Park) => void }) => (
  <TouchableOpacity style={styles.parkCard} onPress={() => onPress(park)}>
    <View style={styles.parkHeader}>
      <Text style={styles.parkName}>{park.name}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.rating}>{park.rating}</Text>
      </View>
    </View>
    
    <Text style={styles.address}>{park.address}</Text>
    
    <View style={styles.featuresContainer}>
      {park.features.slice(0, 3).map((feature: string, index: number) => (
        <View key={index} style={styles.featureTag}>
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
    </View>
    
    <Text style={styles.description} numberOfLines={2}>
      {park.description}
    </Text>
    
    {/* Show "NEW" badge for recently added parks */}
    {park.addedBy === 'user' && (
      <View style={styles.newBadge}>
        <Text style={styles.newBadgeText}>NEW!</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default function HomeScreen() {
  const { parks } = useParks();

  const handleParkPress = (park: Park) => {
    router.push({
      pathname: '/park-detail',
      params: { parkData: JSON.stringify(park) }
    });
  };

  // Sort parks so newest ones appear first
  const sortedParks = [...parks].sort((a, b) => {
    if (a.addedBy === 'user' && b.addedBy !== 'user') return -1;
    if (b.addedBy === 'user' && a.addedBy !== 'user') return 1;
    if (a.dateAdded && b.dateAdded) {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
    return 0;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🐕 Windsor Dog Parks</Text>
        <Text style={styles.subtitle}>
          Find the perfect spot for you and your pack! ({parks.length} parks)
        </Text>
      </View>
      
      <FlatList
        data={sortedParks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ParkCard park={item} onPress={handleParkPress} />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
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
  listContainer: {
    padding: 16,
  },
  parkCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  parkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  parkName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  featureTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#2E8B57',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});