import React from "react";
import { Marker } from "react-native-maps";
import { Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type Device = {
  id: number;
  groupName: string;
  hikers: { id: number; name: string; age: number }[];
  latitude: number;
  longitude: number;
};

type Props = {
  devices: Device[];
};

const MapMarkers = ({ devices }: Props) => {
  const handleMarkerPress = (device: Device) => {
    const hikerNames = device.hikers.map((hiker) => hiker.name).join(", ");
    Alert.alert(
      `Info tentang Kelompok ${device.groupName}`,
      `Anggota: ${hikerNames}\nLokasi: ${device.latitude}, ${device.longitude}`
    );
  };

  return (
    <>
      {devices.map((device) => (
        <Marker
          key={device.id}
          coordinate={{
            latitude: device.latitude,
            longitude: device.longitude,
          }}
          title={`Kelompok ${device.groupName}`}
          description={`Lokasi: ${device.latitude}, ${device.longitude}`}
          onPress={() => handleMarkerPress(device)}
        >
          <FontAwesome name="map-marker" size={30} color="lime" />
        </Marker>
      ))}
    </>
  );
};

export default MapMarkers;
