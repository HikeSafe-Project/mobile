import React, { useRef } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Modal, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { Picker } from "@react-native-picker/picker";

const AddHikerModal: React.FC<{
  visible: boolean;
  hikers: Array<any>;
  onClose: () => void;
  onAddHiker: (newHiker: any) => void;
  onRemoveHiker: (id: number) => void;
  onUpdateHiker: (id: number, field: string, value: string) => void;
}> = ({ visible, hikers, onClose, onAddHiker, onRemoveHiker, onUpdateHiker }) => {
  const addressInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const idTypePickerRef = useRef<Picker<string>>(null);

  return (
    <Modal visible={visible} animationType="slide">
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {hikers.map((item) => (
              <View key={item.id} style={styles.hikerInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={item.name}
                  onChangeText={(text) => onUpdateHiker(item.id, "name", text)}
                  returnKeyType="next"
                  onSubmitEditing={() => addressInputRef.current?.focus()}
                />
                <TextInput
                  ref={addressInputRef}
                  style={styles.input}
                  placeholder="Address"
                  value={item.address}
                  onChangeText={(text) => onUpdateHiker(item.id, "address", text)}
                  returnKeyType="next"
                  onSubmitEditing={() => phoneInputRef.current?.focus()}
                />
                <TextInput
                  ref={phoneInputRef}
                  style={styles.input}
                  placeholder="Phone Number"
                  value={item.phoneNumber}
                  onChangeText={(text) => onUpdateHiker(item.id, "phoneNumber", text)}
                  returnKeyType="next"
                  onSubmitEditing={() => idTypePickerRef.current?.focus()}
                />
                <Picker
                  ref={idTypePickerRef}
                  selectedValue={item.identificationType}
                  onValueChange={(value) => onUpdateHiker(item.id, "identificationType", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select ID Type" value="" />
                  <Picker.Item label="NIK" value="NIK" />
                  <Picker.Item label="Passport" value="PASSPORT" />
                </Picker>
                <TextInput
                  style={styles.input}
                  placeholder="Identification Number"
                  value={item.identificationNumber}
                  onChangeText={(text) => onUpdateHiker(item.id, "identificationNumber", text)}
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <TouchableOpacity onPress={() => onRemoveHiker(item.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => onAddHiker({ id: Date.now(), name: "", address: "", phoneNumber: "", identificationType: "", identificationNumber: "" })}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Add Hiker</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    alignSelf: "center",
    height: "100%",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  hikerInputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    
  },
});

export default AddHikerModal;
