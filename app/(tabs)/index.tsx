import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { API_ENDPOINTS } from '@/constants/Api';
import AnimatedButton from '@/components/ui/AnimatedButton';

interface Transaction {
  status: string;
  startDate: string;
  endDate: string;
}

export default function HomeScreen() {
  const [username, setUsername] = useState('John Doe');
  const [stats, setStats] = useState({
    hikes: 0,
    hikingDays: 0,
    hours: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        try {
          const userResponse = await axios.get(`${API_ENDPOINTS.AUTH.ME}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = userResponse.data.data;
          setUsername(userData.fullName);

          const transactionsResponse = await axios.get(`${API_ENDPOINTS.TRANSACTION.GET_ALL_TRANSACTIONS}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const transactions: Transaction[] = transactionsResponse.data.data;

          const doneTransactions = transactions.filter((t: Transaction) => t.status === "DONE");

          const totalHikes = doneTransactions.length;

          const totalDays = doneTransactions.reduce((sum: number, t: Transaction) => {
            if (t.startDate && t.endDate) {
              const start = new Date(t.startDate);
              const end = new Date(t.endDate);
              const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
              return sum + days;
            }
            return sum;
          }, 0);

          const totalHours = doneTransactions.reduce((sum: number, t: any) => {
            const start = new Date(t.startDate);
            const end = new Date(t.endDate);
            
            const durationInMillis = end.getTime() - start.getTime();
            const durationInHours = durationInMillis / (1000 * 60 * 60);
            
            return sum + durationInHours;
          }, 0);

          setStats({
            hikes: totalHikes,
            hikingDays: totalDays,
            hours: totalHours,
          });
        } catch (error) {
          console.error('Error fetching user or stats data:', error);
        }
      }
    };

    fetchUserData();
  }, []);


  return (
    <View style={styles.container}>
      {/* Bagian Atas */}
      <View style={styles.topSection}>
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.helloText}>Hello, {username}</Text>
            <Text style={styles.title}>Track Your Adventure</Text>
          </View>
          <Image source={require('@/assets/images/Illustration.png')} style={styles.image} />
        </View>

        <AnimatedButton />
      </View>

      {/* Bagian Bawah untuk Statistik */}
      <View style={styles.bottomSection}>
        <Text style={styles.statsTitle}>Your Hiking Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome5 name="hiking" size={30} color={Colors.primary} />
            <Text style={styles.statValue}>{stats.hikes}</Text>
            <Text style={styles.statLabel}>Total Hikes</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome5 name="calendar" size={30} color={Colors.primary} />
            <Text style={styles.statValue}>{stats.hikingDays}</Text>
            <Text style={styles.statLabel}>Hiking Days</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome5 name="clock" size={30} color={Colors.primary} />
            <Text style={styles.statValue}>{stats.hours}</Text>
            <Text style={styles.statLabel}>Hours Spent</Text>
          </View>
        </View>
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
    marginTop: 40,
    marginBottom: 80,
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
  bottomSection: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    width: 100,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 5,
  },
});
