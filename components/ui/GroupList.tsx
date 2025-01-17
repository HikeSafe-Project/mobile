import React from "react";
import { FlatList, TouchableOpacity, Text, Animated, StyleSheet } from "react-native";
import MapView from "react-native-maps";

type Device = {
  id: number;
  groupName: string;
  hikers: { id: number; name: string; age: number }[];
  latitude: number;
  longitude: number;
};

type Props = {
  devices: Device[];
  mapRef: React.RefObject<MapView>;
  fadeAnim: Animated.Value;
};

const GroupList = ({ devices, mapRef, fadeAnim }: Props) => {
  const focusOnGroup = (device: Device) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: device.latitude,
          longitude: device.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000
      );
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] },
      ]}
    >
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => focusOnGroup(item)}>
            <Text style={styles.groupName}>{item.groupName}</Text>
            <Text style={styles.hikers}>{item.hikers.map((hiker) => hiker.name).join(", ")}</Text>
          </TouchableOpacity>
        )}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 300,
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6200EE",
  },
  hikers: {
    fontSize: 14,
    color: "#555",
  },
});

export default GroupList;
