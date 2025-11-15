// import { useLocalSearchParams, useRouter } from "expo-router";
// import { fetchVendorTypes } from "@/libs/api";
// import { View, Text, TouchableOpacity, FlatList } from "react-native";
// import React, { useEffect, useState } from "react";
// import { VendorType } from "@/libs/interfaces";

// export default function VendorTypesPage() {
//   const { cityId } = useLocalSearchParams();
//   const router = useRouter();
//   const [types, setTypes] = useState<VendorType[]>([]);
  
//   useEffect(() => {
//     const loadTypes = async () => {
//       const data = await fetchVendorTypes(cityId as string);
//       setTypes(data);
//     };
//     loadTypes();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
//         Select Vendor Type
//       </Text>

//       <FlatList
//         data={types}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={{
//               padding: 15,
//               backgroundColor: "#eee",
//               borderRadius: 8,
//               marginBottom: 12,
//             }}
//             onPress={() =>
//               router.push(`/vendor-list/${cityId}/${item._id}`)
//             }
//           >
//             <Text style={{ fontSize: 18 }}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

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
import { VendorType } from "@/libs/interfaces";
import { LinearGradient } from "expo-linear-gradient";

// Gradient color schemes for variety
const gradientColors = [
  ["#667eea", "#764ba2"],
  ["#f093fb", "#f5576c"],
  ["#4facfe", "#00f2fe"],
  ["#43e97b", "#38f9d7"],
  ["#fa709a", "#fee140"],
  ["#30cfd0", "#330867"],
  ["#a8edea", "#fed6e3"],
  ["#ff9a9e", "#fecfef"],
];

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const VendorTypeItem = ({
  item,
  index,
  onPress,
}: {
  item: VendorType;
  index: number;
  onPress: () => void;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 100,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const gradientIndex = index % gradientColors.length;

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.itemContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={gradientColors[gradientIndex]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.itemText}>{item.name}</Text>
      </LinearGradient>
    </AnimatedTouchable>
  );
};

export default function VendorTypesPage() {
  const { cityId } = useLocalSearchParams();
  const router = useRouter();
  const [types, setTypes] = useState<VendorType[]>([]);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadTypes = async () => {
      const data = await fetchVendorTypes(cityId as string);
      setTypes(data);
    };
    loadTypes();

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        }}
      >
        <Text style={styles.header}>Select Vendor Type</Text>
      </Animated.View>

      <FlatList
        data={types}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <VendorTypeItem
            item={item}
            index={index}
            onPress={() => router.push(`/vendor-list/${cityId}/${item._id}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#1a1a1a",
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    padding: 20,
    borderRadius: 16,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});