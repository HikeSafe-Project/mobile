import React, { useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const ProfileScreen = () => {
  const profile = {
    fullname: "John Doe",
    birth_date: "1990-01-01",
    NIK: "1234567890123456",
    img: "https://via.placeholder.com/150",
    gender: "Male",
    address: "123 Example Street, New York, USA",
  };

  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profile.img }} style={styles.profileImage} />
        <Text style={styles.name}>{profile.fullname}</Text>
        <Text style={styles.subInfo}>{profile.gender}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Birth Date</Text>
        <Text style={styles.infoValue}>{profile.birth_date}</Text>

        <Text style={styles.infoLabel}>NIK</Text>
        <Text style={styles.infoValue}>{profile.NIK}</Text>

        <Text style={styles.infoLabel}>Address</Text>
        <Text style={styles.infoValue}>{profile.address}</Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push("edit-profile")}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f3f4f6",
    padding: 20,
    marginTop: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 10,
  },
  subInfo: {
    fontSize: 16,
    color: "#4B5563",
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6B7280",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
