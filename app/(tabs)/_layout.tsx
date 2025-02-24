import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const screens = [
  {
    name: "index",
    icon: "home",
  },
  {
    name: "ticket/index",
    icon: "ticket",
  },
  {
    name: "transaction/index",
    icon: "clipboard-text-outline",
  },
  {
    name: "profile/index",
    icon: "face-man-profile",
  },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "black",
          },
          default: { backgroundColor: "white" },
        }),
      }}
    >
      {screens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            tabBarIcon: ({ focused }) => {
              const scale = focused ? 1.2 : 1;
              return (
                <View
                  style={{
                    backgroundColor: focused ? Colors.secondary : "transparent",
                    borderRadius: 50,
                    padding: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    overflow: "visible",
                    transform: [{ scale }],
                  }}
                >
                  <MaterialCommunityIcons
                    name={screen.icon as any}
                    color={focused ? "white" : "gray"}
                    size={24}
                  />
                </View>
              );
            },
          }}
        />
      ))}
    </Tabs>
  );
}
