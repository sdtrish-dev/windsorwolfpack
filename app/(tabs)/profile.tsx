// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [visitCount, setVisitCount] = useState(7);
  const [favoriteParks] = useState(3);
  const [reviewsCount] = useState(5);

  const handleEditProfile = () => {
    Alert.alert('Coming Soon!', 'Profile editing will be available in the next update!');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'App settings and preferences coming soon!');
  };

  const handleSupport = () => {
    Alert.alert(
      'WindsorWolfPack Support', 
      'Have feedback or found a bug? Email us at: windsorwolfpack@example.com\n\nWe love hearing from our pack! 🐕'
    );
  };

  const StatCard = ({ icon, title, value, subtitle }: { icon: string; title: string; value: number; subtitle?: string }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon as any} size={32} color="#2E8B57" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const MenuButton = ({ icon, title, subtitle, onPress, color = "#333" }: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    onPress: () => void; 
    color?: string;
  }) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <View style={styles.menuButtonLeft}>
        <Ionicons name={icon as any} size={24} color={color} />
        <View style={styles.menuButtonText}>
          <Text style={[styles.menuButtonTitle, { color }]}>{title}</Text>
          {subtitle && <Text style={styles.menuButtonSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>🐕</Text>
          </View>
          <Text style={styles.userName}>You & Wolf</Text>
          <Text style={styles.userSubtitle}>WindsorWolfPack Member</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={16} color="#2E8B57" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Pack Activity</Text>
          <View style={styles.statsGrid}>
            <StatCard 
              icon="location" 
              title="Parks Visited" 
              value={visitCount}
              subtitle="with Wolf"
            />
            <StatCard 
              icon="heart" 
              title="Favorites" 
              value={favoriteParks}
              subtitle="saved parks"
            />
            <StatCard 
              icon="star" 
              title="Reviews" 
              value={reviewsCount}
              subtitle="shared"
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <Ionicons name="location" size={20} color="#2E8B57" />
            <Text style={styles.activityText}>Visited Malden Park Dog Area</Text>
            <Text style={styles.activityTime}>2 days ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.activityText}>Rated Jackson Park 4 stars</Text>
            <Text style={styles.activityTime}>1 week ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="add-circle" size={20} color="#2E8B57" />
            <Text style={styles.activityText}>Added Little River Corridor</Text>
            <Text style={styles.activityTime}>2 weeks ago</Text>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Options</Text>
          
          <MenuButton
            icon="settings-outline"
            title="Settings"
            subtitle="Notifications, privacy, and more"
            onPress={handleSettings}
          />
          
          <MenuButton
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help or send feedback"
            onPress={handleSupport}
          />
          
          <MenuButton
            icon="information-circle-outline"
            title="About WindsorWolfPack"
            subtitle="Version 1.0.0"
            onPress={() => Alert.alert('About', 'WindsorWolfPack v1.0.0\nBuilt with ❤️ for dog lovers in Windsor, ON')}
          />
        </View>

        {/* Wolf Wisdom */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🐺 Wolf Wisdom</Text>
          <View style={styles.wisdomCard}>
            <Text style={styles.wisdomText}>
              &quot;A dog park visit a day keeps the vet away! Regular exercise and socialization 
              help keep your pup healthy and happy.&quot;
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with 🐕 for the Windsor dog community
          </Text>
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
  profileHeader: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2E8B57',
  },
  editButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#2E8B57',
    fontWeight: '600',
  },
  statsSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  activityTime: {
    fontSize: 14,
    color: '#666',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButtonText: {
    marginLeft: 16,
    flex: 1,
  },
  menuButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuButtonSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  wisdomCard: {
    backgroundColor: '#FFF8DC',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57',
  },
  wisdomText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});