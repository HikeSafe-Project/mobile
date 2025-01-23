// HomeScreen.test.tsx
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)/index';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock the axios module
jest.mock('axios');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
});

describe('HomeScreen', () => {
  beforeEach(() => {
    (axios.get as jest.Mock).mockClear();
    (AsyncStorage.getItem as jest.Mock).mockClear();
  });

  it('renders correctly and displays user data', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('mocked_token');

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        data: {
          fullName: 'John Doe',
        },
      },
    });

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        data: [
          {
            status: 'DONE',
            startDate: '2023-01-01T00:00:00Z',
            endDate: '2023-01-02T00:00:00Z',
          },
          {
            status: 'DONE',
            startDate: '2023-01-03T00:00:00Z',
            endDate: '2023-01-04T00:00:00Z',
          },
        ],
      },
    });

    const { getByText, getAllByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Hello, John Doe')).toBeTruthy();
      expect(getByText('Your Hiking Statistics')).toBeTruthy();
      expect(getByText('Total Hikes')).toBeTruthy();
      expect(getAllByText('2')[0]).toBeTruthy();
      expect(getAllByText('2')[1]).toBeTruthy();
    });
  });
});