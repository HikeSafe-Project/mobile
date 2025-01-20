import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";

interface DateFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  showStartDatePicker: boolean;
  showEndDatePicker: boolean;
  onStartDatePickerChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
  onEndDatePickerChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
}

const DateFilterModal: React.FC<DateFilterModalProps> = ({
  visible,
  onClose,
  onStartDateChange,
  onEndDateChange,
  showStartDatePicker,
  showEndDatePicker,
  onStartDatePickerChange,
  onEndDatePickerChange,
}) => {
  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide" transparent={true}>
      <View style={styles.modal}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.filterLabel}>Start Date</Text>
        <TouchableOpacity onPress={() => onStartDateChange(new Date().toISOString().split("T")[0])}>
          <TextInput style={styles.input} placeholder="Start Date (YYYY-MM-DD)" editable={false} />
        </TouchableOpacity>

        <Text style={styles.filterLabel}>End Date</Text>
        <TouchableOpacity onPress={() => onEndDateChange(new Date().toISOString().split("T")[0])}>
          <TextInput style={styles.input} placeholder="End Date (YYYY-MM-DD)" editable={false} />
        </TouchableOpacity>

        <Button title="Apply Filters" onPress={onClose} color={Colors.primary} />

        {showStartDatePicker && (
          <DateTimePicker value={new Date()} mode="date" is24Hour={true} display="default" onChange={onStartDatePickerChange} />
        )}

        {showEndDatePicker && (
          <DateTimePicker value={new Date()} mode="date" is24Hour={true} display="default" onChange={onEndDatePickerChange} />
        )}
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
    position: "relative", // Needed for the close button positioning
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  filterLabel: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 15,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
});

export default DateFilterModal;
