import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "@/constants/Api";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";

interface ChangePasswordData {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  modalVisible,
  setModalVisible,
}) => {
  const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm<ChangePasswordData>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  useEffect(() => {
    setValue("password", "");
    setValue("newPassword", "");
    setValue("confirmPassword", "");
  }, [modalVisible, setValue]);

  const handlePasswordSubmit = async (data: ChangePasswordData) => {
    if (data.newPassword !== data.confirmPassword) {
      Alert.alert("Error", "New password and confirmation do not match!");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "Authentication token is missing.");
      return;
    }

    try {
      const response = await axios.patch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Success", "Password changed successfully!");
      setModalVisible(false);
    } catch (error: any) {
      console.error("Error changing password:", error);
      Alert.alert("Error", error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent} accessible={true} aria-live="polite">
          <Text style={styles.modalTitle}>Change Password</Text>

          <Controller
            name="password"
            control={control}
            rules={{
              required: "Current password is required",
              minLength: {
                value: 6,
                message: "Current password must be at least 6 characters long",
              },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])[^\s]{8,}$/,
                message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and no spaces.",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  style={[styles.input, errors.password && styles.errorInput]}
                  value={value}
                  placeholder="Current Password"
                  secureTextEntry={!showPassword}
                  onChangeText={onChange}
                  aria-label="Current password"
                />
                <TouchableOpacity
                  style={styles.showHideButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={20} color="gray" />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          <Controller
            name="newPassword"
            control={control}
            rules={{
              required: "New password is required",
              minLength: {
                value: 8,
                message: "New password must be at least 8 characters long",
              },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])[^\s]{8,}$/,
                message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and no spaces.",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  style={[styles.input, errors.newPassword && styles.errorInput]}
                  value={value}
                  placeholder="New Password"
                  secureTextEntry={!showNewPassword}
                  onChangeText={onChange}
                  aria-label="New password"
                />
                <TouchableOpacity
                  style={styles.showHideButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={20} color="gray" />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.newPassword && (
            <Text style={styles.errorText}>{errors.newPassword.message}</Text>
          )}

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Please confirm your new password",
              validate: (value) =>
                value === getValues("newPassword") || "Passwords do not match",
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])[^\s]{8,}$/,
                message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and no spaces.",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  style={[styles.input, errors.confirmPassword && styles.errorInput]}
                  value={value}
                  placeholder="Confirm New Password"
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={onChange}
                  aria-label="Confirm new password"
                />
                <TouchableOpacity
                  style={styles.showHideButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={20} color="gray" />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
          )}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit(handlePasswordSubmit)}
            accessible={true}
            aria-label="Save password"
          >
            <Text style={styles.saveButtonText}>Save Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setModalVisible(false)}
            accessible={true}
            aria-label="Cancel"
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1F2937",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  showHideButton: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  showHideText: {
    color: "#4CAF50",
    fontSize: 14,
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
  cancelButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#EF4444",
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
});

export default ChangePasswordModal;
