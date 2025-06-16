// app/(tabs)/map.tsx - Web-compatible version
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useParks, Park } from '../../contexts/ParksContext';
import { router } from 'expo-router';

// Mock coordinates for Windsor parks
const PARK_COORDINATES: { [key: string]: { lat: number; lng: number; address: string } } = {
  'Malden Park Dog Area': { lat: 42.2889, lng: -82.9794, address: '3540 Malden Rd' },
  'Jackson Park': { lat: 42.3097, lng: -83.0364, address: '1453 Ouellette Ave' },
  'Mic Mac Park': { lat: 42.3169, lng: -83.0686, address: '2540 Richmond St' },
  'Little River Corridor': { lat: 42.2833, lng: -82.9833, address: 'Little River Dr' },
  'Sandpoint Beach': { lat: 42.2764, lng: -82.8678, address: '7800 Riverside Dr E' },
};

export default function MapScreen() {
  const { parks } = useParks();
  const [selectedPark, setSelectedPark] = useState<Park | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'web-map'>('list');

  const handleParkPress = (park: Park) => {
    setSelectedPark(park);
  };

  const handleViewDetails = (park: Park) => {
    router.push({
      pathname: '/park-detail',
      params: { parkData: JSON.stringify(park) }
    });
  };

  const getMarkerColor = (park: Park) => {
    if (park.addedBy === 'user') return '#FF6B6B';
    if (park.rating >= 4.5) return '#2E8B57';
    if (park.rating >= 4.0) return '#FFD700';
    return '#87CEEB';
  };

  const getDirectionsUrl = (park: Park) => {
    const coords = PARK_COORDINATES[park.name];
    if (coords) {
      return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(park.address)}`;
  };

  const ParkMapCard = ({ park }: { park: Park }) => {
    const coords = PARK_COORDINATES[park.name];
    const markerColor = getMarkerColor(park);

    return (
      <TouchableOpacity 
        style={styles.parkMapCard}
        onPress={() => handleParkPress(park)}
      >
        <View style={styles.parkCardHeader}>
          <View style={styles.parkCardLeft}>
            <View style={[styles.mapMarker, { backgroundColor: markerColor }]}>
              <Ionicons name="location" size={16} color="#fff" />
            </View>
            <View style={styles.parkCardInfo}>
              <Text style={styles.parkCardName}>{park.name}</Text>
              <Text style={styles.parkCardAddress}>
                {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : park.address}
              </Text>
            </View>
          </View>
          <View style={styles.parkCardRating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{park.rating}</Text>
          </View>
        </View>

        <View style={styles.parkCardFeatures}>
          {park.features.slice(0, 3).map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
          {park.features.length > 3 && (
            <Text style={styles.moreFeatures}>+{park.features.length - 3} more</Text>
          )}
        </View>

        <View style={styles.parkCardActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleViewDetails(park)}
          >
            <Ionicons name="information-circle-outline" size={16} color="#2E8B57" />
            <Text style={styles.actionText}>Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              if (Platform.OS === 'web') {
                window.open(getDirectionsUrl(park), '_blank');
              }
            }}
          >
            <Ionicons name="navigate-outline" size={16} color="#2E8B57" />
            <Text style={styles.actionText}>Directions</Text>
          </TouchableOpacity>
        </View>

        {park.addedBy === 'user' && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW!</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🗺️ Windsor Dog Parks Map</Text>
        <Text style={styles.subtitle}>
          {parks.length} parks • {Platform.OS === 'web' ? 'Web version' : 'Mobile ready'}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, viewMode === 'list' && styles.controlButtonActive]}
          onPress={() => setViewMode('list')}
        >
          <Ionicons name="list-outline" size={18} color={viewMode === 'list' ? '#fff' : '#2E8B57'} />
          <Text style={[styles.controlText, viewMode === 'list' && styles.controlTextActive]}>
            List View
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, viewMode === 'web-map' && styles.controlButtonActive]}
          onPress={() => setViewMode('web-map')}
        >
          <Ionicons name="globe-outline" size={18} color={viewMode === 'web-map' ? '#fff' : '#2E8B57'} />
          <Text style={[styles.controlText, viewMode === 'web-map' && styles.controlTextActive]}>
            Web Map
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {viewMode === 'list' ? (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {parks.map((park) => (
            <ParkMapCard key={park.id} park={park} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.webMapContainer}>
          <Text style={styles.webMapTitle}>Interactive Web Map</Text>
          <Text style={styles.webMapDescription}>
            For the full interactive map experience, open Google Maps with all park locations:
          </Text>
          
          <TouchableOpacity 
            style={styles.openMapButton}
            onPress={() => {
              if (Platform.OS === 'web') {
                // Create a multi-stop Google Maps URL with all parks
                const locations = parks
                  .map(park => {
                    const coords = PARK_COORDINATES[park.name];
                    return coords ? `${coords.lat},${coords.lng}` : encodeURIComponent(park.address);
                  })
                  .join('|');
                
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&waypoints=${locations}&travelmode=driving`;
                window.open(mapsUrl, '_blank');
              }
            }}
          >
            <Ionicons name="map" size={24} color="#fff" />
            <Text style={styles.openMapButtonText}>Open All Parks in Google Maps</Text>
          </TouchableOpacity>

          <View style={styles.individualMapsContainer}>
            <Text style={styles.individualMapsTitle}>Or open individual parks:</Text>
            {parks.slice(0, 5).map((park) => (
              <TouchableOpacity 
                key={park.id}
                style={styles.individualMapButton}
                onPress={() => {
                  if (Platform.OS === 'web') {
                    window.open(getDirectionsUrl(park), '_blank');
                  }
                }}
              >
                <View style={[styles.mapMarker, { backgroundColor: getMarkerColor(park) }]}>
                  <Ionicons name="location" size={12} color="#fff" />
                </View>
                <Text style={styles.individualMapText}>{park.name}</Text>
                <Ionicons name="open-outline" size={16} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#2E8B57' }]} />
            <Text style={styles.legendText}>Top Rated (4.5+)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFD700' }]} />
            <Text style={styles.legendText}>Good (4.0+)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
            <Text style={styles.legendText}>User Added</Text>
          </View>
        </View>
      </View>

      {/* Selected Park Info */}
      {selectedPark && (
        <View style={styles.selectedParkInfo}>
          <TouchableOpacity 
            style={styles.selectedParkContent}
            onPress={() => handleViewDetails(selectedPark)}
          >
            <Text style={styles.selectedParkName}>{selectedPark.name}</Text>
            <Text style={styles.selectedParkDetails}>
              ⭐ {selectedPark.rating} • {selectedPark.features.length} features
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSelectedPark(null)}
          >
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2E8B57',
    backgroundColor: '#fff',
  },
  controlButtonActive: {
    backgroundColor: '#2E8B57',
  },
  controlText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#2E8B57',
    fontWeight: '600',
  },
  controlTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  parkMapCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  parkCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  parkCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mapMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  parkCardInfo: {
    flex: 1,
  },
  parkCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  parkCardAddress: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  parkCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  parkCardFeatures: {
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
  moreFeatures: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'center',
  },
  parkCardActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#2E8B57',
    fontWeight: '600',
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
  webMapContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webMapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 16,
    textAlign: 'center',
  },
  webMapDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  openMapButton: {
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  openMapButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  individualMapsContainer: {
    width: '100%',
    maxWidth: 400,
  },
  individualMapsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  individualMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  individualMapText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
  legend: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  selectedParkInfo: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  selectedParkContent: {
    flex: 1,
  },
  selectedParkName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedParkDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
});