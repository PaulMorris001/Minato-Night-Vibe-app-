import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "@/constants/constants";
import { Fonts } from "@/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";

const INTERESTS = [
  { label: "Music", emoji: "🎵" },
  { label: "Food & Drink", emoji: "🍽️" },
  { label: "Nightlife", emoji: "🌙" },
  { label: "Arts & Culture", emoji: "🎨" },
  { label: "Sports", emoji: "⚽" },
  { label: "Outdoors", emoji: "🌿" },
  { label: "Networking", emoji: "🤝" },
  { label: "Comedy", emoji: "😂" },
  { label: "Fashion", emoji: "👗" },
  { label: "Film & TV", emoji: "🎬" },
  { label: "Wellness", emoji: "🧘" },
  { label: "Tech", emoji: "💻" },
];

export default function InterestsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleContinue = async () => {
    setSaving(true);
    try {
      if (selected.length > 0) {
        const token = await SecureStore.getItemAsync("token");
        await fetch(`${BASE_URL}/profile/picture`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ preferences: selected }),
        });
      }
    } catch {
      // Non-critical — still navigate forward
    } finally {
      setSaving(false);
      router.replace("/(tabs)/home");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>What are you into?</Text>
        <Text style={styles.sub}>Pick your interests so we can surface events and guides you'll love.</Text>

        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        >
          {INTERESTS.map((item) => {
            const active = selected.includes(item.label);
            return (
              <TouchableOpacity
                key={item.label}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => toggle(item.label)}
                activeOpacity={0.8}
              >
                <Text style={styles.chipEmoji}>{item.emoji}</Text>
                <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          onPress={handleContinue}
          disabled={saving}
          activeOpacity={0.85}
          style={styles.continueWrap}
        >
          <LinearGradient
            colors={["#a855f7", "#7c3aed"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueBtn}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.continueBtnText}>
                {selected.length > 0 ? `Continue (${selected.length} selected)` : "Continue"}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/home")}
          style={styles.skipBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0613",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: "#fff",
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: "rgba(244,238,255,0.6)",
    lineHeight: 22,
    marginBottom: 28,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 24,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  chipActive: {
    backgroundColor: "rgba(168,85,247,0.18)",
    borderColor: "#a855f7",
  },
  chipEmoji: {
    fontSize: 16,
  },
  chipLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: "rgba(244,238,255,0.7)",
  },
  chipLabelActive: {
    color: "#e9d5ff",
    fontFamily: Fonts.semiBold,
  },
  continueWrap: {
    marginTop: 8,
    borderRadius: 14,
    overflow: "hidden",
  },
  continueBtn: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: "#fff",
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: 14,
  },
  skipText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: "rgba(244,238,255,0.4)",
  },
});
