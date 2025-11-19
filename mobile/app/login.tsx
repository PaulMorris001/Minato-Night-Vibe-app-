import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
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
} from "react-native";
import axios from "axios";
import { BASE_URL } from "@/constants/constants";
import * as SecureStore from "expo-secure-store";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

      // Redirect based on user type
      if (user.userType === "vendor") {
        router.replace("/(vendor)/dashboard");
      } else {
        router.replace("/(tabs)/home");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
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
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>NightVibe</Text>
          <Text style={styles.subtitle}>Welcome Back</Text>
        </View>

        <View style={styles.form}>
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
              placeholder="Enter your password"
              placeholderTextColor="#999"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>
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
