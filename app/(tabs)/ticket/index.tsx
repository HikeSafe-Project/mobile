import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  Image,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import ButtonCom from "@/components/ui/Button";

const TransactionScreen: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [toggleStartDate, setToggleStartDate] = useState<boolean>(false);
  const [toggleEndDate, setToggleEndDate] = useState<boolean>(false);

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

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/mountainbackground.png")} style={styles.logo} />
      <View style={styles.containerTransaction}>
        <View style={styles.content}>
          {/* Check-in Date */}
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
            <TouchableOpacity onPress={() => setToggleStartDate(true)}>
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

          <View>
            <TextInput placeholder="Tracker Code" style={styles.input} />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Ticket Price</Text>
            <Text style={styles.value}>Rp. 500.000</Text>
          </View>

          <ButtonCom
            textStyle={{ padding: 5 }}
            variant="primary"
          >
            Book Now
          </ButtonCom>
        </View>
      </View>
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
  status: {
    color: "#10b981",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#fafafa",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  button: {
    backgroundColor: "#10b981",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TransactionScreen;
