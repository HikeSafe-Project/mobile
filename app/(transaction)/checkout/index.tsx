import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";

interface Person {
  name: string;
  email: string;
}

const CheckoutScreen: React.FC = () => {
  const people: Person[] = [
    { name: "John Doe", email: "john.doe@example.com" },
    { name: "Jane Smith", email: "jane.smith@example.com" },
    { name: "Alice Johnson", email: "alice.johnson@example.com" },
  ];

  const onGoBack = () => {
    console.log("Go Back pressed");
  };

  const onConfirmPurchase = () => {
    console.log("Confirm Purchase pressed");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      {people.map((person, index) => (
        <View key={index} style={styles.personContainer}>
          <Text style={styles.personTitle}>Person {index + 1}</Text>
          <Text style={styles.detailText}>Full Name: {person.name}</Text>
          <Text style={styles.detailText}>Email: {person.email}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.goBackButton} onPress={onGoBack}>
        <Text style={styles.goBackButtonText}>Go Back</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.confirmButton} onPress={onConfirmPurchase}>
        <Text style={styles.confirmButtonText}>Confirm Purchase</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
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
  detailText: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 8,
  },
  goBackButton: {
    backgroundColor: "#e5e7eb",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  goBackButtonText: {
    color: "#1f2937",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#10b981",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;