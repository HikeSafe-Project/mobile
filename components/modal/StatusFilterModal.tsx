import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, Button, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

interface StatusFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectStatus: (status: string) => void;
}

const StatusFilterModal: React.FC<StatusFilterModalProps> = ({ visible, onClose, onSelectStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleSelectStatus = (status: string) => {
    setSelectedStatus(status);
    onSelectStatus(status);
    onClose();
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide" transparent={true}>
      <View style={styles.modal}>
        <Text style={styles.filterLabel}>Select Status</Text>
        <View style={styles.optionsContainer}>
          {["ALL", "DONE", "CANCELLED", "START", "PENDING", "BOOKED"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.optionButton,
                selectedStatus === status && styles.selectedOptionButton,
              ]}
              onPress={() => handleSelectStatus(status)}
            >
              <Text style={[
                styles.optionText,
                selectedStatus === status && styles.selectedOptionText,
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Close" onPress={onClose} color={Colors.primary} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    height: "50%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
  },
  filterLabel: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 20,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  selectedOptionButton: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: Colors.primary,
  },
  selectedOptionText: {
    color: "#fff",
  },
});

export default StatusFilterModal;