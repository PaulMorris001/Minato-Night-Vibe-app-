// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { fetchCities } from "@/libs/api";
// import { City } from "@/libs/interfaces";

// export default function VendorsPage() {
//   const router = useRouter();
//   const [cities, setCities] = useState<City[]>([]);

//   useEffect(() => {
//     const loadCities = async () => {
//       const data = await fetchCities();
//       setCities(data);
//     };
//     loadCities();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Select a City</Text>
//       <FlatList
//         data={cities}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.cityButton}
//             onPress={() =>
//               router.push({
//                 pathname: "/vendor-types/[cityId]",
//                 params: { cityId: item._id },
//               })
//             }
//           >
//             <Text style={styles.cityText}>
//               {item.name}, {item.state}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
//   title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
//   cityButton: {
//     padding: 15,
//     backgroundColor: "#eee",
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   cityText: { fontSize: 18 },
// });

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { fetchCities } from "@/libs/api";
import { City } from "@/libs/interfaces";
import { LinearGradient } from "expo-linear-gradient";

// Gradient color schemes for variety
const gradients = [
  ["#667eea", "#764ba2"], // Purple
  ["#f093fb", "#f5576c"], // Pink-Red
  ["#4facfe", "#00f2fe"], // Blue
  ["#43e97b", "#38f9d7"], // Green-Cyan
  ["#fa709a", "#fee140"], // Pink-Yellow
  ["#30cfd0", "#330867"], // Cyan-Purple
  ["#a8edea", "#fed6e3"], // Light Blue-Pink
  ["#ff9a56", "#ff6a88"], // Orange-Pink
  ["#ffecd2", "#fcb69f"], // Peach
  ["#ff6e7f", "#bfe9ff"], // Red-Blue
  ["#e0c3fc", "#8ec5fc"], // Lavender-Blue
];

interface AnimatedCityItemProps {
  item: City;
  index: number;
  onPress: () => void;
}

const AnimatedCityItem: React.FC<AnimatedCityItemProps> = ({
  item,
  index,
  onPress,
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

  const gradient = gradients[index % gradients.length];

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchable}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <Text style={styles.cityText}>
            {item.name}, {item.state}
          </Text>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

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
        renderItem={({ item, index }) => (
          <AnimatedCityItem
            item={item}
            index={index}
            onPress={() =>
              router.push({
                pathname: "/vendor-types/[cityId]",
                params: { cityId: item._id },
              })
            }
          />
        )}
        showsVerticalScrollIndicator={false}
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  animatedContainer: {
    marginBottom: 15,
  },
  touchable: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  gradientButton: {
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 70,
  },
  cityText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});