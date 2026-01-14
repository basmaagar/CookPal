import React, { useState, useContext, useRef, useEffect, useMemo } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  Keyboard, Animated, ScrollView, StatusBar,
  Alert, ActivityIndicator, Image, Dimensions, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { FavoritesContext } from '../context/FavoritesContext';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?q=80&w=1600&auto=format&fit=crop'
];

export default function HomeScreen() {
  const [searchMode, setSearchMode] = useState(null); // 'recipe' | 'ingredients' | null
  const [inputs, setInputs] = useState({ query: '', ingredient: '' });
  const [myIngredients, setMyIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState({ list: false, details: false });
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  // --- EFFETS ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImgIndex(prev => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- LOGIQUE API ---
  const apiCall = async (url, target = 'list') => {
    setLoading(prev => ({ ...prev, [target === 'list' ? 'list' : 'details']: true }));
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.meals || [];
    } catch (e) {
      Alert.alert('Erreur', 'Connexion au serveur impossible');
      return [];
    } finally {
      setLoading(prev => ({ ...prev, [target === 'list' ? 'list' : 'details']: false }));
      Keyboard.dismiss();
    }
  };

  const handleSearch = async () => {
    if (searchMode === 'recipe') {
      if (!inputs.query.trim()) return;
      const res = await apiCall(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputs.query}`);
      setRecipes(res);
    } else {
      if (myIngredients.length === 0) return;
      const res = await apiCall(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${myIngredients[0]}`);
      setRecipes(res);
    }
  };

  const addIngredient = () => {
    if (inputs.ingredient.trim() && !myIngredients.includes(inputs.ingredient.trim())) {
      setMyIngredients([...myIngredients, inputs.ingredient.trim()]);
      setInputs(prev => ({ ...prev, ingredient: '' }));
    }
  };

  const showDetails = async (id) => {
    setSelectedRecipe(null);
    const res = await apiCall(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`, 'details');
    if (res.length) setSelectedRecipe(res[0]);
  };

  // --- RENDER HELPERS ---
  const isFav = (id) => favorites.some(f => f.idMeal === id);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16} snapToInterval={SCREEN_HEIGHT} decelerationRate="fast"
      >
        {/* SECTION 1: HERO */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: CAROUSEL_IMAGES[currentImgIndex] }} style={StyleSheet.absoluteFillObject} />
          <View style={styles.overlay} />
          <View style={styles.heroTextContainer}>
            <Text style={styles.welcomeText}>CookPal</Text>
            <Text style={styles.valueProp}>Your personal kitchen assistant.</Text>
          </View>
        </View>

        {/* SECTION 2: CONTENT */}
        <View style={styles.choiceSectionContainer}>
          {!searchMode ? (
            <View style={styles.centeredWrapper}>
              <Text style={styles.centeredTitle}>Choose your path</Text>
              <View style={styles.choiceRow}>
                <MenuCard icon="restaurant" label="Recipe Name" onPress={() => setSearchMode('recipe')} />
                <MenuCard icon="basket" label="Ingredients" onPress={() => setSearchMode('ingredients')} />
              </View>
            </View>
          ) : (
            <View style={styles.searchActiveContent}>
              <TouchableOpacity onPress={() => { setSearchMode(null); setRecipes([]); }} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={20} color="#FFF" />
                <Text style={{ color: '#FFF', marginLeft: 5 }}>Back</Text>
              </TouchableOpacity>

              <View style={styles.searchBox}>
                <TextInput
                  style={styles.input}
                  placeholder={searchMode === 'recipe' ? "Search recipe..." : "Add ingredient..."}
                  placeholderTextColor="#999"
                  value={searchMode === 'recipe' ? inputs.query : inputs.ingredient}
                  onChangeText={(val) => setInputs(prev => ({ ...prev, [searchMode === 'recipe' ? 'query' : 'ingredient']: val }))}
                  onSubmitEditing={searchMode === 'recipe' ? handleSearch : addIngredient}
                />
                <TouchableOpacity style={styles.actionBtn} onPress={searchMode === 'recipe' ? handleSearch : addIngredient}>
                  <Ionicons name={searchMode === 'recipe' ? "search" : "add"} size={20} color="#b51919" />
                </TouchableOpacity>
              </View>

              {searchMode === 'ingredients' && (
                <View style={styles.chipsContainer}>
                  {myIngredients.map((item, i) => (
                    <View key={i} style={styles.chip}>
                      <Text style={{ color: '#FFF' }}>{item}</Text>
                      <TouchableOpacity onPress={() => setMyIngredients(myIngredients.filter((_, idx) => idx !== i))}>
                        <Ionicons name="close-circle" size={16} color="#FFF" style={{ marginLeft: 5 }} />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {myIngredients.length > 0 && (
                    <TouchableOpacity style={styles.miniFindBtn} onPress={handleSearch}>
                      <Text style={{ fontWeight: 'bold' }}>Search</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {loading.list ? (
                <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 50 }} />
              ) : (
                <View style={styles.resultsList}>
                  {recipes.map((recipe) => (
                    <RecipeCard 
                        key={recipe.idMeal} 
                        recipe={recipe} 
                        onPress={() => showDetails(recipe.idMeal)} 
                        isFavorite={isFav(recipe.idMeal)}
                        onToggleFav={() => toggleFavorite(recipe)}
                    />
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </Animated.ScrollView>

      <RecipeModal 
        visible={!!selectedRecipe || loading.details} 
        recipe={selectedRecipe} 
        loading={loading.details} 
        onClose={() => setSelectedRecipe(null)} 
      />
    </View>
  );
}

// --- SOUS-COMPOSANTS ---

const MenuCard = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.choiceCard} onPress={onPress}>
    <View style={styles.iconCircle}><Ionicons name={icon} size={32} color="#FFF" /></View>
    <Text style={styles.choiceText}>Search by{"\n"}{label}</Text>
  </TouchableOpacity>
);

const RecipeCard = ({ recipe, onPress, isFavorite, onToggleFav }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: recipe.strMealThumb }} style={styles.cardImage} />
    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle}>{recipe.strMeal}</Text>
      <TouchableOpacity onPress={onToggleFav}>
        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={26} color="#FF4B4B" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const RecipeModal = ({ visible, recipe, loading, onClose }) => (
  <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : recipe && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={{ uri: recipe.strMealThumb }} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{recipe.strMeal}</Text>
            <Text style={styles.sectionHeader}>Instructions</Text>
            <Text style={styles.instructions}>{recipe.strInstructions}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </View>
  </Modal>
);


const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#121212' }, // Dark base
  
  // Hero
  heroContainer: { height: SCREEN_HEIGHT, width: SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  heroTextContainer: { paddingHorizontal: 30, alignItems: 'center' },
  welcomeText: { color: '#FFF', fontSize: 50, fontWeight: 'bold' },
  valueProp: { color: '#CCC', fontSize: 18, textAlign: 'center', marginTop: 10 },

  // Seamless Choice Section
  choiceSectionContainer: { 
    minHeight: SCREEN_HEIGHT, 
    width: SCREEN_WIDTH, 
    backgroundColor: '#1A1A1A', // Matches the overlay of the carousel
  },
  centeredWrapper: {
    flex: 1,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  centeredTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 40 },
  choiceRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  
  choiceCard: { 
    width: '47%', 
    backgroundColor: 'rgba(255,255,255,0.08)', // Glassmorphism effect
    paddingVertical: 35, 
    borderRadius: 30, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  iconCircle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 15
  },
  choiceText: { fontSize: 16, fontWeight: '700', color: '#FFF', textAlign: 'center' },

  // Active Search UI
  searchActiveContent: { padding: 25, paddingTop: 60 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  searchBox: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 20, 
    padding: 5, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  input: { flex: 1, padding: 15, color: '#FFF', fontSize: 16 },
  actionBtn: { padding: 15, borderRadius: 15 },
  
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 15, alignItems: 'center' },
  chip: { backgroundColor: 'rgba(255,255,255,0.15)', flexDirection: 'row', padding: 10, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  miniFindBtn: { backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, marginBottom: 8 },

  resultsList: { marginTop: 30, paddingBottom: 100 },
  card: { backgroundColor: '#252525', borderRadius: 25, marginBottom: 20, overflow: 'hidden' },
  cardImage: { width: '100%', height: 220 },
  cardInfo: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', flex: 1 },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, width: '90%', maxHeight: '80%' },
  modalImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 15 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  instructions: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 20 },
  closeButton: { backgroundColor: COLORS.primaryGreen || '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center' },
  closeButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
