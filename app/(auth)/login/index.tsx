import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { API_ENDPOINTS } from '@/constants/Api';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  const handleLogin = async (data: LoginFormInputs) => {
    const { email, password } = data;

    setIsLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const token = response.data.data.accessToken;
      await AsyncStorage.setItem('token', token);

      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Cannot Login', 'Invalid email or password!');
    } finally {
      setIsLoading(false);
    }
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
          <Text style={styles.title}>Welcome back, please login to your account</Text>
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email format',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  errors.email && { borderColor: 'red' },
                ]}
                placeholder="Email"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="password"
              rules={{ required: 'Password is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.textInput,
                    errors.password && { borderColor: 'red' },
                  ]}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FontAwesome
                name={showPassword ? 'eye' : 'eye-slash'}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(handleLogin)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
          <Link href="/register" style={styles.link}>
            Don't have an account? Register
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
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 30,
    fontWeight: '700',
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
    marginTop: 20,
    marginBottom: 20,
    color: '#374151',
  },
  form: {
    flexDirection: 'column',
    paddingHorizontal: 20,
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
    flexDirection: 'row',
    justifyContent: 'center',
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
