import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { useForm, Controller } from 'react-hook-form';
import { API_ENDPOINTS } from '@/constants/Api';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

type FormData = {
  email: string;
  password: string;
  fullName: string;
  birthDate: string;
  nik: string;
  gender: string;
  phone: string;
  address: string;
};

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      birthDate: '',
      nik: '',
      gender: '',
      phone: '',
      address: '',
    },
  });

  const router = useRouter();

  const handleRegister = async (data: FormData) => {
    console.log(data);
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER_CUSTOMER, data);
      const userData = response.data.data;

      Alert.alert('Success', 'Registration successful!');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during Register:', error);
      Alert.alert('Error', 'Something went wrong!');
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    // Update the form value for birthDate
    setValue('birthDate', currentDate.toISOString().split('T')[0]);
  };

  return (
    <React.Fragment>
      <StatusBar style="auto" />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image source={require('@/assets/images/Union.png')} style={styles.logo} />
          <Text style={styles.headerText}>HikeSafe</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={require('@/assets/images/mountain.png')} style={styles.image} />
        </View>
        <View style={styles.form}>
          <Text style={styles.title}>Create an Account</Text>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email && <Text style={styles.errorText}>This field is required</Text>}

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="password"
              rules={{
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                  message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
                },
                validate: (value) => {
                  const invalidCharRegex = /[^A-Za-z\d@$!%*?&#]/;
                  if (invalidCharRegex.test(value)) {
                    return 'Password contains invalid characters';
                  }
                  return true;
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={20} color="gray" />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="Full Name" value={value} onChangeText={onChange} />
            )}
          />
          {errors.fullName && <Text style={styles.errorText}>This field is required</Text>}

          {/* Birth Date */}
          <Text style={styles.label}>Birth Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>{control._formValues.birthDate || 'Select your birth date'}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          {errors.birthDate && <Text style={styles.errorText}>This field is required</Text>}

          {/* NIK */}
          <Text style={styles.label}>NIK</Text>
          <Controller
            control={control}
            name="nik"
            rules={{
              minLength: {
                value: 16,
                message: 'NIK must be at least 16 characters',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="NIK"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
              />
            )}
          />
          {errors.nik && <Text style={styles.errorText}>{errors.nik.message}</Text>}

          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
          <Controller
            defaultValue='MALE'
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.input}
              >
                <Picker.Item label="MALE" value="MALE" />
                <Picker.Item label="FEMALE" value="FEMALE" />
              </Picker>
            )}
          />

          {/* Phone */}
          <Text style={styles.label}>Phone</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.phone && <Text style={styles.errorText}>This field is required</Text>}

          {/* Address */}
          <Text style={styles.label}>Address</Text>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="Address" value={value} onChangeText={onChange} />
            )}
          />
          {errors.address && <Text style={styles.errorText}>This field is required</Text>}

          <TouchableOpacity style={styles.button} onPress={handleSubmit(handleRegister)}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <Link href="/login" style={styles.link}>
            Already have an account? Log in
          </Link>
        </View>
      </ScrollView>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginRight: 10,
    marginTop: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: '700',
    marginTop: 40,
    marginBottom: 20,
    color: '#fff',
  },
  imageContainer: {
    backgroundColor: '#F5DBC4',
    width: '100%',
  },
  image: {
    width: 'auto',
    height: 150,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '300',
    marginBottom: 20,
    color: '#374151',
  },
  form: {
    flexDirection: 'column',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.secondary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: '#1D4ED8',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

