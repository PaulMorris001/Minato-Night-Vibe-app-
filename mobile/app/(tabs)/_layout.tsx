import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { capitalize } from "@/libs/helpers";
import { Fonts } from "@/constants/fonts";
import { BASE_URL } from "@/constants/constants";
import { useAccount } from "@/contexts/AccountContext";

export default function TabsLayout() {
  const { activeAccount, setActiveAccount } = useAccount();
  const [user, setUser] = useState<{
    id: string;
    username: string;
    email: string;
    profilePicture?: string;
    isVendor?: boolean;
  }>({
    id: "",
    username: "",
    email: "",
    profilePicture: "",
    isVendor: false,
  });
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const router = useRouter();

  const fetchUserProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        const res = await axios.get(`${BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = res.data.user;
        setUser({
          id: userData._id,
          username: userData.username,
          email: userData.email,
          profilePicture: userData.profilePicture || "",
          isVendor: userData.isVendor || false,
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Check if we should redirect to vendor dashboard only on mount and account changes
  useEffect(() => {
    if (activeAccount === "vendor" && user.isVendor) {
      router.replace("/(vendor)/dashboard");
    } else if (activeAccount === "client") {
      // Ensure we're on the client dashboard when switching to client
      router.replace("/(tabs)/dashboard");
    }
  }, [activeAccount, user.isVendor, router]);

  const handleProfilePress = () => {
    setIsProfileModalVisible(true);
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("activeAccount");
      router.replace("/login");
      setIsProfileModalVisible(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.navbar}>
        <Text style={styles.logoText}>NightVibe</Text>
        <TouchableOpacity
          onPress={handleProfilePress}
          style={styles.profileButton}
          activeOpacity={0.7}
        >
          {user.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.profileImage}
            />
          ) : (
            <LinearGradient
              colors={["#a855f7", "#7c3aed"]}
              style={styles.profileGradient}
            >
              <Ionicons name="person" size={20} color="#fff" />
            </LinearGradient>
          )}
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
              <Ionicons name="close" size={24} color="#9ca3af" />
            </TouchableOpacity>

            <View style={styles.profileHeader}>
              {user.profilePicture ? (
                <Image
                  source={{ uri: user.profilePicture }}
                  style={styles.avatarImage}
                />
              ) : (
                <LinearGradient
                  colors={["#a855f7", "#7c3aed"]}
                  style={styles.avatarGradient}
                >
                  <Ionicons name="person" size={40} color="#fff" />
                </LinearGradient>
              )}
              <Text style={styles.usernameText}>
                {capitalize(user.username)}
              </Text>
              <Text style={styles.emailText}>{user.email}</Text>
              <LinearGradient
                colors={["#3b82f6", "#1d4ed8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.accountTypeBadge}
              >
                <Ionicons
                  name="person"
                  size={14}
                  color="#fff"
                />
                <Text style={styles.accountTypeText}>
                  Client Account
                  {user.isVendor && <Text style={styles.accountTypeSubtext}> • Has Vendor</Text>}
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="calendar-outline" size={20} color="#a855f7" />
              </View>
              <Text style={styles.menuItemText}>My Events</Text>
              <Ionicons name="chevron-forward" size={20} color="#4b5563" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="heart-outline" size={20} color="#a855f7" />
              </View>
              <Text style={styles.menuItemText}>Favorites</Text>
              <Ionicons name="chevron-forward" size={20} color="#4b5563" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsProfileModalVisible(false);
                router.push("/settings");
              }}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="settings-outline" size={20} color="#a855f7" />
              </View>
              <Text style={styles.menuItemText}>Settings</Text>
              <Ionicons name="chevron-forward" size={20} color="#4b5563" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#a855f7"
                />
              </View>
              <Text style={styles.menuItemText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#4b5563" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0f0f1a" },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a",
  },
  navbar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 10 : 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#0f0f1a",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f2e",
  },
  logoText: {
    fontFamily: Fonts.black,
    fontSize: 24,
    color: "#a855f7",
    textShadowColor: "rgba(168, 85, 247, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  profileButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  profileGradient: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#1f1f2e",
    borderRadius: 24,
    padding: 24,
    position: "relative",
    borderWidth: 1,
    borderColor: "#374151",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 10,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  usernameText: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: "#fff",
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: "#9ca3af",
    marginBottom: 12,
  },
  accountTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  accountTypeText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: "#fff",
  },
  accountTypeSubtext: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: "rgba(255, 255, 255, 0.7)",
  },
  divider: {
    height: 1,
    backgroundColor: "#374151",
    marginVertical: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: "#e5e7eb",
    fontFamily: Fonts.medium,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  logoutText: {
    color: "#ef4444",
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
});
