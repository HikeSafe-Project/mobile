import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ButtonCom from "@/components/ui/Button";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "@/constants/Api";
import AddHikerModal from "@/components/modal/AddHikerModal";
import { router } from "expo-router";

const TransactionScreen: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [toggleStartDate, setToggleStartDate] = useState<boolean>(false);
  const [toggleEndDate, setToggleEndDate] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [hikers, setHikers] = useState<Array<any>>([
    { id: Date.now(), name: "", address: "", phoneNumber: "", identificationType: "", identificationNumber: "" },
  ]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setToggleStartDate(Platform.OS === "ios");
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setToggleEndDate(Platform.OS === "ios");
    if (selectedDate) setEndDate(selectedDate);
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    const transactionData = {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      tickets: hikers.map((hiker) => ({
        hikerName: hiker.name,
        identificationType: hiker.identificationType,
        identificationNumber: hiker.identificationNumber,
        address: hiker.address,
        phoneNumber: hiker.phoneNumber,
      })),
    };

    console.log("Transaction data:", transactionData);

    try {
      const response = await axios.post(API_ENDPOINTS.TRANSACTION.CREATE_TICKET, transactionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      router.replace({
        pathname: "(transaction)/hikersDetail",
        params: {
          transactionId: response.data.data.id,
        },
      })

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

          <View style={styles.infoCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons name="account-multiple" size={28} color="gray" />
                <Text style={[styles.label, { marginLeft: 10 }]}>{hikers.length} Hikers</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Hiker</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Ticket Price</Text>
            <Text style={styles.value}>Rp. 500.000</Text>
          </View>

          <ButtonCom textStyle={{ padding: 5 }} variant="primary" onPress={handleSubmit}>
            Book Now
          </ButtonCom>
        </View>
      </View>

      <AddHikerModal
        visible={modalVisible}
        hikers={hikers}
        onClose={() => setModalVisible(false)}
        onAddHiker={(newHiker) => setHikers([...hikers, newHiker])}
        onRemoveHiker={(id) => setHikers(hikers.filter((hiker) => hiker.id !== id))}
        onUpdateHiker={(id, field, value) =>
          setHikers(
            hikers.map((hiker) => (hiker.id === id ? { ...hiker, [field]: value } : hiker))
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f3f4f6" 
  },
  logo: { 
    position: "absolute", 
    bottom: 0, 
    width: "100%", 
    height: 300 
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
    elevation: 5,
  },
  content: { 
    padding: 30 
  },
  date: { 
    flexDirection: "row", 
    marginBottom: 20, 
    alignItems: "center" 
  },
  dataDate: { 
    flex: 1, 
    marginLeft: 10 
  },
  infoCard: { 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 15 
  },
  label: { 
    fontSize: 16, 
    color: "#555", 
    fontWeight: "bold" 
  },
  value: { 
    fontSize: 16, 
    color: "#333", 
    marginTop: 5 
  },
  addButton: { 
    backgroundColor: Colors.primary, 
    padding: 10, 
    borderRadius: 12 
  },
  addButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
});

export default TransactionScreen;
