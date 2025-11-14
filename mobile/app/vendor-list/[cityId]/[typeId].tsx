import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { fetchVendors } from "@/libs/api";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Vendor } from "@/libs/interfaces";

export default function VendorsList() {
  const { cityId, typeId } = useLocalSearchParams();
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const loadVendors = async () => {
      const data = await fetchVendors(cityId as string, typeId as string);
      setVendors(data);
    };
    loadVendors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Vendors
      </Text>

      <FlatList
        data={vendors}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 15,
              backgroundColor: "#fafafa",
              marginBottom: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "500" }}>{item.name}</Text>
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
