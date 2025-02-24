import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "@/constants/Api";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import StatusFilterModal from "@/components/modal/StatusFilterModal";
import DateFilterModal from "@/components/modal/DateFilterModal";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import ButtonCom from "@/components/ui/Button";

interface Ticket {
  id: string;
  hikerName: string;
  address: string;
  phoneNumber: string;
}

interface Transaction {
  id: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: number;
  trackerId?: string;
  tickets: Ticket[];
}

export default function TransactionScreen() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [statusModalVisible, setStatusModalVisible] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const router = useRouter();

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        API_ENDPOINTS.TRANSACTION.GET_ALL_TRANSACTIONS,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const filteredTransactions = useMemo(() => {
    let filtered = data;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (transaction) => transaction.status === statusFilter
      );
    }

    if (startDateFilter) {
      filtered = filtered.filter(
        (transaction) =>
          new Date(transaction.startDate) >= new Date(startDateFilter)
      );
    }

    if (endDateFilter) {
      filtered = filtered.filter(
        (transaction) =>
          new Date(transaction.endDate) <= new Date(endDateFilter)
      );
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data, statusFilter, startDateFilter, endDateFilter]);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || new Date();
    if (showStartDatePicker) {
      setStartDateFilter(currentDate.toISOString().split("T")[0]);
    } else if (showEndDatePicker) {
      setEndDateFilter(currentDate.toISOString().split("T")[0]);
    }
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
  };

  const navigateToBookDetail = (transactionId: string) => {
    router.push({
      pathname: "(transaction)/detail",
      params: { transactionId },
    });
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const statusColor = {
      CANCELLED: "#f44336",
      BOOKED: "#FF9800",
      START: "#4CAF50",
      DONE: "#2196F3",
      PENDING: "#9E9E9E",
      UNPAID: "#FFC107",
    }[item.status] || "#555";

    return (
      <TouchableOpacity onPress={() => navigateToBookDetail(item.id)}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.transactionId}>Transaction</Text>
              <Text style={styles.dateText}>{item.createdAt.split("T")[0]}</Text>
            </View>
            <Text style={[styles.status, { color: statusColor }]}>
              {item.status}
            </Text>
          </View>
          <View style={styles.dates}>
            <Text style={styles.date}>
              Start: {item.startDate} - End: {item.endDate}
            </Text>
          </View>
          <View style={styles.tickets}>
            <Text style={styles.sectionTitle}>Tickets:</Text>
            {item.tickets.map((ticket) => (
              <View key={ticket.id} style={styles.ticket}>
                <Text>Hiker: {ticket.hikerName}</Text>
                <Text>Address: {ticket.address}</Text>
                <Text>Phone: {ticket.phoneNumber}</Text>
              </View>
            ))}
          </View>
          <View style={styles.footer}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amount}>
              Rp{new Intl.NumberFormat("id-ID").format(item.totalAmount)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        <ButtonCom
          variant="ghost"
          onPress={() => setStatusModalVisible(true)}
        >
          <Text style={styles.filterButtonText}>Filter by Status</Text>
        </ButtonCom>
        <ButtonCom
          onPress={() => setModalVisible(true)}
          variant="ghost"
        >
          <Text style={styles.filterButtonText}>Filter by Date</Text>
        </ButtonCom>
      </View>

      {filteredTransactions.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Don't have any transaction</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
            />
          }
        />
      )}

      <StatusFilterModal
        visible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        onSelectStatus={setStatusFilter}
      />
      <DateFilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStartDateChange={setStartDateFilter}
        onEndDateChange={setEndDateFilter}
        showStartDatePicker={showStartDatePicker}
        showEndDatePicker={showEndDatePicker}
        onStartDatePickerChange={handleDateChange}
        onEndDatePickerChange={handleDateChange}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  filterButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "thin",
    color: Colors.primary,
  },
  card: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: Colors.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  transactionId: {
    fontWeight: "600",
    fontSize: 16,
  },
  dateText: {
    color: "#555",
    fontSize: 14,
  },
  status: {
    fontWeight: "600",
    fontSize: 14,
  },
  dates: {
    marginVertical: 10,
  },
  date: {
    fontSize: 14,
    color: "#555",
  },
  tickets: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 10,
  },
  ticket: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
  },
  footer: {
    marginTop: 15,
    alignItems: "flex-end",
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
    noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
  },
});