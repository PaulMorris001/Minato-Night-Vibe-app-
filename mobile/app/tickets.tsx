import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "@/constants/constants";
import { Fonts } from "@/constants/fonts";
import TicketCard from "@/components/TicketCard";
import TicketCardSkeleton from "@/components/skeletons/TicketCardSkeleton";
import chatService from "@/services/chat.service";

const { width: screenWidth } = Dimensions.get("window");

interface Ticket {
  _id: string;
  event: {
    _id: string;
    title: string;
    date: string;
    location: string;
    image?: string;
    createdBy: {
      _id: string;
      username: string;
      email: string;
      profilePicture?: string;
    };
  };
  ticketPrice: number;
  purchaseDate: string;
  ticketCode: string;
  isValid: boolean;
}

interface ClientBooking {
  _id: string;
  service: { _id: string; name: string; category?: string };
  vendor: { _id: string; username: string; profilePicture?: string };
  preferredDate: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  priceSnapshot?: { amount: number; currency: string };
}

const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#22c55e",
  rejected: "#ef4444",
  cancelled: "#6b7280",
};

export default function TicketsScreen() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [bookings, setBookings] = useState<ClientBooking[]>([]);
  const [activeTab, setActiveTab] = useState<"tickets" | "bookings">("tickets");
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chattingWith, setChattingWith] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setTickets(data.tickets || []);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch tickets");
      }
    } catch (error) {
      console.error("Fetch tickets error:", error);
      Alert.alert("Error", "Failed to load tickets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;
      const res = await fetch(`${BASE_URL}/bookings/client`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data || []);
      }
    } catch (error) {
      console.error("Fetch bookings error:", error);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleChatWithVendor = async (vendorId: string, bookingId: string) => {
    setChattingWith(bookingId);
    try {
      const chat = await chatService.getOrCreateDirectChat(vendorId);
      router.push(`/chat/${chat._id}` as any);
    } catch {
      Alert.alert("Error", "Could not open chat");
    } finally {
      setChattingWith(null);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchBookings();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
      fetchBookings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets();
    fetchBookings();
  };

  return (
    <LinearGradient colors={["#0f0f1a", "#1a1a2e"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>My Tickets</Text>
            <Text style={styles.headerSubtitle}>Tickets & service bookings</Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "tickets" && styles.tabActive]}
            onPress={() => setActiveTab("tickets")}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === "tickets" && styles.tabTextActive]}>
              Event Tickets
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "bookings" && styles.tabActive]}
            onPress={() => setActiveTab("bookings")}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === "bookings" && styles.tabTextActive]}>
              Service Bookings
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#a855f7" />
          }
        >
          {activeTab === "tickets" ? (
            loading ? (
              <TicketCardSkeleton count={3} />
            ) : tickets.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="ticket-outline" size={64} color="#6b7280" />
                <Text style={styles.emptyStateTitle}>No tickets yet</Text>
                <Text style={styles.emptyStateText}>
                  Purchase tickets for public events to see them here
                </Text>
              </View>
            ) : (
              tickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))
            )
          ) : bookingsLoading ? (
            <TicketCardSkeleton count={3} />
          ) : bookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="briefcase-outline" size={64} color="#6b7280" />
              <Text style={styles.emptyStateTitle}>No bookings yet</Text>
              <Text style={styles.emptyStateText}>
                Book a vendor service to see your bookings here
              </Text>
            </View>
          ) : (
            bookings.map((booking) => (
              <View key={booking._id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.bookingServiceName} numberOfLines={1}>
                    {booking.service?.name || "Unknown Service"}
                  </Text>
                  <View style={[styles.bookingStatusBadge, { backgroundColor: `${BOOKING_STATUS_COLORS[booking.status]}20` }]}>
                    <Text style={[styles.bookingStatusText, { color: BOOKING_STATUS_COLORS[booking.status] }]}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Text>
                  </View>
                </View>
                {booking.service?.category && (
                  <Text style={styles.bookingCategory}>{booking.service.category}</Text>
                )}
                <View style={styles.bookingRow}>
                  <Ionicons name="person-outline" size={14} color="#9ca3af" />
                  <Text style={styles.bookingDetail}>{booking.vendor?.username || "Vendor"}</Text>
                </View>
                <View style={styles.bookingRow}>
                  <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
                  <Text style={styles.bookingDetail}>
                    {new Date(booking.preferredDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </Text>
                </View>
                {booking.priceSnapshot && (
                  <View style={styles.bookingRow}>
                    <Ionicons name="cash-outline" size={14} color="#9ca3af" />
                    <Text style={styles.bookingDetail}>
                      {booking.priceSnapshot.currency} {booking.priceSnapshot.amount.toLocaleString()}
                    </Text>
                  </View>
                )}
                {booking.status === "confirmed" && (
                  <TouchableOpacity
                    style={styles.chatVendorButton}
                    onPress={() => handleChatWithVendor(booking.vendor._id, booking._id)}
                    disabled={chattingWith === booking._id}
                    activeOpacity={0.8}
                  >
                    {chattingWith === booking._id ? (
                      <ActivityIndicator size="small" color="#a855f7" />
                    ) : (
                      <>
                        <Ionicons name="chatbubbles-outline" size={16} color="#a855f7" />
                        <Text style={styles.chatVendorButtonText}>Chat with Vendor</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: screenWidth > 400 ? 32 : 28,
    fontFamily: Fonts.bold,
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: screenWidth > 400 ? 14 : 13,
    fontFamily: Fonts.regular,
    color: "#9ca3af",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: "#9ca3af",
    marginTop: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: "#9ca3af",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#1f1f2e",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#a855f7",
  },
  tabText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: "#6b7280",
  },
  tabTextActive: {
    color: "#fff",
  },
  bookingCard: {
    backgroundColor: "#1f1f2e",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  bookingServiceName: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: "#fff",
    marginRight: 8,
  },
  bookingStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  bookingStatusText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
  },
  bookingCategory: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: "#6b7280",
    marginBottom: 8,
  },
  bookingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  bookingDetail: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: "#9ca3af",
  },
  chatVendorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.3)",
  },
  chatVendorButtonText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: "#a855f7",
  },
});
