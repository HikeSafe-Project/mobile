import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  showGroups: boolean;
  toggleGroupList: () => void;
};

const ToggleButton = ({ showGroups, toggleGroupList }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.button, { bottom: showGroups ? 320 : 10 }]}
      onPress={toggleGroupList}
    >
      <Text style={styles.buttonText}>
        {showGroups ? "Sembunyikan Kelompok" : "Tampilkan Kelompok"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: "#6200EE",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    position: "absolute",
    alignSelf: "center",
    zIndex: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ToggleButton;
