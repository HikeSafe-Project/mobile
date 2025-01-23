// ToggleButton.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ToggleButton from '@/components/ui/ToggleButton'; // Adjust the import path as necessary

describe('ToggleButton', () => {
  it('renders correctly with initial state', () => {
    const toggleGroupList = jest.fn();
    const { getByText } = render(
      <ToggleButton showGroups={false} toggleGroupList={toggleGroupList} />
    );

    // Check if the button displays the correct text
    expect(getByText('Show History')).toBeTruthy();
  });

  it('calls toggleGroupList when pressed', () => {
    const toggleGroupList = jest.fn();
    const { getByText } = render(
      <ToggleButton showGroups={false} toggleGroupList={toggleGroupList} />
    );

    // Simulate button press
    fireEvent.press(getByText('Show History'));

    // Check if the toggleGroupList function was called
    expect(toggleGroupList).toHaveBeenCalled();
  });

  it('renders correctly when showGroups is true', () => {
    const toggleGroupList = jest.fn();
    const { getByText } = render(
      <ToggleButton showGroups={true} toggleGroupList={toggleGroupList} />
    );

    // Check if the button displays the correct text
    expect(getByText('Hide History')).toBeTruthy();
  });
});