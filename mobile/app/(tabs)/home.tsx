import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import CreateEventModal from "@/components/create-event";
// import { capitalize } from "@/hooks/helpers";

export default function Home() {
  const router = useRouter();

  const [userName, setUserName] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserName(parsedUser.username || parsedUser.name || "User");
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    fetchUser();
  }, []);

  
  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>NightVibe</Text>

      <Text style={styles.subtitle}>Plan Epic Nights Out and Parties</Text>

      {/* TODO: Add Best of List and Guides text from Replit */}
      <Text style={styles.paragraph}>
        Curated lists from local insiders and experts. Click{" "}
        <Text style={styles.link} onPress={() => router.push("/bests")}>
          here
        </Text>{" "}
        to explore the Best of Lists and Guides.
      </Text>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => router.push("/vendors")}
      >
        <Text style={styles.searchButtonText}>
          Search Vendors and Venues in Your City!
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.eventButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.createEvent}>+</Text>
      </TouchableOpacity>

      <CreateEventModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  paragraph: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    marginHorizontal: 25,
    marginBottom: 30,
  },
  link: {
    color: "#ff5252",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  searchButton: {
    backgroundColor: "#ff5252",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 20,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ff5252",
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  eventButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#ff5252",
    width: 60,
    height: 60,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  createEvent: {
    color: "white",
    fontSize: 30,
  },
  
});
