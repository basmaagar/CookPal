import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { 
  initDB, 
  registerUserInDB, 
  loginUserInDB, 
  updateUserInDB 
} from '../services/database';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize DB on mount
  useEffect(() => {
    const prepareDB = async () => {
      await initDB();
    };
    prepareDB();
  }, []);

  // Register
  const register = async (username, email, password) => {
    setIsLoading(true);
    try {
      await registerUserInDB(username, email, password);
      // Auto-login logic: create a user object to set in state immediately
      // Note: We don't have the ID yet unless we query it back, but for UI flows this is often enough
      // or you can immediately call login() to get the full object.
      const loggedUser = await loginUserInDB(email, password);
      setUser(loggedUser);
    } catch (error) {
      console.error(error);
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        Alert.alert('Error', 'This email is already registered.');
      } else {
        Alert.alert('Error', 'Could not register user.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const userData = await loginUserInDB(email, password);
      if (userData) {
        setUser(userData);
      } else {
        Alert.alert('Error', 'Invalid email or password.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong during login.');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
  };

  // Update Profile
  const updateProfile = async (newUsername, newPassword) => {
    if (!user || !user.id) return;

    setIsLoading(true);
    try {
      await updateUserInDB(user.id, newUsername, newPassword);
      
      // Update local state immediately so UI reflects changes
      setUser(prev => ({
        ...prev,
        username: newUsername,
        // We generally don't store the plain text password in the user state context for security,
        // but if your logic relies on it, you could update it here too.
      }));

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};