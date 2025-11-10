import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, ImageBackground } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { Colors } from "@/constants/colors";
import Background from "../../assets/images/background.jpeg";
import { capitalize } from "@/hooks/helpers";

export default function TabsLayout() {
  const [user, setUser] = useState({
    id: String,
    username: String,
    email: String,
  });
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const router = useRouter();
  

  useEffect(() => {
    const getDetails = async () => {
      try {
        const storedDetails = await SecureStore.getItemAsync("user");
        if (storedDetails) {
          const parsedDetails = JSON.parse(storedDetails);
          setUser(parsedDetails);
        }
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    };
    getDetails();
  }, []);

  const handleProfilePress = () => {
    setIsProfileModalVisible(true);
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("user");
    router.replace("/login");
      setIsProfileModalVisible(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleGoToDashboard = () => {
    console.log("Go to Dashboard pressed");
    setIsProfileModalVisible(false);
  };

  return (
    <ImageBackground source={Background} resizeMode="cover" style={styles.background}>
      <View style={styles.container}>
        <View style={styles.navbar}>
          <Text style={styles.title}>NightVibe</Text>
          <TouchableOpacity onPress={handleProfilePress}>
            <Ionicons name="person-circle-outline" size={30} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <Modal
          visible={isProfileModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsProfileModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsProfileModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.usernameText}>Hello, {capitalize(user.username)}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleGoToDashboard}>
                <Text style={styles.modalButtonText}>Go to Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.logoutButton]} onPress={handleLogout}>
                <Text style={styles.modalButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#9e32da",
            tabBarInactiveTintColor: "gray",
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="vendors"
            options={{
              title: "Vendors & Venues",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="compass-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="bests"
            options={{
              title: "Best of lists",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="events"
            options={{
              title: "Events",
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="musical-notes-outline"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </Tabs>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  navbar: {
    height: 60,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: Colors.darkBackground,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: Colors.darkBackground,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  usernameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 20,
  },
  modalButton: {
    width: "100%",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#d9534f",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
