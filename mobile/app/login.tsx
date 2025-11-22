import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "@/constants/constants";
import * as SecureStore from "expo-secure-store";
import { capitalize } from "@/libs/helpers";
import { FormInput, PrimaryButton } from "@/components/shared";
import { useAccount } from "@/contexts/AccountContext";

export default function Login() {
  const router = useRouter();
  const { setActiveAccount } = useAccount();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });
      const user = res.data.user;
      const token = res.data.token;

      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(user));

      // If user is a vendor, show role picker
      if (user.isVendor) {
        setUserData(user);
        setShowRolePicker(true);
        setLoading(false);
      } else {
        // Regular client, go directly to home
        await setActiveAccount("client");
        router.replace("/(tabs)/home");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      Alert.alert("Error", errorMessage);
      console.error(error.response?.data || error.message);
      setLoading(false);
    }
  };

  const selectRole = async (role: "client" | "vendor") => {
    setShowRolePicker(false);

    // Set the active account in context
    await setActiveAccount(role);

    if (role === "vendor") {
      router.replace("/(vendor)/dashboard");
    } else {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>NightVibe</Text>
          <Text style={styles.subtitle}>Welcome Back</Text>
        </View>

        <View style={styles.form}>
          <FormInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <FormInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
          />

          <PrimaryButton
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          >
            Log In
          </PrimaryButton>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={styles.link}>
              Sign up
            </Link>
          </Text>
        </View>
      </View>

      {/* Role Picker Modal */}
      <Modal
        visible={showRolePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRolePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="person-circle" size={48} color="#a855f7" />
              <Text style={styles.modalTitle}>Choose Account</Text>
              <Text style={styles.modalSubtitle}>
                Welcome back, {capitalize(userData?.username)}!
              </Text>
            </View>

            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => selectRole("client")}
            >
              <View style={styles.roleIconContainer}>
                <Ionicons name="person" size={32} color="#a855f7" />
              </View>
              <View style={styles.roleInfo}>
                <Text style={styles.roleTitle}>Continue as Client</Text>
                <Text style={styles.roleDescription}>
                  Browse vendors and book services
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => selectRole("vendor")}
            >
              <View style={styles.roleIconContainer}>
                <Ionicons name="briefcase" size={32} color="#a855f7" />
              </View>
              <View style={styles.roleInfo}>
                <Text style={styles.roleTitle}>Continue as Vendor</Text>
                <Text style={styles.roleDescription}>
                  Manage your business and services
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    marginBottom: 40,
  },
  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#a855f7",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#9ca3af",
    textAlign: "center",
  },
  form: {
    marginBottom: 30,
  },
  loginButton: {
    marginTop: 10,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    color: "#9ca3af",
    fontSize: 15,
  },
  link: {
    color: "#a855f7",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1f1f2e",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 16,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
  },
  roleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#374151",
  },
  roleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: "#9ca3af",
  },
});
