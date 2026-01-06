import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, 
  SafeAreaView, StatusBar, Modal, TextInput, Platform, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- Import Storage
import COLORS from '../constants/colors';

export default function MealPlansScreen() {
  // --- STATE ---
  const [selectedDate, setSelectedDate] = useState(null);
  const [weekDays, setWeekDays] = useState([]);
  
  // Stores meals: { "2023-10-25": [{ id: 1, type: 'Breakfast', name: 'Oatmeal' }] }
  const [mealPlan, setMealPlan] = useState({});

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newMealName, setNewMealName] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');

  const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  // --- 1. GENERATE DATES (Next 7 Days) ---
  useEffect(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Mon"
      const dayNumber = date.getDate(); // e.g., 25
      const fullDate = date.toISOString().split('T')[0]; // "2023-10-25" (Key for storage)
      
      days.push({ dayName, dayNumber, fullDate });
    }
    
    setWeekDays(days);
    setSelectedDate(days[0].fullDate); // Select today by default
  }, []);

  // --- 2. LOAD SAVED DATA (AsyncStorage) ---
  useEffect(() => {
    const loadMeals = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem('my_meal_plan');
        if (storedMeals) {
          setMealPlan(JSON.parse(storedMeals));
        }
      } catch (e) {
        console.error("Failed to load meals", e);
      }
    };
    loadMeals();
  }, []);

  // --- 3. SAVE DATA AUTOMATICALLY (AsyncStorage) ---
  useEffect(() => {
    const saveMeals = async () => {
      try {
        // Only save if we have initialized the object (prevents overwriting with empty on first load)
        if (Object.keys(mealPlan).length > 0) {
           await AsyncStorage.setItem('my_meal_plan', JSON.stringify(mealPlan));
        }
      } catch (e) {
        console.error("Failed to save meals", e);
      }
    };
    saveMeals();
  }, [mealPlan]);

  // --- ADD MEAL FUNCTION ---
  const handleAddMeal = () => {
    if (newMealName.trim().length === 0) {
      Alert.alert("Error", "Please enter a meal name.");
      return;
    }

    const newMeal = {
      id: Date.now().toString(),
      type: selectedMealType,
      name: newMealName
    };

    const currentMeals = mealPlan[selectedDate] || [];
    
    const updatedPlan = {
      ...mealPlan,
      [selectedDate]: [...currentMeals, newMeal]
    };

    setMealPlan(updatedPlan);
    
    // Explicit save call to ensure it saves immediately (redundancy for safety)
    AsyncStorage.setItem('my_meal_plan', JSON.stringify(updatedPlan));

    // Reset and Close
    setNewMealName('');
    setModalVisible(false);
  };

  // --- DELETE MEAL FUNCTION ---
  const handleDeleteMeal = (mealId) => {
    const currentMeals = mealPlan[selectedDate];
    const updatedMeals = currentMeals.filter(meal => meal.id !== mealId);
    
    const updatedPlan = {
      ...mealPlan,
      [selectedDate]: updatedMeals
    };

    setMealPlan(updatedPlan);
    AsyncStorage.setItem('my_meal_plan', JSON.stringify(updatedPlan));
  };

  // --- RENDER HELPERS ---
  const renderDateItem = ({ item }) => {
    const isSelected = selectedDate === item.fullDate;
    return (
      <TouchableOpacity 
        style={[styles.dateBox, isSelected && styles.dateBoxActive]}
        onPress={() => setSelectedDate(item.fullDate)}
      >
        <Text style={[styles.dayName, isSelected && styles.textActive]}>{item.dayName}</Text>
        <Text style={[styles.dayNumber, isSelected && styles.textActive]}>{item.dayNumber}</Text>
        {isSelected && <View style={styles.dotIndicator} />}
      </TouchableOpacity>
    );
  };

  const renderMealSection = (type) => {
    const daysMeals = mealPlan[selectedDate] || [];
    const mealsForType = daysMeals.filter(m => m.type === type);

    return (
      <View style={styles.sectionContainer} key={type}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{type}</Text>
          <TouchableOpacity 
            onPress={() => {
              setSelectedMealType(type);
              setModalVisible(true);
            }}
          >
            <Ionicons name="add-circle" size={26} color={COLORS.primaryGreen} />
          </TouchableOpacity>
        </View>

        {mealsForType.length === 0 ? (
          <Text style={styles.emptyText}>No meals planned.</Text>
        ) : (
          mealsForType.map(meal => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealLeft}>
                 <View style={styles.mealDot} />
                 <Text style={styles.mealName}>{meal.name}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteMeal(meal.id)}>
                <Ionicons name="trash-outline" size={20} color="#FF6347" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Weekly Plan</Text>
        <Text style={styles.headerSubtitle}>Stay organized, eat healthy.</Text>
      </View>

      {/* CALENDAR STRIP */}
      <View style={styles.calendarContainer}>
        <FlatList
          data={weekDays}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.fullDate}
          renderItem={renderDateItem}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        />
      </View>

      {/* MEAL SECTIONS */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {MEAL_TYPES.map(type => renderMealSection(type))}
      </ScrollView>

      {/* --- ADD MEAL MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add to {selectedMealType}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="What are you eating?"
              placeholderTextColor="#ccc"
              value={newMealName}
              onChangeText={setNewMealName}
              autoFocus={true}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.btn, styles.btnCancel]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.btn, styles.btnSave]} 
                onPress={handleAddMeal}
              >
                <Text style={styles.btnTextSave}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundBg },
  
  // Header
  header: { padding: 20, paddingTop: Platform.OS === 'android' ? 40 : 20, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.textDark },
  headerSubtitle: { fontSize: 14, color: COLORS.gray, marginTop: 5 },

  // Calendar
  calendarContainer: { marginVertical: 10, paddingBottom: 10 },
  dateBox: {
    width: 60, height: 80, 
    borderRadius: 18, backgroundColor: '#FFF', 
    justifyContent: 'center', alignItems: 'center', 
    marginRight: 10,
    borderWidth: 1, borderColor: '#F0F0F0',
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.05
  },
  dateBoxActive: { backgroundColor: COLORS.primaryGreen, borderColor: COLORS.primaryGreen },
  dayName: { fontSize: 14, color: COLORS.gray, marginBottom: 5 },
  dayNumber: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark },
  textActive: { color: '#FFF' },
  dotIndicator: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#FFF', marginTop: 5 },

  // Content
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },
  sectionContainer: { marginBottom: 25 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark },
  emptyText: { fontStyle: 'italic', color: '#ccc', marginLeft: 10 },

  // Meal Card
  mealCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.03, elevation: 1
  },
  mealLeft: { flexDirection: 'row', alignItems: 'center' },
  mealDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.accentOrange, marginRight: 10 },
  mealName: { fontSize: 16, color: COLORS.textDark, fontWeight: '500' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 25, elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#F5F5F5', borderRadius: 10, padding: 15, fontSize: 16, 
    color: COLORS.textDark, marginBottom: 25
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center' },
  btnCancel: { backgroundColor: '#F5F5F5', marginRight: 10 },
  btnSave: { backgroundColor: COLORS.primaryGreen, marginLeft: 10 },
  btnTextCancel: { color: COLORS.gray, fontWeight: 'bold' },
  btnTextSave: { color: '#FFF', fontWeight: 'bold' }
});