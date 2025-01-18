import React, { useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter, Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonCom from "@/components/ui/Button";

const ProfileScreen = () => {
  const profile = {
    fullname: "John Doe",
    email: "john.doe@example.com",
    birth_date: "1990-01-01",
    NIK: "1234567890123456",
    img: "https://lenox-pasifik.co.id/wp-content/uploads/2016/06/team-1-640x640.jpg",
    gender: "Male",
    address: "123 Example Street, New York, USA",
  };

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/mountainbackground.png")} style={styles.image} />
      <View style={styles.infoCard}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>NIK</Text>
          <Text style={styles.infoValue}>{profile.NIK}</Text>

          <Text style={styles.infoLabel}>Birth Date</Text>
          <Text style={styles.infoValue}>{profile.birth_date}</Text>

          <Text style={styles.infoLabel}>Gender</Text>
          <Text style={styles.infoValue}>{profile.gender}</Text>

          <Text style={styles.infoLabel}>Address</Text>
          <Text style={styles.infoValue}>{profile.address}</Text>
        </View>
      </View>

      <View style={styles.header}>
        <Image source={{ uri: profile.img }} style={styles.profileImage} />
        <Text style={styles.name}>{profile.fullname}</Text>
        <Text style={styles.subInfo}>{profile.email}</Text>
        <ButtonCom 
          variant='ghost' 
        >
            <Link href='/edit-profile'>Edit Profile</Link>
        </ButtonCom>
      </View>

      <ButtonCom 
        variant='danger'
        onPress={() => {
          AsyncStorage.removeItem('token');
          router.replace('/(auth)/login');
        }}
      >
        Logout
      </ButtonCom>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f3f4f6",
    padding: 20,
  },
  image: {
    width: "115%",
    height: 300,
    position: "absolute",
    top: -120,
    left: 0,
  },
  header: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    right: 0,
    top: 80
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 10,
  },
  subInfo: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 5,
  },
  infoContainer: {
    marginTop: 150,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginTop: 110,
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
  ButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
});

export default ProfileScreen;
