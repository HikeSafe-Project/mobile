import React, { useState, useRef, useLayoutEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import MapView from "react-native-maps";
import { Easing } from "react-native-reanimated";
import { useNavigation } from "expo-router";
import MapMarkers from "@/components/ui/MapMarkers";
import GroupList from "@/components/ui/GroupList";
import ToggleButton from "@/components/ui/ToggleButton";

const TrackingScreen = () => {
  const devices = [
    {
      id: 1,
      groupName: "Group A",
      hikers: [
        { id: 1, name: "John Doe", age: 30 },
        { id: 2, name: "Jane Smith", age: 25 },
        { id: 3, name: "Emily Johnson", age: 28 },
        { id: 4, name: "Mark Lee", age: 32 },
        { id: 5, name: "Lucy Brown", age: 29 },
      ],
      latitude: -6.1754,
      longitude: 106.8272,
    },
    {
      id: 2,
      groupName: "Group B",
      hikers: [
        { id: 6, name: "Jake White", age: 34 },
        { id: 7, name: "Sophia Green", age: 27 },
        { id: 8, name: "Alex King", age: 31 },
        { id: 9, name: "Liam Harris", age: 29 },
        { id: 10, name: "Olivia Scott", age: 33 },
      ],
      latitude: -7.7956,
      longitude: 110.3695,
    },
    {
      id: 3,
      groupName: "Group C",
      hikers: [
        { id: 11, name: "Noah Davis", age: 35 },
        { id: 12, name: "Emma Miller", age: 26 },
        { id: 13, name: "Liam Wilson", age: 30 },
        { id: 14, name: "Olivia Taylor", age: 28 },
        { id: 15, name: "William Anderson", age: 32 },
      ],
      latitude: -6.1754,
      longitude: 106.8272,
    },
    {
      id: 4,
      groupName: "Group D",
      hikers: [
        { id: 16, name: "Liam Thompson", age: 34 },
        { id: 17, name: "Olivia Martinez", age: 27 },
        { id: 18, name: "Noah Jackson", age: 31 },
        { id: 19, name: "Emma Clark", age: 29 },
        { id: 20, name: "William Lewis", age: 33 },
      ],
      latitude: -7.7956,
      longitude: 110.3695,
    },
  ];

  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const [showGroups, setShowGroups] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

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
        <MapMarkers devices={devices} />
      </MapView>
      <ToggleButton showGroups={showGroups} toggleGroupList={toggleGroupList} />
      {showGroups && (
        <GroupList
          devices={devices}
          mapRef={mapRef}
          fadeAnim={fadeAnim}
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
});

export default TrackingScreen;
