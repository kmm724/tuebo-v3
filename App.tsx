// App.tsx
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ParentSettings from './src/screens/ParentSettings';
import VideoExplorer from './src/screens/VideoExplorer';

import { loadData, saveData } from './src/utils/storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs({ favorites, setFavorites, history, setHistory }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Favorites') iconName = 'heart';
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
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

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
      saveData('history', history);
    }
  }, [history, historyLoaded]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs">
          {() => (
            <MainTabs
              favorites={favorites}
              setFavorites={setFavorites}
              history={history}
              setHistory={setHistory}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="ParentSettings" component={ParentSettings} />
        <Stack.Screen name="HistoryScreen">
          {() => <HistoryScreen history={history} />}
        </Stack.Screen>
        <Stack.Screen name="VideoExplorer" component={VideoExplorer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
