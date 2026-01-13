import React, { useContext } from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Imports
import HomeScreen from './src/screens/HomeScreen';
import RecipesScreen from './src/screens/RecipesScreen';
import MealPlansScreen from './src/screens/MealPlansScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen'; // <--- Import Login
import SignUpScreen from './src/screens/SignUpScreen'; // <--- Import SignUp

// Contexts
import { FavoritesProvider } from './src/context/FavoritesContext';
import { AuthProvider, AuthContext } from './src/context/AuthContext'; // <--- Import Auth
import COLORS from './src/constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Auth Stack for Login and SignUp
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

// Create a Component for the Tab Navigation (The "Main App")
const MainAppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: { backgroundColor: '#ffffff', height: 60, borderTopWidth: 0, elevation: 5, paddingBottom: 10 },
      tabBarActiveTintColor: COLORS.primaryGreen,
      tabBarInactiveTintColor: 'gray',
      tabBarIcon: ({ focused, color }) => {
        let iconName;
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Favorites') iconName = focused ? 'heart' : 'heart-outline';
        else if (route.name === 'MealPlans') iconName = focused ? 'calendar' : 'calendar-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName} size={28} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Favorites" component={RecipesScreen} />
    <Tab.Screen name="MealPlans" component={MealPlansScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// The Root Navigator decides between Login or Main App
const RootNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
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
    <AuthProvider>
      <FavoritesProvider>
         <RootNavigator />
      </FavoritesProvider>
    </AuthProvider>
  );
}