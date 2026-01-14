import React, { useContext } from 'react';
import { StatusBar, ActivityIndicator, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Imports des Ecrans
import HomeScreen from './src/screens/HomeScreen';
import RecipesScreen from './src/screens/RecipesScreen';
import MealPlansScreen from './src/screens/MealPlansScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';

// Contexts
import { FavoritesProvider } from './src/context/FavoritesContext';
import { AuthProvider, AuthContext } from './src/context/AuthContext';

// Couleurs (Vous pouvez modifier ici)
const COLORS = {
  primaryGreen: '#4CAF50', // Vert CookPal
  darkBackground: '#1E1E1E', // Gris Foncé pour la barre
  inactive: '#888888',     // Gris pour les icônes inactives
  white: '#FFFFFF'
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// --- LE DESIGN DE LA BARRE EST ICI ---
const MainAppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: false, // On cache le texte pour un look plus propre
      
      // Style de la barre flottante
      tabBarStyle: {
        position: 'absolute', // Rend la barre flottante
        bottom: 20,           // Marge du bas
        left: 20,             // Marge gauche
        right: 20,            // Marge droite
        elevation: 5,         // Ombre pour Android
        backgroundColor: COLORS.darkBackground, // Couleur de fond (Gris Foncé)
        borderRadius: 15,     // Bords arrondis
        height: 60,           // Hauteur de la barre
        borderTopWidth: 0,    // Enlève la ligne blanche du haut
        shadowColor: '#000',  // Ombre pour iOS
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        paddingBottom: 0,      // Centre les icônes
      },
      
      tabBarActiveTintColor: COLORS.primaryGreen,
      tabBarInactiveTintColor: COLORS.inactive,
      
      // Icônes
      tabBarIcon: ({ focused, color }) => {
        let iconName;
        let size = 26;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Favorites') {
          iconName = focused ? 'heart' : 'heart-outline';
        } else if (route.name === 'MealPlans') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        // Si l'onglet est sélectionné, on peut ajouter un petit effet (cercle de fond par exemple)
        // Ici, on garde simple
        return (
          <View style={{
            alignItems: 'center', 
            justifyContent: 'center',
            top: Platform.OS === 'ios' ? 10 : 0 // Ajustement position iOS
          }}>
            <Ionicons name={iconName} size={size} color={color} />
          </View>
        );
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Favorites" component={RecipesScreen} />
    <Tab.Screen name="MealPlans" component={MealPlansScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

// Navigation Racine (Auth vs App)
const RootNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color={COLORS.primaryGreen} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainAppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FavoritesProvider>
          {/* StatusBar en mode sombre pour aller avec le thème */}
          <StatusBar barStyle="light-content" backgroundColor="#121212" />
          <RootNavigator />
        </FavoritesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}