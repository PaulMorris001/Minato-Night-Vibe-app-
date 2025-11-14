import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { fetchCities } from "@/libs/api";
import { City } from "@/libs/interfaces";

export default function VendorsPage() {
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const loadCities = async () => {
      const data = await fetchCities();
      setCities(data);
    };
    loadCities();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a City</Text>
      <FlatList
        data={cities}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cityButton}
            onPress={() =>
              router.push({
                pathname: "/vendor-types/[cityId]",
                params: { cityId: item._id },
              })
            }
          >
            <Text style={styles.cityText}>
              {item.name}, {item.state}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  cityButton: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
  },
  cityText: { fontSize: 18 },
});
