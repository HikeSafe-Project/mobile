// jestSetup.js
import 'react-native-gesture-handler/jestSetup';
import { jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
});

// Mock expo-font
jest.mock('expo-font', () => {
  return {
    loadAsync: jest.fn(() => Promise.resolve()), // Simulate successful font loading
    useFonts: jest.fn(() => [true]), // Simulate that fonts are loaded
  };
});

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  return {
    FontAwesome5: () => null, // Mock the FontAwesome5 component
  };
});