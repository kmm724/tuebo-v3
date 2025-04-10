import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

import { loadData, saveData } from './src/utils/storage';

const Tab = createBottomTabNavigator();

export default function App() {
  const [favorites, setFavorites] = useState<
    { term: string; summary: string; imageUrl: string | null }[]
  >([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const loadedFavorites = await loadData('favorites', []);
      const loadedHistory = await loadData('history', []);
      setFavorites(loadedFavorites);
      setHistory(loadedHistory);
      setHistoryLoaded(true);
    })();
  }, []);

  useEffect(() => {
    saveData('favorites', favorites);
  }, [favorites]);

  useEffect(() => {
    if (historyLoaded) {
      console.log('🧠 History state changed:', history);
      saveData('history', history);
    }
  }, [history, historyLoaded]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home';
            if (route.name === 'Favorites') iconName = 'heart';
            else if (route.name === 'History') iconName = 'time';
            else if (route.name === 'Settings') iconName = 'settings';
            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#e91e63',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Search">
          {() => (
            <HomeScreen
              favorites={favorites}
              setFavorites={setFavorites}
              history={history}
              setHistory={setHistory}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Favorites">
          {() => <FavoritesScreen favorites={favorites} />}
        </Tab.Screen>
        <Tab.Screen name="History">
          {() => <HistoryScreen history={history} />}
        </Tab.Screen>
        <Tab.Screen name="Settings">
          {() => (
            <SettingsScreen
              setHistory={setHistory}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
