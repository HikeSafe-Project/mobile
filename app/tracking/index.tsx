import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import MapView from "react-native-maps";
import { Easing } from "react-native-reanimated";
import { useNavigation } from "expo-router";
import MapMarkers from "@/components/ui/MapMarkers";
import GroupList from "@/components/ui/GroupList";
import ToggleButton from "@/components/ui/ToggleButton";
import { API_ENDPOINTS } from "@/constants/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type MarkerVisibility = {
  [key: number]: boolean;
};

const TrackingScreen = () => {
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const [showGroups, setShowGroups] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [history, setHistory] = useState([]);
  const [showMarkers, setShowMarkers] = useState<MarkerVisibility>({});

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${API_ENDPOINTS.TRANSACTION.GET_ALL_TRANSACTIONS}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedData = response.data.data;

        const filteredData = fetchedData.filter((transaction: any) => transaction.status === "DONE");

        const mappedHistory = filteredData.map((transaction: any) => ({
          id: transaction.id,
          groupName: transaction.user.fullName,
          startDate: transaction.startDate,
          endDate: transaction.endDate,
          status: transaction.status,
          hikers: transaction.tickets.map((ticket: any) => ({
            id: ticket.id,
            name: ticket.hikerName,
            address: ticket.address,
            phoneNumber: ticket.phoneNumber,
          })),
          coordinates: transaction.coordinates.filter(
            (coord: any) =>
              coord.latitude && coord.longitude
          ),
        }));

        const initialVisibility = Object.fromEntries(
          mappedHistory.map((group: any) => [group.id, true])
        );

        setHistory(mappedHistory);
        setShowMarkers(initialVisibility);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const toggleGroupList = () => {
    if (showGroups) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start(() => {
        fadeAnim.setValue(0);
        setShowGroups(false);
      });
    } else {
      setShowGroups(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start();
    }
  };

  const toggleMarkerVisibility = (groupId: number) => {
    setShowMarkers((prevState) => ({
      ...prevState,
      [groupId]: !prevState[groupId],
    }));
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: -6.1754,
          longitude: 106.8272,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        mapType="satellite"
      >
        <MapMarkers histories={history} visibilityMap={showMarkers} />
      </MapView>
      <ToggleButton showGroups={showGroups} toggleGroupList={toggleGroupList} />
      {showGroups && (
        <GroupList
          histories={history}
          mapRef={mapRef}
          fadeAnim={fadeAnim}
          toggleMarkerVisibility={toggleMarkerVisibility}
          visibilityMap={showMarkers}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default TrackingScreen;
