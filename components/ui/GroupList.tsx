import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  View,
  Modal,
  ScrollView,
} from "react-native";
import MapView from "react-native-maps";

type History = {
  id: number;
  groupName: string;
  hikers: { id: number; name: string; address: string; phoneNumber: number }[];
  coordinates: { latitude: string; longitude: string }[];
  startDate: string;
  endDate: string;
};

type Props = {
  histories: History[];
  mapRef: React.RefObject<MapView>;
  fadeAnim: Animated.Value;
  toggleMarkerVisibility: (groupId: number) => void;
  visibilityMap: { [key: number]: boolean };
};

const GroupList = ({
  histories,
  mapRef,
  fadeAnim,
  toggleMarkerVisibility,
  visibilityMap,
}: Props) => {
  const [selectedGroup, setSelectedGroup] = useState<History | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const focusOnGroup = (history: History) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: parseFloat(history.coordinates[0].latitude),
          longitude: parseFloat(history.coordinates[0].longitude),
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000
      );
    }
  };

  const openModal = (group: History) => {
    setSelectedGroup(group);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedGroup(null);
  };

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [80, 0],
                }),
              },
            ],
          },
        ]}
      >
        {histories.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No Data Available</Text>
          </View>
        ) : (
          <FlatList
            data={histories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <TouchableOpacity
                  style={styles.itemContent}
                  onPress={() => focusOnGroup(item)}
                >
                  <Text style={styles.groupName}>{item.startDate} - {item.endDate}</Text>
                  <Text style={styles.hikers}>
                    {item.hikers.map((hiker) => hiker.name).join(", ")}
                  </Text>
                </TouchableOpacity>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => toggleMarkerVisibility(item.id)}
                  >
                    <MaterialCommunityIcons
                      name={visibilityMap[item.id] ? "eye" : "eye-off"}
                      size={24}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconButton, { marginLeft: 10 }]}
                    onPress={() => openModal(item)}
                  >
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={24}
                      color={Colors.secondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </Animated.View>

      {selectedGroup && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalSubtitle}>
                Periode: {selectedGroup.startDate} - {selectedGroup.endDate}
              </Text>
              <Text style={styles.sectionTitle}>Group</Text>
              <ScrollView style={styles.scrollView}>
                {selectedGroup.hikers.map((hiker) => (
                  <View key={hiker.id} style={styles.hikerContainer}>
                    <Text style={styles.hikerName}>{hiker.name}</Text>
                    <Text style={styles.hikerDetails}>
                      Alamat: {hiker.address}
                    </Text>
                    <Text style={styles.hikerDetails}>
                      Nomor HP: {hiker.phoneNumber}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
              >
                <Text style={styles.closeButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default GroupList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.secondary,
  },
  period: {
    fontSize: 14,
    color: "#888",
    marginVertical: 5,
  },
  hikersLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  hikers: {
    fontSize: 12,
    color: "#555",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: "#f7f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  hikerContainer: {
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  hikerName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  hikerDetails: {
    fontSize: 12,
    color: "#666",
  },
  scrollView: {
    maxHeight: 400,
    width: "100%",
  },
  coordinate: {
    fontSize: 14,
    alignSelf: "flex-start",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
  },
});