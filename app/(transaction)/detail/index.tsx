import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Button, TouchableOpacity } from "react-native";
import axios from "axios";
import { Colors } from "@/constants/Colors";
import { API_ENDPOINTS } from "@/constants/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonCom from "@/components/ui/Button";

interface Ticket {
  id: string;
  hikerName: string;
  address: string;
  phoneNumber: string;
}

interface TransactionDetail {
  id: string;
  startDate: string;
  endDate: string;
  status: "START" | "DONE" | "CANCELLED" | "PENDING";
  totalAmount: number;
  tickets: Ticket[];
  createdAt: string;
  updatedAt: string;
}

const BookDetailScreen: React.FC = () => {
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
  const [transactionDetail, setTransactionDetail] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get<{ data: TransactionDetail }>(`${API_ENDPOINTS.TRANSACTION.CREATE_TICKET}/${transactionId}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactionDetail(response.data.data);
      } catch (error) {
        console.error("Error fetching transaction detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetail();
  }, [transactionId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!transactionDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to fetch transaction details.</Text>
      </View>
    );
  }

  const {
    id,
    startDate,
    endDate,
    status,
    totalAmount,
    tickets,
    createdAt,
  } = transactionDetail;

  // Dummy cost breakdown
  const costBreakdown = [
    { label: "Base Fee", amount: 500000 },
    { label: "Additional Services", amount: 150000 },
    { label: "Discount", amount: -50000 },
  ];

  const totalCost = costBreakdown.reduce((total, item) => total + item.amount, 0);

  const handlePayment = async () => {
    if (!transactionDetail?.id) {
      console.error("Transaction ID is missing.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("Token not found.");
        return;
      }

      console.log("Transaction ID:", transactionDetail.id);
      console.log("Token:", token);

      const response = await axios.post(
        `${API_ENDPOINTS.PAYMENT.CREATE_PAYMENT}/${transactionDetail.id}/create-payment-link`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Payment link created successfully:", response.data);

      if (response.data?.paymentLink) {
        const paymentLink = response.data.paymentLink;
        console.log("Redirecting to:", paymentLink);
      }
    } catch (error: any) {
      console.error("Error creating payment link:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Transaction Date:</Text>
          <Text style={styles.value}>{new Date(createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Travel Date:</Text>
          <Text style={styles.value}>
            {startDate} - {endDate}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text
            style={[
              styles.value,
              {
                fontWeight: "bold",
                color:
                  status === "START"
                    ? "#4CAF50"
                    : status === "DONE"
                    ? "#2196F3"
                    : status === "CANCELLED"
                    ? "#f44336"
                    : "#FF9800",
              },
            ]}
          >
            {status}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Amount:</Text>
          <Text style={[styles.value, styles.amount]}>
            Rp{new Intl.NumberFormat("id-ID").format(totalAmount)}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Cost Breakdown</Text>
        {costBreakdown.map((item, index) => (
          <View key={index} style={styles.costRow}>
            <Text style={styles.label}>{item.label}:</Text>
            <Text style={styles.value}>
              Rp{new Intl.NumberFormat("id-ID").format(item.amount)}
            </Text>
          </View>
        ))}
        <View style={styles.costRow}>
          <Text style={styles.label}>Total:</Text>
          <Text style={[styles.value, styles.amount]}>
            Rp{new Intl.NumberFormat("id-ID").format(totalCost)}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Hiker Details</Text>
        {tickets.map((ticket, index) => (
          <View key={ticket.id} style={styles.ticketContainer}>
            <Text style={styles.ticketLabel}>Hiker {index + 1}:</Text>
            <View style={styles.ticketDetail}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{ticket.hikerName}</Text>
            </View>
            <View style={styles.ticketDetail}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{ticket.address}</Text>
            </View>
            <View style={styles.ticketDetail}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{ticket.phoneNumber}</Text>
            </View>
          </View>
        ))}
      </View>

      {status === "PENDING" && (
        <ButtonCom variant="primary" onPress={handlePayment} >
          Continue Payment
        </ButtonCom>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.primary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#555",
    fontWeight: "bold",
  },
  value: {
    fontSize: 14,
    color: "#555",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  ticketContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  ticketLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
  },
  ticketDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookDetailScreen;
