import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchVendors } from "@/libs/api";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Linking,
} from "react-native";
import { Vendor } from "@/libs/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

export default function VendorsList() {
  const { cityId, typeId } = useLocalSearchParams();
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const data = await fetchVendors(cityId as string, typeId as string);
        setVendors(data);
      } catch (error) {
        console.error("Error loading vendors:", error);
      } finally {
        setLoading(false);
      }
    };
    loadVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderPriceRange = (price: number) => {
    const dollars = [];
    for (let i = 0; i < 4; i++) {
      dollars.push(
        <Text
          key={i}
          style={[styles.dollar, i < price ? styles.dollarActive : styles.dollarInactive]}
        >
          $
        </Text>
      );
    }
    return <View style={styles.priceContainer}>{dollars}</View>;
  };

  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < Math.floor(rating) ? "star" : "star-outline"}
          size={16}
          color={i < Math.floor(rating) ? "#fbbf24" : "#4b5563"}
        />
      );
    }
    return (
      <View style={styles.ratingContainer}>
        {stars}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  const handleContact = (type: string, value: string) => {
    if (type === "phone") {
      Linking.openURL(`tel:${value}`);
    } else if (type === "website") {
      Linking.openURL(value.startsWith("http") ? value : `https://${value}`);
    } else if (type === "instagram") {
      Linking.openURL(`https://instagram.com/${value.replace("@", "")}`);
    }
  };

  const renderVendorCard = ({ item }: { item: Vendor }) => (
    <View style={styles.card}>
      {item.images && item.images.length > 0 && (
        <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
      )}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.vendorName}>{item.name}</Text>
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description || "No description available"}
        </Text>

        <View style={styles.infoRow}>
          {renderPriceRange(item.priceRange)}
          {renderRating(item.rating)}
        </View>

        <View style={styles.contactRow}>
          {item.contact?.phone && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleContact("phone", item.contact.phone)}
            >
              <Ionicons name="call-outline" size={18} color={Colors.primary} />
            </TouchableOpacity>
          )}
          {item.contact?.instagram && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleContact("instagram", item.contact.instagram)}
            >
              <Ionicons name="logo-instagram" size={18} color={Colors.primary} />
            </TouchableOpacity>
          )}
          {item.contact?.website && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleContact("website", item.contact.website)}
            >
              <Ionicons name="globe-outline" size={18} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Vendors</Text>
      </View>

      <FlatList
        data={vendors}
        keyExtractor={(item) => item._id}
        renderItem={renderVendorCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#4b5563" />
            <Text style={styles.emptyText}>No vendors found in this category</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <View style={styles.ctaContainer}>
              <Text style={styles.ctaTitle}>Are you a vendor?</Text>
              <Text style={styles.ctaText}>
                Join NightVibe and showcase your business to thousands of potential customers
              </Text>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => router.push("/signup")}
              >
                <Ionicons name="business-outline" size={20} color="#fff" />
                <Text style={styles.ctaButtonText}>Create Vendor Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: Colors.darkBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.darkBackground,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 12,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#1f1f2e",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#374151",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  vendorName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: "#22c55e",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 12,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: "row",
  },
  dollar: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 2,
  },
  dollarActive: {
    color: "#22c55e",
  },
  dollarInactive: {
    color: "#4b5563",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "#fbbf24",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  contactRow: {
    flexDirection: "row",
    gap: 12,
  },
  contactButton: {
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    padding: 10,
    borderRadius: 10,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: 16,
    marginTop: 12,
  },
  footer: {
    marginTop: 20,
  },
  ctaContainer: {
    backgroundColor: "#1f1f2e",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
