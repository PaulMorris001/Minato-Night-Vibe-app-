import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchVendorTypes } from "@/libs/api";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { VendorType } from "@/libs/interfaces";

export default function VendorTypesPage() {
  const { cityId } = useLocalSearchParams();
  const router = useRouter();
  const [types, setTypes] = useState<VendorType[]>([]);
  
  useEffect(() => {
    const loadTypes = async () => {
      const data = await fetchVendorTypes(cityId as string);
      setTypes(data);
    };
    loadTypes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Select Vendor Type
      </Text>

      <FlatList
        data={types}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 15,
              backgroundColor: "#eee",
              borderRadius: 8,
              marginBottom: 12,
            }}
            onPress={() =>
              router.push(`/vendor-list/${cityId}/${item._id}`)
            }
          >
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
