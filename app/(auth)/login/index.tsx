import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const userData = [
        {
          "email": "admin@user",
          "password": "admin",
          "role": "admin"
        },
        {
          "email": "user@user",
          "password": "user",
          "role": "user"
        }
      ]

      const user = userData.find(user => user.email === email && user.password === password);

      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Something went wrong!');
    }
  };

  return (
    <React.Fragment>
    <StatusBar style="auto" />
    <View style={styles.container}>
      <View style={styles.header}> 
         <Image source={require('@/assets/images/Union.png')} style={styles.logo} />
         <Text style={styles.headerText}>HikeSafe</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={require('@/assets/images/mountain.png')} style={styles.image} />
      </View> 
      <View style={styles.form}>
        <Text style={styles.title}>Welcome back, please login your account</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
        />
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome
                name={showPassword ? 'eye' : 'eye-slash'}
                size={20}
                color="gray"
            />
            </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Link href="/register" style={styles.link}>
            Don't have an account? Register
        </Link>
      </View>
    </View>
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
});
