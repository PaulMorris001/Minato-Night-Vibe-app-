import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchVendorTypes } from "@/libs/api";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { VendorType } from "@/libs/interfaces";
import { Fonts } from "@/constants/fonts";
import { AnimatedListCard, LoadingScreen } from "@/components/common";

export default function VendorTypesPage() {
  const { cityId } = useLocalSearchParams();
  const router = useRouter();
  const [types, setTypes] = useState<VendorType[]>([]);
  const [loading, setLoading] = useState(true);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await fetchVendorTypes(cityId as string);
        setTypes(data);
      } catch (error) {
        console.error("Error loading vendor types:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTypes();

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [cityId]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Choose Service</Text>
        <Text style={styles.subtitle}>What are you looking for?</Text>
      </Animated.View>

      <FlatList
        data={types}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <AnimatedListCard
            icon={item.icon as any}
            title={item.name}
            index={index}
            iconSize={28}
            onPress={() => router.push(`/vendor-list/${cityId}/${item._id}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={48} color="#4b5563" />
            <Text style={styles.emptyText}>No vendor types available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerContainer: {
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: "#9ca3af",
  },
  listContent: {
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: "#9ca3af",
    marginTop: 12,
  },
});
