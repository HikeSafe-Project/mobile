import React from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Tracking App</Text>
        <Text style={styles.subtitle}>Lacak dan Kelola Perjalanan Anda dengan Mudah</Text>
      </View>

      {/* Features Section */}
      <View style={styles.features}>
        <View style={styles.featureItem}>
          <FontAwesome5 name="map-marked-alt" size={24} color="#6200EE" />
          <Text style={styles.featureText}>Peta Real-time</Text>
        </View>
        <View style={styles.featureItem}>
          <MaterialIcons name="group" size={24} color="#6200EE" />
          <Text style={styles.featureText}>Kelola Kelompok</Text>
        </View>
        <View style={styles.featureItem}>
          <FontAwesome5 name="hiking" size={24} color="#6200EE" />
          <Text style={styles.featureText}>Informasi Pendaki</Text>
        </View>
      </View>

      {/* Navigation Section */}
      <TouchableOpacity style={styles.button}>
        <Link href="/tracking" style={styles.buttonText}>
          Mulai Lacak Perjalanan
        </Link>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200EE',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

