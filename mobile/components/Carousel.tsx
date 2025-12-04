import React, { useRef } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface CarouselProps {
  children: React.ReactNode[];
  itemWidth?: number;
  gap?: number;
  showsScrollIndicator?: boolean;
}

export default function Carousel({
  children,
  itemWidth = SCREEN_WIDTH * 0.85,
  gap = 16,
  showsScrollIndicator = false,
}: CarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={showsScrollIndicator}
        decelerationRate="fast"
        snapToInterval={itemWidth + gap}
        snapToAlignment="start"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: (SCREEN_WIDTH - itemWidth) / 2 },
        ]}
        style={styles.scrollView}
      >
        {children.map((child, index) => (
          <View
            key={index}
            style={[
              styles.itemContainer,
              { width: itemWidth, marginRight: index < children.length - 1 ? gap : 0 },
            ]}
          >
            {child}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  scrollView: {
    width: "100%",
  },
  scrollContent: {
    alignItems: "center",
  },
  itemContainer: {
    justifyContent: "center",
  },
});
