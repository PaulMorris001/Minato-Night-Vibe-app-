import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Alert,
  RefreshControl,
  AppState,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Fonts } from "@/constants/fonts";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "@/constants/constants";
import { fetchCities } from "@/libs/api";
import { City } from "@/libs/interfaces";
import Carousel from "@/components/Carousel";
import CreateEventModal from "@/components/client/CreateEventModal";
import { scaleFontSize, getResponsivePadding } from "@/utils/responsive";
import PublicEventCard, { PublicEvent } from "@/components/shared/PublicEventCard";
import EventCardSkeleton from "@/components/skeletons/EventCardSkeleton";
import { useStripePayment } from "@/hooks/useStripePayment";
import { trackEvent } from "@/utils/analytics";

export default function Home() {
  const router = useRouter();
  const { payForTicket } = useStripePayment();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [publicEvents, setPublicEvents] = useState<PublicEvent[]>([]);
  const [hasMorePublicEvents, setHasMorePublicEvents] = useState(false);
  const [highlights, setHighlights] = useState<{ trending: PublicEvent[]; upcoming: PublicEvent[] }>({ trending: [], upcoming: [] });
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingHighlights, setLoadingHighlights] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const fetchPublicEvents = async (city?: string | null, silent = false) => {
    try {
      if (!silent) setLoadingEvents(true);
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const cityParam = city ? `&city=${encodeURIComponent(city)}` : "";
      const response = await fetch(`${BASE_URL}/events/public/explore?limit=10${cityParam}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        const events = data.events || [];
        setPublicEvents(events);
        setHasMorePublicEvents(events.length === 10 && (data.total ?? 0) > 10);
      }
    } catch (error) {
      console.error("Fetch public events error:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchHighlights = async () => {
    try {
      setLoadingHighlights(true);
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const response = await fetch(`${BASE_URL}/events/highlights`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setHighlights({ trending: data.trending || [], upcoming: data.upcoming || [] });
      }
    } catch (error) {
      console.error("Fetch highlights error:", error);
    } finally {
      setLoadingHighlights(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchPublicEvents(selectedCity, true), fetchHighlights()]);
    setRefreshing(false);
  };

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for FAB
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Initial data fetch
    fetchPublicEvents(null);
    fetchHighlights();
    fetchCities()
      .then((data) => { if (Array.isArray(data) && data.length > 0) setCities(data); })
      .catch(() => {});

    // Background auto-refresh every 30s
    intervalRef.current = setInterval(() => {
      fetchPublicEvents(selectedCity, true);
    }, 30000);

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        fetchPublicEvents(selectedCity, true);
        fetchHighlights();
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      subscription.remove();
    };
  }, []);

  const handlePurchaseTicket = async (eventId: string, eventTitle: string) => {
    const result = await payForTicket(eventId);
    if (!result.success) {
      if (result.error) Alert.alert("Payment Failed", result.error);
      return;
    }

    const token = await SecureStore.getItemAsync("token");
    const confirmRes = await fetch(`${BASE_URL}/stripe/confirm/ticket/${eventId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentIntentId: result.paymentIntentId }),
    });

    if (confirmRes.ok) {
      trackEvent("ticket_purchased", { eventId, eventTitle });
      Alert.alert("Success!", `You're going to "${eventTitle}"! Check your tickets.`);
      fetch(`${BASE_URL}/notifications/sold`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ type: "ticket", id: eventId }),
      }).catch(() => {});
      fetchPublicEvents();
    } else {
      const d = await confirmRes.json();
      Alert.alert("Error", d.message || "Payment succeeded but ticket could not be issued. Please contact support.");
    }
  };

  const handleJoinFreeEvent = async (eventId: string, eventTitle: string) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;
      const response = await fetch(`${BASE_URL}/events/${eventId}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success!", `You've joined "${eventTitle}"`);
        fetchPublicEvents();
      } else {
        Alert.alert("Error", data.message || "Failed to join event");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to join event");
    }
  };

  const AnimatedFeatureCard = ({
    icon,
    title,
    description,
    gradient,
    delay,
    page,
    onPress,
  }: {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    title: string;
    description: string;
    gradient: readonly [string, string];
    delay: number;
    page?: string;
    onPress?: () => void;
  }) => {
    const cardFade = useRef(new Animated.Value(0)).current;
    const cardSlide = useRef(new Animated.Value(30)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(cardFade, {
          toValue: 1,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
        Animated.spring(cardSlide, {
          toValue: 0,
          delay,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={{
          opacity: cardFade,
          transform: [{ translateY: cardSlide }],
        }}
      >
        <TouchableOpacity
          style={styles.featureCard}
          activeOpacity={0.8}
          onPress={() => {
            if (onPress) {
              onPress();
            } else if (page) {
              const target = page.startsWith("/") ? page : `/${page}`;
              router.push(target as any);
            }
          }}
        >
          <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featureGradient}
          >
        <View style={styles.featureIconContainer}>
          <Ionicons name={icon} size={32} color="white" />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#a855f7"
            colors={["#a855f7"]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={["#0f0f1a", "#1a1a2e", "#16213e"]}
          style={styles.heroSection}
        >
          <Animated.View
            style={[
              styles.heroContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.logoText}>NightVibe</Text>
            <Text style={styles.heroTitle}>
              Plan Epic Nights Out {"\n"}& Unforgettable Parties
            </Text>
            <Text style={styles.heroSubtitle}>
              Discover venues, vendors, and experiences in your city
            </Text>

            <TouchableOpacity
              style={styles.ctaButton}
              activeOpacity={0.8}
              onPress={() => router.push("/(tabs)/vendors")}
            >
              <LinearGradient
                colors={["#a855f7", "#7c3aed"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>Explore Vendors</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Decorative elements */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
        </LinearGradient>

        {/* Trending Now Section */}
        <View style={styles.exploreSection}>
          <View style={styles.exploreSectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="flame" size={20} color="#f97316" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Trending Now</Text>
            </View>
          </View>
          {loadingHighlights ? (
            <EventCardSkeleton count={3} horizontal />
          ) : highlights.trending.length > 0 ? (
            <Carousel itemWidth={300} gap={16}>
              {highlights.trending.map((event) => (
                <PublicEventCard
                  key={event._id}
                  event={event}
                  onPurchaseTicket={handlePurchaseTicket}
                  onJoinFreeEvent={handleJoinFreeEvent}
                />
              ))}
            </Carousel>
          ) : (
            <View style={styles.emptySectionContainer}>
              <Ionicons name="flame-outline" size={36} color="#4b5563" />
              <Text style={styles.emptySectionText}>No trending events yet</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Text style={styles.emptySectionCta}>Create the first one</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* This Week Section */}
        {(highlights.upcoming.length > 0 || !loadingHighlights) && (
          <View style={styles.exploreSection}>
            <View style={styles.exploreSectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="calendar" size={18} color="#a855f7" style={{ marginRight: 6 }} />
                <Text style={styles.sectionTitle}>This Week</Text>
              </View>
            </View>
            {loadingHighlights ? (
              <EventCardSkeleton count={3} horizontal />
            ) : highlights.upcoming.length > 0 ? (
              <Carousel itemWidth={300} gap={16}>
                {highlights.upcoming.map((event) => (
                  <PublicEventCard
                    key={event._id}
                    event={event}
                    onPurchaseTicket={handlePurchaseTicket}
                    onJoinFreeEvent={handleJoinFreeEvent}
                  />
                ))}
              </Carousel>
            ) : (
              <View style={styles.emptySectionContainer}>
                <Text style={styles.emptySectionText}>No events this week</Text>
              </View>
            )}
          </View>
        )}

        {/* Upcoming Events Section */}
        <View style={styles.exploreSection}>
          <View style={styles.exploreSectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={() => router.push("/public-events" as any)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>
            Discover amazing public events happening near you
          </Text>

          {/* City filter chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cityFilterScroll}
            contentContainerStyle={styles.cityFilterContent}
          >
            <TouchableOpacity
              style={[styles.cityChip, !selectedCity && styles.cityChipActive]}
              onPress={() => {
                setSelectedCity(null);
                fetchPublicEvents(null);
              }}
            >
              <Text style={[styles.cityChipText, !selectedCity && styles.cityChipTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            {cities.map((city) => (
              <TouchableOpacity
                key={city._id}
                style={[styles.cityChip, selectedCity === city.name && styles.cityChipActive]}
                onPress={() => {
                  setSelectedCity(city.name);
                  fetchPublicEvents(city.name);
                }}
              >
                <Text style={[styles.cityChipText, selectedCity === city.name && styles.cityChipTextActive]}>
                  {city.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {loadingEvents ? (
            <EventCardSkeleton count={4} horizontal />
          ) : publicEvents.length > 0 ? (
            <>
              <Carousel itemWidth={320} gap={16}>
                {publicEvents.map((event) => (
                  <PublicEventCard
                    key={event._id}
                    event={event}
                    onPurchaseTicket={handlePurchaseTicket}
                    onJoinFreeEvent={handleJoinFreeEvent}
                  />
                ))}
              </Carousel>
              {hasMorePublicEvents && (
                <TouchableOpacity
                  style={styles.seeAllBtn}
                  onPress={() => router.push("/public-events" as any)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.seeAllText}>See All Events</Text>
                  <Ionicons name="arrow-forward" size={14} color="#a855f7" />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.emptySectionContainer}>
              <Ionicons name="calendar-outline" size={36} color="#4b5563" />
              <Text style={styles.emptySectionText}>
                {selectedCity ? `No events in ${selectedCity}` : "No upcoming events"}
              </Text>
            </View>
          )}
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What We Offer</Text>
          <Text style={styles.sectionSubtitle}>
            Everything you need for the perfect night
          </Text>

          <View style={styles.featuresGrid}>
            <AnimatedFeatureCard
              icon="business"
              title="Find Vendors & Venues"
              description="Discover the best nightlife spots and service providers"
              gradient={["#667eea", "#764ba2"] as const}
              delay={100}
              page="vendors"
            />
            <AnimatedFeatureCard
              icon="calendar"
              title="Plan Your Event"
              description="Organize every detail of your perfect night out"
              gradient={["#f093fb", "#f5576c"] as const}
              delay={200}
              onPress={() => setIsModalVisible(true)}
            />
            <AnimatedFeatureCard
              icon="star"
              title="Curated Lists"
              description="Explore top-rated picks and local favorites"
              gradient={["#4facfe", "#00f2fe"] as const}
              delay={300}
              page="bests"
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with love for nightlife enthusiasts
          </Text>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View
        style={[styles.fabContainer, { transform: [{ scale: pulseAnim }] }]}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsModalVisible(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#a855f7", "#7c3aed"]}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={28} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <CreateEventModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onEventCreated={() => fetchPublicEvents(selectedCity)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#0f0f1a",
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    paddingHorizontal: getResponsivePadding(),
    position: "relative",
    overflow: "hidden",
    height: Dimensions.get('window').height - 195,
    justifyContent: "center",
  },
  heroContent: {
    alignItems: "center",
  },
  logoText: {
    fontSize: scaleFontSize(40),
    fontFamily: Fonts.black,
    color: "#a855f7",
    marginBottom: 16,
    textShadowColor: "rgba(168, 85, 247, 0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
  },
  heroTitle: {
    fontSize: scaleFontSize(24),
    fontFamily: Fonts.bold,
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 32,
  },
  heroSubtitle: {
    fontSize: scaleFontSize(16),
    fontFamily: Fonts.regular,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  ctaText: {
    color: "white",
    fontSize: scaleFontSize(18),
    fontFamily: Fonts.bold,
  },
  decorCircle1: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(168, 85, 247, 0.1)",
  },
  decorCircle2: {
    position: "absolute",
    bottom: -50,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(124, 58, 237, 0.1)",
  },
  featuresSection: {
    paddingVertical: 50,
    paddingHorizontal: getResponsivePadding(),
    backgroundColor: "#0f0f1a",
  },
  sectionTitle: {
    fontSize: scaleFontSize(22),
    fontFamily: Fonts.bold,
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: scaleFontSize(15),
    fontFamily: Fonts.regular,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 32,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  featureGradient: {
    padding: 24,
    alignItems: "center",
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: scaleFontSize(18),
    fontFamily: Fonts.bold,
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: scaleFontSize(14),
    fontFamily: Fonts.regular,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 30,
    alignItems: "center",
    backgroundColor: "#0f0f1a",
  },
  footerText: {
    fontSize: scaleFontSize(14),
    fontFamily: Fonts.regular,
    color: "#6b7280",
  },
  fabContainer: {
    position: "absolute",
    bottom: 16,
    right: 24,
  },
  fab: {
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  fabGradient: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  exploreSection: {
    paddingVertical: 50,
    backgroundColor: "#0f0f1a",
  },
  exploreSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: getResponsivePadding(),
    marginBottom: 8,
  },
  seeAllText: {
    fontSize: scaleFontSize(14),
    fontFamily: Fonts.semiBold,
    color: "#a855f7",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cityFilterScroll: {
    marginTop: 8,
    marginBottom: 12,
  },
  cityFilterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  cityChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#374151",
    marginRight: 8,
  },
  cityChipActive: {
    backgroundColor: "#a855f7",
  },
  cityChipText: {
    fontSize: scaleFontSize(13),
    fontFamily: Fonts.medium,
    color: "#9ca3af",
  },
  cityChipTextActive: {
    color: "#fff",
  },
  emptySectionContainer: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptySectionText: {
    fontSize: scaleFontSize(14),
    fontFamily: Fonts.regular,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  emptySectionCta: {
    fontSize: scaleFontSize(14),
    fontFamily: Fonts.semiBold,
    color: "#a855f7",
    marginTop: 6,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    paddingVertical: 10,
  },
});
