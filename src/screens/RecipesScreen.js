import React, { useState, useContext } from 'react';
import {
  StyleSheet, Text, View, FlatList, Image, TouchableOpacity,
  StatusBar, Platform, Modal, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { FavoritesContext } from '../context/FavoritesContext';

// --- MOCK DATA ---
const CATEGORIES = ['All', 'Favorites', 'Quick & Easy', 'Desserts'];

const RECIPES_DATA = [
  {
    id: '1',
    name: 'Creamy Tomato Pasta',
    image: 'https://www.themealdb.com/images/media/meals/wvqpwt1468339226.jpg',
    rating: 5.0, reviews: 15, category: 'Quick & Easy',
    instructions: 'Boil pasta. Cook tomatoes with cream and garlic. Mix together and serve with basil.',
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    image: 'https://www.themealdb.com/images/media/meals/sctuuy1511383135.jpg',
    rating: 4.8, reviews: 24, category: 'Quick & Easy',
    instructions: 'Grill chicken breast until golden. Toss lettuce, cucumber, and tomatoes. Add chicken and dressing.',
  },
  {
    id: '3',
    name: 'Blueberry Pancakes',
    image: 'https://www.themealdb.com/images/media/meals/rwuyqx1511383174.jpg',
    rating: 4.9, reviews: 120, category: 'Desserts',
    instructions: 'Mix flour, milk, eggs, and blueberries. Pour batter onto a hot pan. Flip when bubbly. Serve with syrup.',
  },
];

export default function RecipesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  // --- FILTER LOGIC ---
  const getFilteredRecipes = () => {
    if (selectedCategory === 'All') return RECIPES_DATA;
    if (selectedCategory === 'Favorites') return favorites; 
    return RECIPES_DATA.filter(item => item.category === selectedCategory);
  };

  const filteredRecipes = getFilteredRecipes();

  // --- HANDLE CARD PRESS (FETCH LOGIC ADDED) ---
  const handleRecipePress = async (item) => {
    setModalVisible(true);
    setLoadingDetails(true);
    setSelectedRecipe(null); // Clear previous data

    // 1. Check if it's Mock Data (already has instructions)
    if (item.instructions) {
      setSelectedRecipe(item);
      setLoadingDetails(false);
      return;
    }

    // 2. If it's API Data, we need to FETCH the details using the ID
    const recipeId = item.idMeal || item.id;
    
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
      const data = await response.json();
      
      if (data.meals) {
        const apiMeal = data.meals[0];
        // Convert API format to our app format
        setSelectedRecipe({
          name: apiMeal.strMeal,
          image: apiMeal.strMealThumb,
          instructions: apiMeal.strInstructions,
          category: apiMeal.strCategory
        });
      } else {
        Alert.alert("Error", "Could not load recipe details.");
        setModalVisible(false);
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Check your internet connection.");
      setModalVisible(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const renderRecipeCard = ({ item }) => {
    // Check ID (API uses idMeal, Mock uses id)
    const currentId = item.id || item.idMeal;
    const isFavorite = favorites.some(fav => (fav.id === currentId || fav.idMeal === currentId));
    
    const imageUrl = item.image || item.strMealThumb;
    const recipeName = item.name || item.strMeal;

    return (
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.9}
        onPress={() => handleRecipePress(item)} 
      >
        <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        
        <TouchableOpacity style={styles.heartIcon} onPress={() => toggleFavorite(item)}>
           <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#E91E63" : "#FFF"} />
        </TouchableOpacity>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{recipeName}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating || '4.5'} ({item.reviews || '10'} reviews)</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Recipes</Text>
          </View>
        </SafeAreaView>
      </View>

      {/* CATEGORIES */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={CATEGORIES}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.categoryBtn, selectedCategory === item && styles.categoryBtnActive]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[styles.categoryText, selectedCategory === item && styles.categoryTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* GRID */}
      <FlatList
        data={filteredRecipes}
        keyExtractor={item => (item.id || item.idMeal).toString()}
        renderItem={renderRecipeCard}
        numColumns={2} 
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
      />

      {/* --- RECIPE DETAILS MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {loadingDetails ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primaryGreen} />
                <Text style={{ marginTop: 10, color: COLORS.gray }}>Loading Recipe...</Text>
              </View>
            ) : (
              selectedRecipe && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Image source={{ uri: selectedRecipe.image }} style={styles.modalImage} />
                  <Text style={styles.modalTitle}>{selectedRecipe.name}</Text>
                  
                  <Text style={styles.sectionHeader}>Instructions</Text>
                  <Text style={styles.instructions}>{selectedRecipe.instructions}</Text>

                  <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </ScrollView>
              )
            )}

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#121212' },
  headerContainer: { backgroundColor: '#121212', paddingBottom: 15, paddingTop: Platform.OS === 'android' ? 30 : 0 },
  headerContent: { alignItems: 'center', marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  categoryContainer: { marginVertical: 20 },
  categoryBtn: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  categoryBtnActive: { backgroundColor: COLORS.accentOrange, borderColor: COLORS.accentOrange },
  categoryText: { fontWeight: '600', color: '#FFF' },
  categoryTextActive: { color: '#FFF' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { width: '48%', backgroundColor: '#1A1A1A', borderRadius: 15, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardImage: { width: '100%', height: 140, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  heartIcon: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.3)', padding: 5, borderRadius: 20 },
  cardContent: { padding: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 10, color: '#CCC', marginLeft: 5 },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', height: '85%', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20 },
  modalImage: { width: '100%', height: 250, borderRadius: 15, marginBottom: 15 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: COLORS.textDark },
  sectionHeader: { fontSize: 18, fontWeight: '600', marginBottom: 5, color: COLORS.accentOrange },
  instructions: { fontSize: 16, lineHeight: 24, color: '#555', marginBottom: 30 },
  closeButton: { backgroundColor: COLORS.textDark, padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  closeButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});