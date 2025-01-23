import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter, Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonCom from "@/components/ui/Button";
import { API_ENDPOINTS } from "@/constants/Api";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

interface Profile {
  fullName: string;
  email: string;
  birthDate: string;
  nik: string;
  imageUrl: string;
  gender: string;
  address: string;
}

const ProfileScreen = () => {
  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    email: "",
    birthDate: "",
    nik: "",
    imageUrl: "",
    gender: "",
    address: "",
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(API_ENDPOINTS.AUTH.ME, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setProfile(data.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/(auth)/login");
  };

  const pickImage = async (source: "gallery" | "camera") => {
    try {
      let result;
      if (source === "gallery") {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUrl = result.assets[0].uri;

        setProfile((prevProfile) => ({
          ...prevProfile,
          imageUrl,
        }));

        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("Token not found");
          return;
        }

        const formData = new FormData();
        formData.append("image", {
          uri: imageUrl,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);

        const response = await axios.put(
          `${API_ENDPOINTS.USER.UPDATE_IMAGE}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error axios: ", error.response?.data);
      } else {
        console.error("Error while picking image:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/mountainbackground.png")}
        style={styles.image}
      />
      <View style={styles.infoCard}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>NIK</Text>
          <Text style={styles.infoValue}>{profile?.nik}</Text>

          <Text style={styles.infoLabel}>Birth Date</Text>
          <Text style={styles.infoValue}>{profile?.birthDate}</Text>

          <Text style={styles.infoLabel}>Gender</Text>
          <Text style={styles.infoValue}>{profile?.gender}</Text>

          <Text style={styles.infoLabel}>Address</Text>
          <Text style={styles.infoValue}>{profile?.address}</Text>
        </View>
      </View>

      <View style={styles.header}>
        <View>
          <Image
            source={{ uri: profile?.imageUrl }}
            style={styles.profileImage}
          />
          <TouchableOpacity  onPress={() => setShowImageModal(true)} style={styles.cameraIconContainer}>
            <MaterialIcons name="camera-alt" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{profile?.fullName}</Text>
        <Text style={styles.subInfo}>{profile?.email}</Text>
        <ButtonCom variant="ghost">
          <Link href="/edit-profile">Edit Profile</Link>
        </ButtonCom>
      </View>

      <ButtonCom variant="danger" onPress={() => setShowLogoutModal(true)}>
        Logout
      </ButtonCom>

      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowImageModal(false)}
            >
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>

            <View style={styles.modalRow}>
              <TouchableOpacity
                style={styles.modalButtonRow}
                onPress={() => {
                  setShowImageModal(false);
                  pickImage("gallery");
                }}
              >
                <MaterialIcons name="photo-library" size={24} color="white" />
                <Text style={styles.modalButtonText}>Galeri</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonRow}
                onPress={() => {
                  setShowImageModal(false);
                  pickImage("camera");
                }}
              >
                <MaterialIcons name="camera-alt" size={24} color="white" />
                <Text style={styles.modalButtonText}>Kamera</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    top: 80,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: "#fff",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  logoutButton: {
    backgroundColor: "#DC2626",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 10,
  },
    cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 5,
  },
  modalRow: {
  flexDirection: "row",
  justifyContent: "space-around",
  width: "100%",
  marginTop: 10,
  },
  modalButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
});

export default ProfileScreen;
