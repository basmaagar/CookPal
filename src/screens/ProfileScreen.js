import React, { useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  const renderOption = (icon, title, onPress = () => {}) => (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={20} color={COLORS.primaryGreen} />
        </View>
        <Text style={styles.optionText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C0C0C0" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* --- HEADER PROFILE (No Photo) --- */}
        <View style={styles.profileHeader}>
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>
              {user?.name ? user.name.charAt(0) : "G"}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
          <Text style={styles.userHandle}>{user?.handle || '@guest'}</Text>
        </View>

        {/* --- STATS ROW --- */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Recipes</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <Text style={styles.statNumber}>5.8k</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>85</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>

        {/* --- MENU OPTIONS --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {renderOption('person-outline', 'Edit Profile')}
          {renderOption('notifications-outline', 'Notifications')}
          {renderOption('lock-closed-outline', 'Privacy & Security')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          {renderOption('settings-outline', 'App Settings')}
          {renderOption('help-circle-outline', 'Help & Support')}
          {renderOption('log-out-outline', 'Log Out', logout)} 
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContainer: { paddingBottom: 30 },

  // Header Styles (Updated)
  profileHeader: { alignItems: 'center', marginTop: 40, marginBottom: 30 },

  // New Circle with Initials (Replaces Photo)
  initialsCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(76,175,80,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 10,
    shadowColor: COLORS.primaryGreen, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5
  },
  initialsText: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },

  userName: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  userHandle: { fontSize: 14, color: '#CCC', marginTop: 5 },

  // Stats
  statsContainer: { flexDirection: 'row', backgroundColor: '#1A1A1A', marginHorizontal: 20, borderRadius: 15, paddingVertical: 15, justifyContent: 'space-around', marginBottom: 25, shadowColor: "#000", shadowOpacity: 0.05, elevation: 2 },
  statBox: { alignItems: 'center', flex: 1 },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  statLabel: { fontSize: 12, color: '#CCC', marginTop: 2 },

  // Menus
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#CCC', marginBottom: 10, marginLeft: 5 },
  optionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1A1A1A', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.03, elevation: 1 },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 35, height: 35, backgroundColor: 'rgba(76,175,80,0.2)', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  optionText: { fontSize: 16, color: '#FFF', fontWeight: '500' }
});
