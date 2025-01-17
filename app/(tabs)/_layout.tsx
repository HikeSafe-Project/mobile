import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const screens = [
  {
    name: "explore/index",
    icon: "search" as const,
  },
  {
    name: "new-post/index",
    icon: "add-circle" as const,
  },
  {
    name: "index",
    icon: "home" as const,
  },
  {
    name: "reels/index",
    icon: "videocam" as const,
  },
  {
    name: "profile/index",
    icon: "person" as const,
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
                    overflow: 'visible',
                    transform: [{ scale }],
                  }}
                >
                  <Ionicons
                    name={screen.icon}
                    color={focused ? "white" : "gray"}
                    size={24}
                  />
                </View>
              );
            }
          }}
        />
      ))}
    </Tabs>
  );
}