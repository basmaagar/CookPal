import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { AuthContext } from '../context/AuthContext';

export default function SignupScreen({ navigation }) {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // Get functions from Context
  const { register, isLoading } = useContext(AuthContext);

  const handleSignup = () => {
    if (!username || !email || !password) {
      return Alert.alert("Error", "Please fill in all fields");
    }
    register(username, email, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="restaurant" size={40} color={COLORS.primaryGreen} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us and start cooking!</Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>

          {/* USERNAME INPUT */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="words"
              placeholderTextColor="#666"
            />
          </View>

          {/* EMAIL INPUT */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#666"
            />
          </View>

          {/* PASSWORD INPUT */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#666"
            />
          </View>

          {/* SIGN UP BUTTON */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.signupButtonText}>SIGN UP</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* FOOTER (Navigate to Login) */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: { flex: 1, justifyContent: 'center', padding: 25 },

  header: { alignItems: 'center', marginBottom: 40 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(76,175,80,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#CCC', textAlign: 'center' },

  form: { marginBottom: 30 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12,
    paddingHorizontal: 15, marginBottom: 15, height: 55,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: '100%', color: '#FFF' },

  signupButton: {
    backgroundColor: '#4CAF50', height: 55, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#4CAF50', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 5}, elevation: 5
  },
  signupButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: '#CCC', fontSize: 16 },
  loginText: { color: '#4CAF50', fontSize: 16, fontWeight: 'bold' }
});
