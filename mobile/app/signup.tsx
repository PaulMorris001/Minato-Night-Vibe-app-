import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "@/constants/constants";
import * as SecureStore from "expo-secure-store";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"client" | "vendor">("client");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/register`, {
        username,
        email,
        password,
        userType,
      });

      const user = res.data.user;
      const token = res.data.token;

      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(user));

      // Redirect based on user type
      if (user.userType === "vendor") {
        router.replace("/(vendor)/dashboard");
      } else {
        router.replace("/(tabs)/home");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
      Alert.alert("Error", errorMessage);
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>NightVibe</Text>
            <Text style={styles.subtitle}>Create Your Account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.userTypeContainer}>
              <Text style={styles.label}>I am a</Text>
              <View style={styles.userTypeButtons}>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    userType === "client" && styles.userTypeButtonActive,
                  ]}
                  onPress={() => setUserType("client")}
                >
                  <Text
                    style={[
                      styles.userTypeText,
                      userType === "client" && styles.userTypeTextActive,
                    ]}
                  >
                    Client
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    userType === "vendor" && styles.userTypeButtonActive,
                  ]}
                  onPress={() => setUserType("vendor")}
                >
                  <Text
                    style={[
                      styles.userTypeText,
                      userType === "vendor" && styles.userTypeTextActive,
                    ]}
                  >
                    Vendor
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                placeholder="Choose a username"
                placeholderTextColor="#999"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#999"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="Create a password"
                placeholderTextColor="#999"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Link href="/login" style={styles.link}>
                Log in
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a",
  },
  scrollContent: {
    flexGrow: 1,
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
  userTypeContainer: {
    marginBottom: 24,
  },
  userTypeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    backgroundColor: "#1f1f2e",
    borderWidth: 2,
    borderColor: "#374151",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  userTypeButtonActive: {
    borderColor: "#a855f7",
    backgroundColor: "rgba(168, 85, 247, 0.1)",
  },
  userTypeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9ca3af",
  },
  userTypeTextActive: {
    color: "#a855f7",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1f1f2e",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#fff",
  },
  button: {
    backgroundColor: "#a855f7",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
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
});
