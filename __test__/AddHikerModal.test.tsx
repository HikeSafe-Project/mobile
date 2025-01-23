import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddHikerModal from '@/components/modal/AddHikerModal'; 

describe('AddHikerModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAddHiker = jest.fn();
  const mockOnRemoveHiker = jest.fn();
  const mockOnUpdateHiker = jest.fn();

  const hikers = [
    {
      id: 1,
      name: 'John Doe',
      address: '123 Main St',
      phoneNumber: '1234567890',
      identificationType: 'NIK',
      identificationNumber: '123456789',
    },
  ];

  it('renders correctly when visible', () => {
    const { getByPlaceholderText, getByText } = render(
      <AddHikerModal
        visible={true}
        hikers={hikers}
        onClose={mockOnClose}
        onAddHiker={mockOnAddHiker}
        onRemoveHiker={mockOnRemoveHiker}
        onUpdateHiker={mockOnUpdateHiker}
      />
    );

    // Check if the input fields are rendered
    expect(getByPlaceholderText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Address')).toBeTruthy();
    expect(getByPlaceholderText('Phone Number')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
    expect(getByText('Add Hiker')).toBeTruthy();
    expect(getByText('Close')).toBeTruthy();
  });

  it('calls onAddHiker when Add Hiker button is pressed', async () => {
    const { getByText } = render(
      <AddHikerModal
        visible={true}
        hikers={hikers}
        onClose={mockOnClose}
        onAddHiker={mockOnAddHiker}
        onRemoveHiker={mockOnRemoveHiker}
        onUpdateHiker={mockOnUpdateHiker}
      />
    );

    fireEvent.press(getByText('Add Hiker'));

    await waitFor(() => {
      expect(mockOnAddHiker).toHaveBeenCalled();
    });
  });

  it('calls onRemoveHiker when Delete button is pressed', async () => {
    const { getByText } = render(
      <AddHikerModal
        visible={true}
        hikers={hikers}
        onClose={mockOnClose}
        onAddHiker={mockOnAddHiker}
        onRemoveHiker={mockOnRemoveHiker}
        onUpdateHiker={mockOnUpdateHiker}
      />
    );

    fireEvent.press(getByText('Delete'));

    await waitFor(() => {
      expect(mockOnRemoveHiker).toHaveBeenCalledWith(1); // Assuming the ID is 1
    });
  });

  it('calls onUpdateHiker when input fields are changed', async () => {
    const { getByPlaceholderText } = render(
      <AddHikerModal
        visible={true}
        hikers={hikers}
        onClose={mockOnClose}
        onAddHiker={mockOnAddHiker}
        onRemoveHiker={mockOnRemoveHiker}
        onUpdateHiker={mockOnUpdateHiker}
      />
    );

    fireEvent.changeText(getByPlaceholderText('Name'), 'Jane Doe');
    fireEvent.changeText(getByPlaceholderText('Address'), '456 Elm St');
    fireEvent.changeText(getByPlaceholderText('Phone Number'), '0987654321');

    await waitFor(() => {
      expect(mockOnUpdateHiker).toHaveBeenCalledWith(1, 'name', 'Jane Doe');
      expect(mockOnUpdateHiker).toHaveBeenCalledWith(1, 'address', '456 Elm St');
      expect(mockOnUpdateHiker).toHaveBeenCalledWith(1, 'phoneNumber', '0987654321');
    });
  });
});