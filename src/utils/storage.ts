import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveData(key: string, value: any) {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
    console.log(`✅ Saved data to key: ${key}`);
  } catch (e) {
    console.error('❌ Failed to save data:', e);
  }
}

export async function loadData<T>(key: string, fallback: T): Promise<T> {
  try {
    const json = await AsyncStorage.getItem(key);
    console.log(`📥 Loaded data from key: ${key}`);
    return json != null ? JSON.parse(json) : fallback;
  } catch (e) {
    console.error('❌ Failed to load data:', e);
    return fallback;
  }
}
