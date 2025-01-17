import React from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const historyData = [
  { id: '1', location: 'Gunung Rinjani', date: '15 Januari 2025' },
  { id: '2', location: 'Gunung Semeru', date: '12 Desember 2024' },
  { id: '3', location: 'Gunung Bromo', date: '5 November 2024' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.helloText}>Hello, Username</Text>
            <Text style={styles.title}>Track Your Belongings</Text>
          </View>
          <Image source={require('@/assets/images/Illustration.png')} style={styles.image} />
        </View>

        <TouchableOpacity style={styles.button}>
          <Link href="/tracking" style={styles.buttonText}>
            Tracking the hikers
          </Link>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.historyTitle}>History</Text>
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <FontAwesome5 name="map-marker-alt" size={20} color={Colors.primary} />
              <View style={styles.historyTextContainer}>
                <Text style={styles.historyLocation}>{item.location}</Text>
                <Text style={styles.historyDate}>{item.date}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No history found</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E8F5E9',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    flex: 1,
    marginTop: 40,
    marginLeft: 20,
  },
  helloText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 5,
    width: 200,
  },
  image: {
    position: 'absolute',
    width: 200,
    height: 200,
    right: -50,
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomSection: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 15,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  historyTextContainer: {
    marginLeft: 10,
  },
  historyLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  historyDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
  },
});
