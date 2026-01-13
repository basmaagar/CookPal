import React, { createContext, useState, useEffect } from 'react';
import { initDB, findUser, createUser, findUserByEmail } from '../../database'; // Importez vos fonctions

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialisation de la base de données au lancement de l'app
  useEffect(() => {
    initDB();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      // Recherche l'utilisateur en base de données
      const existingUser = findUser(email, password);

      if (existingUser) {
        setUser({
          name: existingUser.name,
          email: existingUser.email,
          handle: existingUser.handle
        });
      } else {
        alert("Identifiants incorrects");
      }
    } catch (error) {
      console.error("Erreur SQL :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };
const register = async (name, email, password, handle) => {
  setIsLoading(true);
  try {
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      Alert.alert("Error", "Email already exists.");
      return;
    }
    createUser(name, email, password, handle);
    setUser({ name, email, handle });
  } catch (error) {
    Alert.alert("Error", "Database error.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};