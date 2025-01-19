import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  Modal,
  FlatList,
  Image,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ButtonCom from "@/components/ui/Button";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { Picker } from "@react-native-picker/picker";
import { API_ENDPOINTS } from "@/constants/Api";

const TransactionScreen: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [toggleStartDate, setToggleStartDate] = useState<boolean>(false);
  const [toggleEndDate, setToggleEndDate] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [hikers, setHikers] = useState<Array<any>>([
    { id: Date.now(), name: "", address: "", phoneNumber: "", identificationType: "", identificationNumber: "" },
  ]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserIdFromToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decodedToken: any = jwtDecode(token);
          setUserId(decodedToken.id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    getUserIdFromToken();
  }, []);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setToggleStartDate(Platform.OS === "ios");
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setToggleEndDate(Platform.OS === "ios");
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleAddHiker = () => {
    setHikers([
      ...hikers,
      { id: Date.now(), name: "", address: "", phoneNumber: "", identificationType: "", identificationNumber: "" },
    ]);
  };

  const handleRemoveHiker = (id: number) => {
    setHikers(hikers.filter((hiker) => hiker.id !== id));
  };

  const handleHikerChange = (id: number, field: string, value: string) => {
    setHikers(
      hikers.map((hiker) =>
        hiker.id === id ? { ...hiker, [field]: value } : hiker
      )
    );
  };

  const handleSubmit = async () => {
    if (!userId) {
      console.log("User ID is not set.");
      return;
    }

    const token = await AsyncStorage.getItem("token");
  
    const transactionData = {
      userId: userId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      tickets: hikers.map((hiker) => ({
        hikerName: hiker.name,
        identificationType: hiker.identificationType,
        identificationNumber: hiker.identificationNumber,
        address: hiker.address,
        phoneNumber: hiker.phoneNumber,
      })),
    };
  
    console.log("Transaction Data:", transactionData);
  
    try {
      const response = await axios.post(API_ENDPOINTS.TRANSACTION.CREATE_TICKET, transactionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Transaction submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/mountainbackground.png")} style={styles.logo} />
      <View style={styles.containerTransaction}>
        <View style={styles.content}>
          <View style={styles.date}>
            <TouchableOpacity onPress={() => setToggleStartDate(true)}>
              <MaterialCommunityIcons name="calendar-edit" size={28} color="gray" />
            </TouchableOpacity>
            <View style={styles.dataDate}>
              <View>
                <Text style={styles.label}>Check-in Date</Text>
                <Text style={styles.value}>{formatDate(startDate)}</Text>
              </View>
            </View>
          </View>
          {toggleStartDate && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}

          {/* Check-out Date */}
          <View style={styles.date}>
            <TouchableOpacity onPress={() => setToggleEndDate(true)}>
              <MaterialCommunityIcons name="calendar-edit" size={28} color="gray" />
            </TouchableOpacity>
            <View style={styles.dataDate}>
              <View>
                <Text style={styles.label}>Check-out Date</Text>
                <Text style={styles.value}>{formatDate(endDate)}</Text>
              </View>
            </View>
          </View>
          {toggleEndDate && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}

          <View style={{ marginTop: 20 }} />

          {/* Add Hiker Button */}
          <View style={styles.infoCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons name="account-multiple" size={28} color="gray" />
                <Text style={[styles.label, { marginLeft: 10 }]}>2 Hikers</Text>
              </View>
              <View>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                  <Text style={styles.addButtonText}>Add Hiker</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Ticket Price */}
          <View style={styles.infoCard}>
            <Text style={styles.label}>Ticket Price</Text>
            <Text style={styles.value}>Rp. 500.000</Text>
          </View>

          {/* Book Now Button */}
          <ButtonCom
            textStyle={{ padding: 5 }}
            variant="primary"
            onPress={handleSubmit}
          >
            Book Now
          </ButtonCom>
        </View>
      </View>

      {/* Modal for Adding Hiker */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={hikers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.hikerInputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={item.name}
                    onChangeText={(text) => handleHikerChange(item.id, "name", text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={item.address}
                    onChangeText={(text) => handleHikerChange(item.id, "address", text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={item.phoneNumber}
                    onChangeText={(text) => handleHikerChange(item.id, "phoneNumber", text)}
                  />
                  {/* Picker untuk Identification Type */}
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={item.identificationType}
                      onValueChange={(value) => handleHikerChange(item.id, "identificationType", value)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select ID Type" value="" />
                      <Picker.Item label="NIK" value="NIK" />
                      <Picker.Item label="Passport" value="PASSPORT" />
                    </Picker>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Identification Number"
                    value={item.identificationNumber}
                    onChangeText={(text) => handleHikerChange(item.id, "identificationNumber", text)}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveHiker(item.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <TouchableOpacity onPress={handleAddHiker} style={styles.addHikerButton}>
              <Text style={styles.addHikerButtonText}>Add Another Hiker</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  logo: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 300,
  },
  containerTransaction: {
    position: "absolute",
    backgroundColor: "#fff",
    right: 20,
    top: 100,
    left: 20,
    height: "60%",
    borderRadius: 20,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  content: {
    padding: 30,
  },
  date: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  dataDate: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    width: "100%",
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addHikerButton: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  addHikerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: "100%",
    height: "100%",
  },
  hikerInputContainer: {
    marginBottom: 15,
  },
  removeButton: {
    backgroundColor: "#e57373",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pickerContainer: {
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default TransactionScreen;
