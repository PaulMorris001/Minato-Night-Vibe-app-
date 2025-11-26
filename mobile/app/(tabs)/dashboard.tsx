import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";

// Import the existing tab screens
import HomeScreen from "./home";
import VendorsScreen from "./vendors";
import BestsScreen from "./bests";
import EventsScreen from "./events";
import ChatsScreen from "./chats";

type TabType = "home" | "vendors" | "bests" | "events" | "chats";

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const renderTabButton = (
    tab: TabType,
    icon: keyof typeof Ionicons.glyphMap,
    focusedIcon: keyof typeof Ionicons.glyphMap,
    label: string
  ) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={activeTab === tab ? focusedIcon : icon}
        size={24}
        color={activeTab === tab ? Colors.primary : "#6b7280"}
      />
      <Text
        style={[
          styles.tabLabel,
          activeTab === tab && styles.tabLabelActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Tab Content */}
      <View style={styles.content}>
        {activeTab === "home" && <HomeScreen />}
        {activeTab === "vendors" && <VendorsScreen />}
        {activeTab === "bests" && <BestsScreen />}
        {activeTab === "events" && <EventsScreen />}
        {activeTab === "chats" && <ChatsScreen />}
      </View>

      {/* Bottom Tab Navigation */}
      <View style={styles.tabContainer}>
        {renderTabButton("home", "home-outline", "home", "Home")}
        {renderTabButton("vendors", "compass-outline", "compass", "Vendors")}
        {renderTabButton("bests", "trophy-outline", "trophy", "Best Of")}
        {renderTabButton("events", "calendar-outline", "calendar", "Events")}
        {renderTabButton("chats", "chatbubbles-outline", "chatbubbles", "Chats")}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBackground,
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Platform.OS === "ios" ? "rgba(31, 31, 46, 0.95)" : "#1f1f2e",
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "rgba(168, 85, 247, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 4,
  },
  tabButtonActive: {
    // Active state styling handled by color changes
  },
  tabLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontFamily: Fonts.semiBold,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
});
