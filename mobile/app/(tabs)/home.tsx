/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import Background from "../../assets/images/background.jpeg";
import { Colors } from "@/constants/colors";

export default function Home() {
  const [userName, setUserName] = useState("User");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock top vendors data
  const topVendors: {
    id: number;
    name: string;
    category: string;
    rating: number;
    icon: React.ComponentProps<typeof Ionicons>['name'];
  }[] = [
    {
      id: 1,
      name: "Electric Lounge",
      category: "Nightclub",
      rating: 4.8,
      icon: "musical-notes",
    },
    {
      id: 2,
      name: "Skybar Rooftop",
      category: "Bar & Lounge",
      rating: 4.9,
      icon: "wine",
    },
    {
      id: 3,
      name: "Groove Station",
      category: "DJ Services",
      rating: 4.7,
      icon: "disc",
    },
  ];

  // Pricing plans
  const pricingPlans = [
    {
      id: 1,
      name: "Basic",
      price: "$20",
      period: "/month",
      features: [
        "Profile listing",
        "Contact information",
        "Basic analytics",
      ],
      color: "#6366f1",
    },
    {
      id: 2,
      name: "Pro",
      price: "$35",
      period: "/month",
      features: [
        "Everything in Basic",
        "Featured placement",
        "Advanced analytics",
        "Priority support",
      ],
      color: "#9333ea",
      popular: true,
    },
    {
      id: 3,
      name: "Premium",
      price: "$50",
      period: "/month",
      features: [
        "Everything in Pro",
        "Top placement",
        "Booking system",
        "Dedicated account manager",
      ],
      color: "#c026d3",
    },
  ];

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#000" }}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={Background}
          resizeMode="cover"
          style={styles.background}
        >
          <View style={styles.overlay}>
            <View style={[styles.container, { marginTop: 40, flex: 1 }]}>
              <Text style={styles.mainTitle}>NightVibe</Text>

              <Text style={styles.subtitle}>
                Plan Epic Nights Out and Parties
              </Text>

              <Text style={styles.paragraph}>
                Planning a night out or a bachelorette&apos;s or Christmas
                party? Use NightVibe to find a directory of venues, vendors, and
                things to do in your city!
              </Text>

              <TouchableOpacity style={styles.searchButton}>
                <Text style={styles.searchButtonText}>
                  Search Vendors and Venues in Your City!
                </Text>
              </TouchableOpacity>

              <View style={styles.featureContainer}>
                <TouchableOpacity style={styles.featureCard}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#ff6f6" },
                    ]}
                  >
                    <Ionicons name="business" size={30} color="white" />
                  </View>
                  <Text style={styles.featureTitle}>Find Vendors & Venues</Text>
                  <Text style={styles.featureDescription}>
                    Discover the best options near you
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#4caf50" },
                    ]}
                  >
                    <Ionicons name="calendar" size={30} color="white" />
                  </View>
                  <Text style={styles.featureTitle}>Plan Your Event</Text>
                  <Text style={styles.featureDescription}>
                    Organize your perfect night out
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#2196f3" },
                    ]}
                  >
                    <Ionicons name="star" size={30} color="white" />
                  </View>
                  <Text style={styles.featureTitle}>Best of Lists</Text>
                  <Text style={styles.featureDescription}>
                    Explore curated guides and top picks
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Top Vendors Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Our Top Vendors</Text>
                <Text style={styles.sectionSubtitle}>
                  Trusted partners delivering exceptional experiences
                </Text>

                <View style={styles.vendorsContainer}>
                  {topVendors.map((vendor) => (
                    <TouchableOpacity key={vendor.id} style={styles.vendorCard}>
                      <View style={styles.vendorIconContainer}>
                        <Ionicons
                          name={vendor.icon}
                          size={28}
                          color={Colors.primary}
                        />
                      </View>
                      <View style={styles.vendorInfo}>
                        <Text style={styles.vendorName}>{vendor.name}</Text>
                        <Text style={styles.vendorCategory}>
                          {vendor.category}
                        </Text>
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={14} color="#fbbf24" />
                          <Text style={styles.ratingText}>{vendor.rating}</Text>
                        </View>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#9ca3af"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Pricing Plans Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Become a Vendor</Text>
                <Text style={styles.sectionSubtitle}>
                  Choose the perfect plan to showcase your business
                </Text>

                <View style={styles.pricingContainer}>
                  {pricingPlans.map((plan) => (
                    <View
                      key={plan.id}
                      style={[
                        styles.pricingCard,
                        plan.popular && styles.popularCard,
                      ]}
                    >
                      {plan.popular && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularText}>MOST POPULAR</Text>
                        </View>
                      )}
                      <Text style={styles.planName}>{plan.name}</Text>
                      <View style={styles.priceContainer}>
                        <Text style={[styles.price, { color: plan.color }]}>
                          {plan.price}
                        </Text>
                        <Text style={styles.period}>{plan.period}</Text>
                      </View>
                      <View style={styles.featuresContainer}>
                        {plan.features.map((feature, index) => (
                          <View key={index} style={styles.featureRow}>
                            <Ionicons
                              name="checkmark-circle"
                              size={18}
                              color={plan.color}
                            />
                            <Text style={styles.featureText}>{feature}</Text>
                          </View>
                        ))}
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.planButton,
                          { backgroundColor: plan.color },
                          plan.popular && styles.popularButton,
                        ]}
                      >
                        <Text style={styles.planButtonText}>Get Started</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
              {/* </ScrollView> */}
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
      <TouchableOpacity
        style={styles.eventButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.createEvent}>+</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  mainTitle: {
    fontSize: 60,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.secondary,
    textAlign: "center",
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
    color: "white",
    textAlign: "center",
    marginHorizontal: 25,
    marginBottom: 30,
  },
  searchButton: {
    backgroundColor: "#9333ea",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 50,
    alignSelf: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  featureContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  featureCard: {
    backgroundColor: Colors.darkBackground,
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    width: 300,
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
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 12,
    color: "grey",
    textAlign: "center",
  },
  sectionContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#d1d5db",
    textAlign: "center",
    marginBottom: 30,
  },
  vendorsContainer: {
    gap: 12,
  },
  vendorCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vendorIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f3e8ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 2,
  },
  vendorCategory: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
  },
  pricingContainer: {
    gap: 16,
  },
  pricingCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  popularCard: {
    borderWidth: 2,
    borderColor: "#9333ea",
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    right: 20,
    backgroundColor: "#9333ea",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  planName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 20,
  },
  price: {
    fontSize: 42,
    fontWeight: "bold",
  },
  period: {
    fontSize: 16,
    color: "#6b7280",
    marginLeft: 4,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: "#4b5563",
    flex: 1,
  },
  planButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  popularButton: {
    shadowColor: "#9333ea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  planButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  eventButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#9333ea",
    width: 60,
    height: 60,
    borderRadius: 30,
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
