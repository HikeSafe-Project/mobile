import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

interface Person {
  name: string;
  email: string;
}

const TicketPurchaseScreen: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([{ name: "", email: "" }]);

  const handleAddPerson = () => {
    setPeople([...people, { name: "", email: "" }]);
  };

  const handleRemovePerson = (index: number) => {
    const updatedPeople = [...people];
    updatedPeople.splice(index, 1);
    setPeople(updatedPeople);
  };

  const handleInputChange = (
    index: number,
    field: keyof Person,
    value: string
  ) => {
    const updatedPeople = [...people];
    updatedPeople[index][field] = value;
    setPeople(updatedPeople);
  };

  const handlePurchase = () => {
    const isDataComplete = people.every(
      (person) => person.name !== "" && person.email !== ""
    );

    if (!isDataComplete) {
      alert("Please complete all fields for each hiker.");
      return;
    }

    alert(`Thank you for your purchase! ${people.length} ticket(s) reserved.`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ticket Purchase</Text>

      {people.map((person, index) => (
        <View key={index} style={styles.personContainer}>
          <Text style={styles.personTitle}>Hiker {index + 1}</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={person.name}
            onChangeText={(value) => handleInputChange(index, "name", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            keyboardType="email-address"
            value={person.email}
            onChangeText={(value) => handleInputChange(index, "email", value)}
          />
          {people.length > 1 && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemovePerson(index)}
            >
              <Text style={styles.removeButtonText}>Remove Hiker</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddPerson}>
        <Text style={styles.addButtonText}>Add Hiker</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
        <Text style={styles.purchaseButtonText}>Buy Tickets</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
  },
  personContainer: {
    width: "100%",
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
  personTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#374151",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: "#f87171",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  purchaseButton: {
    backgroundColor: "#10b981",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  purchaseButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TicketPurchaseScreen;
