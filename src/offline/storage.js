import AsyncStorage from '@react-native-async-storage/async-storage';

export const getItem = async (key, fallback) => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
};

export const setItem = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared');
  } catch (e) {
    console.error('Failed to clear AsyncStorage', e);
  }
};