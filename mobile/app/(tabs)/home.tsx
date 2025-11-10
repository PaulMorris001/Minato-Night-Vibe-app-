import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import CreateEventModal from "@/components/create-event";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import Background from "../../assets/images/background.jpeg";

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
        <ImageBackground source={Background} resizeMode="cover" style={styles.background}>
    
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: 250, // adjust to match navbar height (yours is 60)
            paddingBottom: 250, // space for bottom tabs
          },
        ]}
      >
        <Text style={styles.mainTitle}>NightVibe</Text>

        <Text style={styles.subtitle}>Plan Epic Nights Out and Parties</Text>

        {/* TODO: Add Best of List and Guides text from Replit */}
        <Text style={styles.paragraph}>
          Planning a night out or a bachelorette&apos;s or Christmas party? Use
          NightVibe to find a directory of venues, vendors, and things to do in
          your city!
        </Text>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => router.push("/vendors")}
        >
          <Text style={styles.searchButtonText}>
            Search Vendors and Venues in Your City!
          </Text>
        </TouchableOpacity>

        <View style={styles.featureContainer}>
          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => router.push("/vendors")}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#ff6f61" }]}
            >
              <Ionicons name="business" size={30} color="white" />
            </View>
            <Text style={styles.featureTitle}>Find Vendors & Venues</Text>
            <Text style={styles.featureDescription}>
              Discover the best options near you
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => router.push("/events")}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#4caf50" }]}
            >
              <Ionicons name="calendar" size={30} color="white" />
            </View>
            <Text style={styles.featureTitle}>Plan Your Event</Text>
            <Text style={styles.featureDescription}>
              Organize your perfect night out
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => router.push("/bests")}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#2196f3" }]}
            >
              <Ionicons name="star" size={30} color="white" />
            </View>
            <Text style={styles.featureTitle}>Best of Lists</Text>
            <Text style={styles.featureDescription}>
              Explore curated guides and top picks
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
          </ImageBackground>
      
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  mainTitle: {
    fontSize: 60,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.secondary,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  paragraph: {
    fontSize: 15,
    color: 'white',
    textAlign: "center",
    marginHorizontal: 25,
    marginBottom: 30,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 50,
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
  featureContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    // paddingHorizontal: 20,
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    width: 350,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  featureTitle: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  eventButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: Colors.primary,
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
