import React, { useState, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, isLoading } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="restaurant" size={40} color={COLORS.primaryGreen} />
          </View>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue your tasty journey.</Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotPass}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => login(email, password)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.loginButtonText}>LOG IN</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { flex: 1, justifyContent: 'center', padding: 25 },
  
  header: { alignItems: 'center', marginBottom: 40 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8F5E9',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20
  },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 10 },
  subtitle: { fontSize: 16, color: COLORS.gray, textAlign: 'center' },

  form: { marginBottom: 30 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.backgroundBg, borderRadius: 12,
    paddingHorizontal: 15, marginBottom: 15, height: 55,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: '100%', color: COLORS.textDark },
  
  forgotPass: { alignSelf: 'flex-end', marginBottom: 25 },
  forgotText: { color: COLORS.primaryGreen, fontWeight: '600' },

  loginButton: {
    backgroundColor: COLORS.primaryGreen, height: 55, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: COLORS.primaryGreen, shadowOpacity: 0.3, shadowOffset: {width: 0, height: 5}, elevation: 5
  },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: COLORS.gray, fontSize: 16 },
  signupText: { color: COLORS.primaryGreen, fontSize: 16, fontWeight: 'bold' }
});