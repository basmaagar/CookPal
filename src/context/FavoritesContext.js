import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // 1. LOAD FAVORITES WHEN APP STARTS
  useEffect(() => {
    loadFavorites();
  }, []);

  // 2. SAVE FAVORITES WHENEVER THEY CHANGE
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('my_favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.log("Error loading favorites:", error);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem('my_favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.log("Error saving favorites:", error);
    }
  };

  const toggleFavorite = (recipe) => {
    // Check if recipe is already in favorites (Handle both API and Mock IDs)
    const recipeId = recipe.idMeal || recipe.id;
    
    const isFavorite = favorites.some(item => (item.idMeal || item.id) === recipeId);

    if (isFavorite) {
      // Remove it
      setFavorites(favorites.filter(item => (item.idMeal || item.id) !== recipeId));
    } else {
      // Add it
      setFavorites([...favorites, recipe]);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};