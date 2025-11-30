import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BASE_URL } from "@/constants/constants";
import { Fonts } from "@/constants/fonts";

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  image?: string;
  description?: string;
  shareToken: string;
  createdBy: User;
  invitedUsers: User[];
  createdAt: string;
  updatedAt: string;
}

interface SearchedUser {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  isVendor: boolean;
  businessName?: string;
}

export default function EventDetailsPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<SearchedUser[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const fetchEventDetails = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setEvent(data.event);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch event details");
        router.back();
      }
    } catch (error) {
      console.error("Fetch event details error:", error);
      Alert.alert("Error", "Failed to load event details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const userJson = await SecureStore.getItemAsync("user");
      if (userJson) {
        const user = JSON.parse(userJson);
        setCurrentUserId(user.id);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  useEffect(() => {
    loadCurrentUser();
    fetchEventDetails();
  }, [id]);

  const searchUsers = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchedUsers([]);
      return;
    }

    try {
      setSearchingUsers(true);
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch(
        `${BASE_URL}/users/search?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Filter out users that are already invited or are the creator
        const filteredUsers = data.users.filter(
          (user: SearchedUser) =>
            user.id !== event?.createdBy._id &&
            !event?.invitedUsers.some((invitedUser) => invitedUser._id === user.id)
        );
        setSearchedUsers(filteredUsers);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setSearchingUsers(false);
    }
  };

  useEffect(() => {
    if (userSearchQuery.trim().length >= 2) {
      const debounce = setTimeout(() => {
        searchUsers(userSearchQuery);
      }, 300);
      return () => clearTimeout(debounce);
    } else {
      setSearchedUsers([]);
    }
  }, [userSearchQuery, event]);

  const handleInviteUser = async (user: SearchedUser) => {
    if (!event) return;

    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch(
        `${BASE_URL}/events/${event._id}/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username: user.username }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "User invited successfully");
        setIsInviteModalVisible(false);
        setUserSearchQuery("");
        setSearchedUsers([]);
        fetchEventDetails();
      } else {
        Alert.alert("Error", data.message || "Failed to invite user");
      }
    } catch (error) {
      console.error("Invite user error:", error);
      Alert.alert("Error", "Failed to invite user");
    }
  };

  const isCreator = event?.createdBy._id === currentUserId;

  if (loading) {
    return (
      <LinearGradient colors={["#0f0f1a", "#1a1a2e"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a855f7" />
        </View>
      </LinearGradient>
    );
  }

  if (!event) {
    return null;
  }

  const eventDate = new Date(event.date);

  return (
    <>
      <LinearGradient colors={["#0f0f1a", "#1a1a2e"]} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Event Image */}
          {event.image ? (
            <Image source={{ uri: event.image }} style={styles.eventImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="calendar-outline" size={64} color="#6b7280" />
            </View>
          )}

          {/* Event Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.eventTitle}>{event.title}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color="#a855f7" />
              <Text style={styles.detailText}>
                {eventDate.toLocaleDateString()} at{" "}
                {eventDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location" size={20} color="#a855f7" />
              <Text style={styles.detailText}>{event.location}</Text>
            </View>

            {event.description ? (
              <View style={styles.descriptionContainer}>
                <View style={styles.detailRow}>
                  <Ionicons name="document-text" size={20} color="#a855f7" />
                  <Text style={styles.sectionTitle}>Description</Text>
                </View>
                <Text style={styles.descriptionText}>{event.description}</Text>
              </View>
            ) : null}

            {/* Created By */}
            <View style={styles.sectionContainer}>
              <View style={styles.detailRow}>
                <Ionicons name="person" size={20} color="#a855f7" />
                <Text style={styles.sectionTitle}>Organized by</Text>
              </View>
              <View style={styles.userCard}>
                {event.createdBy.profilePicture ? (
                  <Image
                    source={{ uri: event.createdBy.profilePicture }}
                    style={styles.userAvatar}
                  />
                ) : (
                  <View style={styles.userAvatarPlaceholder}>
                    <Ionicons name="person" size={24} color="#a855f7" />
                  </View>
                )}
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{event.createdBy.username}</Text>
                  <Text style={styles.userEmail}>{event.createdBy.email}</Text>
                </View>
              </View>
            </View>

            {/* Invited Users */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.detailRow}>
                  <Ionicons name="people" size={20} color="#a855f7" />
                  <Text style={styles.sectionTitle}>
                    Invited ({event.invitedUsers.length})
                  </Text>
                </View>
                {isCreator && (
                  <TouchableOpacity
                    style={styles.inviteButton}
                    onPress={() => setIsInviteModalVisible(true)}
                  >
                    <Ionicons name="person-add" size={18} color="#fff" />
                    <Text style={styles.inviteButtonText}>Invite</Text>
                  </TouchableOpacity>
                )}
              </View>

              {event.invitedUsers.length > 0 ? (
                event.invitedUsers.map((user) => (
                  <View key={user._id} style={styles.userCard}>
                    {user.profilePicture ? (
                      <Image
                        source={{ uri: user.profilePicture }}
                        style={styles.userAvatar}
                      />
                    ) : (
                      <View style={styles.userAvatarPlaceholder}>
                        <Ionicons name="person" size={24} color="#a855f7" />
                      </View>
                    )}
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{user.username}</Text>
                      <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No users invited yet</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Invite User Modal */}
      <Modal
        visible={isInviteModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setIsInviteModalVisible(false);
          setUserSearchQuery("");
          setSearchedUsers([]);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => {
              setIsInviteModalVisible(false);
              setUserSearchQuery("");
              setSearchedUsers([]);
            }}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invite User</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsInviteModalVisible(false);
                  setUserSearchQuery("");
                  setSearchedUsers([]);
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color="#6b7280"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by username or email..."
                  placeholderTextColor="#6b7280"
                  value={userSearchQuery}
                  onChangeText={setUserSearchQuery}
                  autoCapitalize="none"
                  autoFocus
                />
              </View>

              {searchingUsers && (
                <View style={styles.loadingSearchContainer}>
                  <ActivityIndicator size="small" color="#a855f7" />
                </View>
              )}

              <FlatList
                data={searchedUsers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.searchUserCard}
                    onPress={() => handleInviteUser(item)}
                  >
                    {item.profilePicture ? (
                      <Image
                        source={{ uri: item.profilePicture }}
                        style={styles.userAvatar}
                      />
                    ) : (
                      <View style={styles.userAvatarPlaceholder}>
                        <Ionicons name="person" size={24} color="#a855f7" />
                      </View>
                    )}
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{item.username}</Text>
                      <Text style={styles.userEmail}>
                        {item.isVendor && item.businessName
                          ? item.businessName
                          : item.email}
                      </Text>
                    </View>
                    {item.isVendor && (
                      <View style={styles.vendorBadge}>
                        <Text style={styles.vendorBadgeText}>Vendor</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  !searchingUsers && userSearchQuery.length >= 2 ? (
                    <View style={styles.emptySearchContainer}>
                      <Ionicons name="people-outline" size={48} color="#6b7280" />
                      <Text style={styles.emptySearchText}>No users found</Text>
                    </View>
                  ) : !searchingUsers && userSearchQuery.length < 2 ? (
                    <View style={styles.emptySearchContainer}>
                      <Ionicons name="search-outline" size={48} color="#6b7280" />
                      <Text style={styles.emptySearchText}>
                        Type at least 2 characters to search
                      </Text>
                    </View>
                  ) : null
                }
                contentContainerStyle={styles.userListContent}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  eventImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: 250,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: "#fff",
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: "#e5e7eb",
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: "#fff",
  },
  descriptionText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: "#d1d5db",
    lineHeight: 22,
    marginTop: 8,
    marginLeft: 32,
  },
  sectionContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  inviteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#a855f7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  inviteButtonText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: "#fff",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#1f1f2e",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#374151",
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#374151",
  },
  userAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: "#fff",
  },
  userEmail: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: "#9ca3af",
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: "#6b7280",
    textAlign: "center",
    paddingVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "#1f1f2e",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "75%",
    maxHeight: 600,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: "#fff",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingSearchContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#374151",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: "#fff",
  },
  searchUserCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  vendorBadge: {
    backgroundColor: "#a855f7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vendorBadgeText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: "#fff",
  },
  emptySearchContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptySearchText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: "#6b7280",
    marginTop: 12,
    textAlign: "center",
  },
  userListContent: {
    flexGrow: 1,
  },
});
