import React, { useContext, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  Alert, ScrollView, Switch 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

// --- DARK THEME COLORS (Matches your screenshot) ---
const COLORS = {
  background: '#121212',       // Main Black Background
  surface: '#1E1E1E',          // Dark Grey for cards/buttons
  primaryGreen: '#4CAF50',     // CookPal Green
  textWhite: '#FFFFFF',
  textGray: '#AAAAAA',
  errorRed: '#FF5252',
  border: '#333333'
};

const ProfileScreen = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [showAbout, setShowAbout] = useState(false); // To toggle About Us text
  
  // Form State
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');

  const handleSave = () => {
    if (username.length < 2) {
      Alert.alert("Error", "Username must be at least 2 characters.");
      return;
    }
    updateProfile(username, password);
    setIsEditing(false);
    setPassword('');
  };

  // Reusable Menu Item Component
  const MenuItem = ({ icon, text, onPress, isDestructive = false }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconBox, { borderColor: isDestructive ? COLORS.errorRed : COLORS.primaryGreen }]}>
          <Ionicons 
            name={icon} 
            size={20} 
            color={isDestructive ? COLORS.errorRed : COLORS.primaryGreen} 
          />
        </View>
        <Text style={[styles.menuItemText, isDestructive && { color: COLORS.errorRed }]}>
          {text}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* 1. HEADER (Avatar & Name) */}
        <View style={styles.headerProfile}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color={COLORS.background} />
          </View>
          <Text style={styles.username}>{user?.username || 'User'}</Text>
          <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
        </View>

        {/* 2. EDIT FORM (Shows only when Editing) */}
        {isEditing ? (
          <View style={styles.editSection}>
            <Text style={styles.sectionTitle}>Edit Info</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.textGray} style={{marginRight:10}}/>
              <TextInput 
                style={styles.input} 
                value={username} 
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor={COLORS.textGray}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textGray} style={{marginRight:10}}/>
              <TextInput 
                style={styles.input} 
                value={password} 
                onChangeText={setPassword}
                placeholder="New Password (Optional)"
                placeholderTextColor={COLORS.textGray}
                secureTextEntry
              />
            </View>

            <View style={styles.editButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* 3. MENU LIST (Shows when NOT Editing) */
          <>
            {/* Section: Account */}
            <Text style={styles.sectionHeader}>Account</Text>
            <View style={styles.sectionContainer}>
              <MenuItem 
                icon="person-outline" 
                text="Edit Profile" 
                onPress={() => setIsEditing(true)} 
              />
            </View>

            {/* Section: General */}
            <Text style={styles.sectionHeader}>General</Text>
            <View style={styles.sectionContainer}>
              {/* About Us Toggle */}
              <MenuItem 
                icon="information-circle-outline" 
                text="About Us" 
                onPress={() => setShowAbout(!showAbout)} 
              />
              
              {/* Log Out */}
              <MenuItem 
                icon="log-out-outline" 
                text="Log Out" 
                onPress={logout}
                isDestructive={true}
              />
            </View>
          </>
        )}

        {/* 4. ABOUT US CARD (Reveals when clicked) */}
        {showAbout && (
          <View style={styles.aboutCard}>
            <View style={styles.aboutHeader}>
              <Ionicons name="code-slash" size={18} color={COLORS.primaryGreen} />
              <Text style={styles.aboutTitle}>Behind the Code</Text>
            </View>
            <Text style={styles.aboutText}>
              CookPal was architected and developed by <Text style={styles.highlight}>two engineering students</Text>. 
              {'\n\n'}Created as an <Text style={styles.highlight}>End-of-Module Project</Text>, 
              combining culinary passion with software engineering.
            </Text>
          </View>
        )}
=======
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
>>>>>>> ee323f7590cd84f0dbe9c8f0caf4bb7456f60d43

      </ScrollView>
    </SafeAreaView>
  );
<<<<<<< HEAD
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20 },

  headerProfile: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatarContainer: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primaryGreen,
    justifyContent: 'center', alignItems: 'center', marginBottom: 15
  },
  username: { fontSize: 22, fontWeight: 'bold', color: COLORS.textWhite },
  email: { fontSize: 14, color: COLORS.textGray, marginTop: 5 },

  sectionHeader: { 
    fontSize: 16, fontWeight: 'bold', color: COLORS.textWhite, 
    marginBottom: 10, marginTop: 10, marginLeft: 5 
  },
  sectionContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 36, height: 36, borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: { fontSize: 16, color: COLORS.textWhite, fontWeight: '500' },

  editSection: {
    backgroundColor: COLORS.surface,
    padding: 20, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textWhite, marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10, paddingHorizontal: 15, height: 50, marginBottom: 15,
    borderWidth: 1, borderColor: COLORS.border
  },
  input: { flex: 1, color: COLORS.textWhite, fontSize: 16 },
  editButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelButton: { 
    flex: 1, backgroundColor: COLORS.border, 
    padding: 12, borderRadius: 10, marginRight: 10, alignItems: 'center' 
  },
  cancelText: { color: COLORS.textWhite, fontWeight: 'bold' },
  saveButton: { 
    flex: 1, backgroundColor: COLORS.primaryGreen, 
    padding: 12, borderRadius: 10, alignItems: 'center' 
  },
  saveText: { color: '#000', fontWeight: 'bold' },

  aboutCard: {
    backgroundColor: COLORS.surface,
    padding: 20, borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.primaryGreen,
    marginTop: 10
  },
  aboutHeader: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 15,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingVertical: 6, paddingHorizontal: 15, borderRadius: 20
  },
  aboutTitle: { 
    color: COLORS.primaryGreen, fontWeight: 'bold', fontSize: 12, 
    textTransform: 'uppercase', marginLeft: 8 
  },
  aboutText: { color: COLORS.textGray, textAlign: 'center', lineHeight: 22, marginBottom: 15 },
  highlight: { color: COLORS.textWhite, fontWeight: 'bold' },
  versionText: { color: '#555', fontSize: 12, fontStyle: 'italic' },
});

export default ProfileScreen;
=======
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
