import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HikersDetailScreen = () => {
    const transactionId = useLocalSearchParams().transactionId; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hikers Detail</Text>
      <Text style={styles.label}>Transaction ID:</Text>
      <Text style={styles.value}>{transactionId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  value: {
    fontSize: 18,
    color: "#555",
  },
});

export default HikersDetailScreen;
