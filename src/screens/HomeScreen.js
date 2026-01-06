import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  Keyboard, Animated, ScrollView, SafeAreaView, StatusBar, 
  Platform, Alert, ActivityIndicator, Image, Dimensions
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
  const [searchMode, setSearchMode] = useState(null); 
  const [query, setQuery] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [myIngredients, setMyIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- API LOGIC (Unchanged) ---
  const searchByName = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await response.json();
      setRecipes(data.meals || []);
    } finally { setLoading(false); Keyboard.dismiss(); }
  };

  const searchByIngredients = async () => {
    if (myIngredients.length === 0) return;
    setLoading(true);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${myIngredients[0]}`);
      const data = await response.json();
      setRecipes(data.meals || []);
    } finally { setLoading(false); }
  };

  const addIngredient = () => {
    if (ingredient.trim() && !myIngredients.includes(ingredient.trim())) {
      setMyIngredients([...myIngredients, ingredient.trim()]);
      setIngredient('');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        snapToInterval={SCREEN_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
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

        {/* SECTION 2: CHOOSE YOUR PATH (GRADIENT/SMOOTH TRANSITION) */}
        <View style={styles.choiceSectionContainer}>
          {/* We use a background color that matches the carousel overlay (dark) */}
          <View style={styles.darkBackgroundFill} />
          
          {!searchMode ? (
            <View style={styles.centeredWrapper}>
              <Text style={styles.centeredTitle}>Choose your path</Text>
              <View style={styles.choiceRow}>
                <TouchableOpacity style={styles.choiceCard} onPress={() => setSearchMode('recipe')}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="restaurant" size={32} color="#FFF" />
                  </View>
                  <Text style={styles.choiceText}>Search by{"\n"}Recipe Name</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.choiceCard} onPress={() => setSearchMode('ingredients')}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="basket" size={32} color="#FFF" />
                  </View>
                  <Text style={styles.choiceText}>Search by{"\n"}Ingredients</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* SEARCH ACTIVE AREA */
            <View style={styles.searchActiveContent}>
              <TouchableOpacity onPress={() => {setSearchMode(null); setRecipes([]);}} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={20} color="#FFF" />
                <Text style={{color: '#FFF', marginLeft: 5}}>Change Mode</Text>
              </TouchableOpacity>

              <View style={styles.searchBox}>
                <TextInput 
                  style={styles.input} 
                  placeholder={searchMode === 'recipe' ? "Search recipe..." : "Add ingredient..."}
                  placeholderTextColor="#999"
                  value={searchMode === 'recipe' ? query : ingredient}
                  onChangeText={searchMode === 'recipe' ? setQuery : setIngredient}
                  onSubmitEditing={searchMode === 'recipe' ? searchByName : addIngredient}
                />
                <TouchableOpacity style={styles.actionBtn} onPress={searchMode === 'recipe' ? searchByName : addIngredient}>
                  <Ionicons name={searchMode === 'recipe' ? "search" : "add"} size={20} color="#FFF" />
                </TouchableOpacity>
              </View>

              {/* Ingredients Chips */}
              {searchMode === 'ingredients' && (
                <View style={styles.chipsContainer}>
                    {myIngredients.map((item, i) => (
                      <View key={i} style={styles.chip}>
                        <Text style={{color: '#FFF'}}>{item}</Text>
                        <TouchableOpacity onPress={() => setMyIngredients(myIngredients.filter((_, idx) => idx !== i))}>
                           <Ionicons name="close-circle" size={16} color="#FFF" style={{marginLeft: 5}}/>
                        </TouchableOpacity>
                      </View>
                    ))}
                    {myIngredients.length > 0 && (
                        <TouchableOpacity style={styles.miniFindBtn} onPress={searchByIngredients}>
                            <Text style={{color: '#FFF', fontWeight: 'bold'}}>Search</Text>
                        </TouchableOpacity>
                    )}
                </View>
              )}

              {/* RESULTS */}
              {loading ? (
                <ActivityIndicator size="large" color="#FFF" style={{marginTop: 50}} />
              ) : (
                <View style={styles.resultsList}>
                  {recipes.map((recipe) => (
                    <View key={recipe.idMeal} style={styles.card}>
                      <Image source={{ uri: recipe.strMealThumb }} style={styles.cardImage} />
                      <View style={styles.cardInfo}>
                        <Text style={styles.cardTitle}>{recipe.strMeal}</Text>
                        <TouchableOpacity onPress={() => toggleFavorite(recipe)}>
                           <Ionicons name={favorites.some(f => f.idMeal === recipe.idMeal) ? "heart" : "heart-outline"} size={26} color="#FF4B4B" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

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
  actionBtn: { backgroundColor: COLORS.primaryGreen || '#4CAF50', padding: 15, borderRadius: 15 },
  
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 15, alignItems: 'center' },
  chip: { backgroundColor: 'rgba(255,255,255,0.15)', flexDirection: 'row', padding: 10, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  miniFindBtn: { backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, marginBottom: 8 },

  resultsList: { marginTop: 30, paddingBottom: 100 },
  card: { backgroundColor: '#252525', borderRadius: 25, marginBottom: 20, overflow: 'hidden' },
  cardImage: { width: '100%', height: 220 },
  cardInfo: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', flex: 1 }
});