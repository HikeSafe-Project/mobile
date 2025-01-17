import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";

const EditProfileScreen = () => {
  const [profile, setProfile] = useState({
    fullname: "John Doe",
    birth_date: "1990-01-01",
    NIK: "1234567890123456",
    gender: "Male",
    address: "123 Example Street, New York, USA",
  });

  const navigation = useNavigation();

  const handleSave = () => {
    console.log("Updated Profile:", profile);
    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={profile.fullname}
          onChangeText={(text) => setProfile({ ...profile, fullname: text })}
        />

        <Text style={styles.label}>Birth Date</Text>
        <TextInput
          style={styles.input}
          value={profile.birth_date}
          placeholder="YYYY-MM-DD"
          onChangeText={(text) => setProfile({ ...profile, birth_date: text })}
        />

        <Text style={styles.label}>NIK</Text>
        <TextInput
          style={styles.input}
          value={profile.NIK}
          keyboardType="numeric"
          onChangeText={(text) => setProfile({ ...profile, NIK: text })}
        />

        <Text style={styles.label}>Gender</Text>
        <TextInput
          style={styles.input}
          value={profile.gender}
          onChangeText={(text) => setProfile({ ...profile, gender: text })}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.textArea}
          value={profile.address}
          multiline
          numberOfLines={4}
          onChangeText={(text) => setProfile({ ...profile, address: text })}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f3f4f6",
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 20,
  },
  form: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6B7280",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
