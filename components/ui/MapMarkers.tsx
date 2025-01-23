import React from "react";
import { Marker } from "react-native-maps";
import { Alert } from "react-native";
import { Entypo } from "@expo/vector-icons";

type History = {
  id: number;
  groupName: string;
  hikers: { id: number; name: string; age: number }[];
  coordinates: { latitude: string; longitude: string }[];
};

type Props = {
  histories: History[];
  visibilityMap: { [key: number]: boolean };
};

const MapMarkers = ({ histories, visibilityMap }: Props) => {
  return (
    <>
      {histories.map(
        (history) =>
          visibilityMap[history.id] &&
          history.coordinates.map((coordinate, index) => (
            <Marker
              key={history.id + index}
              coordinate={{
                latitude: parseFloat(coordinate.latitude),
                longitude: parseFloat(coordinate.longitude),
              }}
              title={`${history.groupName}`}
              description={`Location: ${coordinate.latitude}, ${coordinate.longitude}`}
            >
              <Entypo name="dot-single" size={30} color="lime" />
            </Marker>
          ))
      )}
    </>
  );
};

export default MapMarkers;
