import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Text, ActivityIndicator, Alert } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '@/constants/Api';
import ButtonCom from '@/components/ui/Button';

type TicketItem = {
  name: string;
  quantity: number;
  price: number;
  type: string;
  total: number;
};

type InvoiceData = {
  id: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  tickets: TicketItem[];
  user: {
    fullName: string;
    email: string;
    phone: string;
  };
};

export default function InvoiceScreen(): JSX.Element {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_ENDPOINTS.TRANSACTION.CREATE_TICKET}/${transactionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.data;
        setInvoiceData({
          id: data.id,
          createdAt: data.createdAt,
          startDate: data.startDate,
          endDate: data.endDate,
          totalAmount: data.totalAmount,
          tickets: data.tickets.map((ticket: any) => ({
            name: ticket.hikerName || 'Unnamed Ticket',
            quantity: ticket.quantity || 1,
            price: ticket.ticketPrice || 0,
            type: ticket.ticketType,
          })),
          user: {
            fullName: data.user.fullName,
            email: data.user.email,
            phone: data.user.phone,
          },
        });
      } catch (error) {
        console.error('Error fetching invoice data:', error);
        Alert.alert('Error', 'Failed to fetch invoice data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [transactionId]);

  const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric' 
    };
    const formattedDate = new Date(date).toLocaleDateString('id-ID', options);
    return formattedDate;
  };

const generateHtml = (): string => {
  if (!invoiceData || !Array.isArray(invoiceData.tickets)) {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 16px; background-color: #f8f9fa;">
          <h1 style="text-align: center;">Invoice</h1>
          <p>No invoice data available.</p>
        </body>
      </html>
    `;
  }

  const ticketsHtml = invoiceData.tickets.length
    ? invoiceData.tickets
        .map((ticket) => {
          const ticketType = ticket.type === 'WNI' ? 'LOCAL' : 'FOREIGNER';
          return `
            <tr style="border: 1px solid #ddd; padding: 8px; background-color: #fff;">
              <td style="padding: 8px; text-align: center;">${ticket.name}</td>
              <td style="padding: 8px; text-align: center;">${ticketType}</td>
              <td style="padding: 8px; text-align: right;">Rp${ticket.price.toLocaleString('id-ID')}</td>
            </tr>`;
        })
        .join('')
    : '<tr><td colspan="3" style="text-align: center;">No tickets found</td></tr>';

  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { font-family: Arial, sans-serif; padding: 16px; background-color: #f8f9fa; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background-color: #e9ecef; }
          .total { text-align: right; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1 style="text-align: center;">Invoice | HikeSafe</h1>
        <div style="display: flex;" >
          <div>
            <p><strong>Date:</strong> </p>
            <p><strong>Buyer's Name:</strong> </p>
            <p><strong>Start Date:</strong> </p>
            <p><strong>End Date:</strong> </p>
          </div>
          <div style="margin-left: 20px;">
            <p>: ${formatDate(invoiceData.createdAt)}</p>
            <p>: ${invoiceData.user.fullName}</p>
            <p>: ${formatDate(invoiceData.startDate)}</p>
            <p>: ${formatDate(invoiceData.endDate)}</p>
          </div>
        </div>

        <h2>Tickets:</h2>
        <table>
          <thead>
            <tr>
              <th>Ticket Name</th>
              <th>Type</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${ticketsHtml}
          </tbody>
        </table>
        <h2 class="total">Total: Rp${invoiceData.totalAmount.toLocaleString('id-ID')}</h2>
      </body>
    </html>
  `;
};



  const printInvoice = async (): Promise<void> => {
    const html = generateHtml();
    if (!html) return;

    try {
      await Print.printAsync({ html });
    } catch (error) {
      Alert.alert('Error', 'Failed to print invoice.');
    }
  };

  const saveInvoiceAsPdf = async (): Promise<void> => {
    const html = generateHtml();
    if (!html) return;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      Alert.alert('Error', 'Failed to save invoice as PDF.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!invoiceData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No invoice data found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>Date</Text>
          <Text style={styles.info}>Buyer's Name</Text>
          <Text style={styles.info}>Start Date</Text>
          <Text style={styles.info}>End Date</Text>
        </View>
        <View style={{ marginRight: 120 }}>
          <Text style={styles.info}>: {formatDate(invoiceData.createdAt)}</Text>
          <Text style={styles.info}>: {invoiceData.user.fullName}</Text>
          <Text style={styles.info}>: {formatDate(invoiceData.startDate)}</Text>
          <Text style={styles.info}>: {formatDate(invoiceData.endDate)}</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>Tickets</Text>
        <View style={styles.ticketHeaderContainer}>
          <Text style={styles.ticketHeader}>Name </Text>
          <Text style={styles.ticketHeader}>Type</Text>
          <Text style={styles.ticketHeader}>Price</Text>
        </View>
      {invoiceData.tickets.map((ticket, index) => (
        <View key={index} style={styles.ticketRow}>
          <Text style={styles.ticketText}>{ticket.name}</Text>
          <Text style={styles.ticketText}>{ticket.type == "WNI" ? "LOCAL" : "FOREIGNER"}</Text>
          <Text style={{ ...styles.ticketText, textAlign: 'right' }}>Rp{ticket.price.toLocaleString('id-ID')}</Text>
        </View>
      ))}
      <Text style={styles.total}>Total: Rp{invoiceData.totalAmount.toLocaleString('id-ID')}</Text>

      <View style={styles.buttonContainer}>
        <ButtonCom variant='primary' onPress={printInvoice} >
          Print Invoice
        </ButtonCom>
        <View style={styles.spacer} />
        <ButtonCom variant='primary' onPress={saveInvoiceAsPdf} >
          Save as PDF
        </ButtonCom>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 16,
  },
  info: {
    fontSize: 14,
    marginVertical: 2,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  ticketHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#e9ecef',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  ticketHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  ticketText: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 16,
  },
  buttonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    bottom: 10,
    right: 0,
    left: 0,
  },
  spacer: {
    height: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

