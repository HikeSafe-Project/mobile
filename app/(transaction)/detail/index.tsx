import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { Colors } from "@/constants/Colors";
import { API_ENDPOINTS } from "@/constants/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Ticket {
  id: string;
  hikerName: string;
  address: string;
  phoneNumber: string;
  ticketType: string;
  ticketPrice: number;
}

interface TransactionDetail {
  id: string;
  startDate: string;
  endDate: string;
  status: "START" | "DONE" | "CANCELLED" | "PENDING" | "BOOKED" | "UNPAID";
  totalAmount: number;
  tickets: Ticket[];
  createdAt: string;
  updatedAt: string;
  paymentUrl: string;
}

const BookDetailScreen: React.FC = () => {
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
  const [transactionDetail, setTransactionDetail] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchTransactionDetail = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get<{ data: TransactionDetail }>(
        `${API_ENDPOINTS.TRANSACTION.CREATE_TICKET}/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactionDetail(response.data.data);
    } catch (error) {
      console.error("Error fetching transaction detail:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTransactionDetail();
  }, []);

  useEffect(() => {
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

  const { id, startDate, endDate, status, totalAmount, tickets, createdAt } = transactionDetail;

  const costBreakdown = tickets.map((ticket) => {
    const ticketTypeLabel = ticket.ticketType === "WNA" ? "FOREIGNER" : "Local";
    return {
      label: `${ticketTypeLabel} - ${ticket.hikerName}`,
      amount: ticket.ticketPrice,
    };
  });

  const totalCost = costBreakdown.reduce((total, item) => total + item.amount, 0);

  const handleInvoice = (transactionId: string) => {
    router.push({
      pathname: "(transaction)/invoice",
      params: { transactionId },
    });
  };

  return (
    <React.Fragment>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Colors.primary]} />}
      >
        {status !== "UNPAID" && status !== "PENDING" && (
          <View style={styles.paymentStatusContainer}>
            <Text style={styles.paymentStatusText}> Your ticket has been paid </Text>
            <TouchableOpacity onPress={() => handleInvoice(id)}>
              <Text style={styles.invoiceButtonText}>Lihat Invoice</Text>
            </TouchableOpacity>
          </View>
        )}

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
                    status === "DONE"
                      ? "#2196F3"
                      : status === "CANCELLED"
                      ? "#f44336"
                      : status === "PENDING"
                      ? "#9E9E9E"
                      : status === "START"
                      ? "#4CAF50"
                      : status === "BOOKED"
                      ? "#FF9800"
                      : status === "UNPAID"
                      ? "#FFC107"
                      : "#000",
                },
              ]}
            >
              {status}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Payment Detail</Text>
          {costBreakdown.map((item, index) => (
            <View key={index} style={styles.costRow}>
              <Text style={styles.label}>{item.label}</Text>
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
      </ScrollView>

      {status === "UNPAID" && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleInvoice(id)}>
            <Text style={styles.buttonText}>Continue Payment</Text>
          </TouchableOpacity>
        </View>
      )}
    </React.Fragment>
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
    fontWeight: "thin",
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
    fontWeight: "thin",
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    marginTop: 20,
  },
  paymentStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentStatusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  paymentStatusIcon: {
    marginLeft: 5,
  },
  invoiceButtonText: {
    color: "#1691de",
    fontSize: 16,
  },
});

export default BookDetailScreen;
