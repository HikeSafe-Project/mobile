// StatusFilterModal.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StatusFilterModal from '@/components/modal/StatusFilterModal'; // Adjust the import path as necessary

// Mock the MaterialIcons component
jest.mock('@expo/vector-icons', () => {
  return {
    MaterialIcons: () => <></>, // Mock implementation
  };
});

describe('StatusFilterModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSelectStatus = jest.fn();

  it('renders correctly when visible', () => {
    const { getByText } = render(
      <StatusFilterModal visible={true} onClose={mockOnClose} onSelectStatus={mockOnSelectStatus} />
    );

    expect(getByText('Select Status')).toBeTruthy();
    expect(getByText('ALL')).toBeTruthy();
    expect(getByText('DONE')).toBeTruthy();
    expect(getByText('CANCELLED')).toBeTruthy();
    expect(getByText('START')).toBeTruthy();
    expect(getByText('PENDING')).toBeTruthy();
    expect(getByText('BOOKED')).toBeTruthy();
  });

  it('calls onSelectStatus and onClose when a status is selected', () => {
    const { getByText } = render(
      <StatusFilterModal visible={true} onClose={mockOnClose} onSelectStatus={mockOnSelectStatus} />
    );

    fireEvent.press(getByText('DONE'));

    expect(mockOnSelectStatus).toHaveBeenCalledWith('DONE');
    expect(mockOnClose).toHaveBeenCalled();
  });
});