import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLayoutEffect } from "react";
import { router, useNavigation } from "expo-router";
import { API_ENDPOINTS } from "@/constants/Api";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import ChangePasswordModal from "@/components/modal/ChangePasswordModal";

interface Profile {
  fullName: string;
  birthDate: string;
  nik: string;
  gender: string;
  address: string;
}

const EditProfileScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Profile>({
    defaultValues: {
      fullName: "John Doe",
      birthDate: "1990-01-01",
      nik: "1234567890123456",
      gender: "Male",
      address: "123 Example Street, New York, USA",
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState("MALE");
  const [showModal, setShowModal] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const response = await axios.get(`${API_ENDPOINTS.AUTH.ME}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = response.data.data;

          console.log(userData);

          setValue("fullName", userData.fullName);
          setValue("birthDate", userData.birthDate);
          setValue("nik", userData.nik);
          setValue("gender", userData.gender);
          setValue("address", userData.address);
          setSelectedGender(userData.gender);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [setValue]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const onSubmit = async (data: Profile) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.patch(
        `${API_ENDPOINTS.USER.UPDATE_ME}`,
        { ...data, gender: selectedGender },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully");
        router.replace("/(tabs)/profile");
      } else {
        Alert.alert("Error", "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <Controller
          name="fullName"
          control={control}
          rules={{ required: "Full Name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.fullName && styles.errorInput]}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

        <Text style={styles.label}>Birth Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Controller
            name="birthDate"
            control={control}
            rules={{ required: "Birth Date is required" }}
            render={({ field: { value } }) => (
              <TextInput
                style={[styles.input, errors.birthDate && styles.errorInput]}
                value={value}
                editable={false}
                placeholder="YYYY-MM-DD"
              />
            )}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            mode="date"
            value={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setValue("birthDate", selectedDate.toISOString().split("T")[0]);
              }
            }}
          />
        )}
        {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate.message}</Text>}

        <Text style={styles.label}>NIK</Text>
        <Controller
          name="nik"
          control={control}
          rules={{
            required: "NIK is required",
            minLength: { value: 16, message: "NIK must be 16 digits" },
            maxLength: { value: 16, message: "NIK must be 16 digits" },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.nik && styles.errorInput]}
              value={value}
              keyboardType="numeric"
              onChangeText={onChange}
            />
          )}
        />
        {errors.nik && <Text style={styles.errorText}>{errors.nik.message}</Text>}

        <Text style={styles.label}>Gender</Text>
        <Picker
          selectedValue={selectedGender}
          style={[styles.input, errors.gender && styles.errorInput]}
          onValueChange={(itemValue) => {
            setSelectedGender(itemValue);
            setValue("gender", itemValue);
          }}
        >
          <Picker.Item label="Male" value="MALE" />
          <Picker.Item label="Female" value="FEMALE" />
        </Picker>
        {errors.gender && <Text style={styles.errorText}>{errors.gender.message}</Text>}

        <Text style={styles.label}>Address</Text>
        <Controller
          name="address"
          control={control}
          rules={{ required: "Address is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.textArea, errors.address && styles.errorInput]}
              value={value}
              multiline
              numberOfLines={4}
              onChangeText={onChange}
            />
          )}
        />
        {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}

        <ChangePasswordModal modalVisible={showModal} setModalVisible={setShowModal} />

        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.changePasswordButtonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
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
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginBottom: 10,
  },
  errorInput: {
    borderColor: "#EF4444",
  },
  changePasswordButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  changePasswordButtonText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
