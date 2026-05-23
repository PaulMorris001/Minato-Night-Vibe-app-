// Design tokens for the redesigned vendor screens (from design_handoff_vendor).
// Bricolage Grotesque maxes at 800 in the app's font set, so it stands in for
// the handoff's 900 displays; Outfit (Fonts) stands in for "Inter".
import { Fonts } from "@/constants/fonts";

export const VN = {
  bg: "#0B0613",
  surface: "rgba(26,16,48,0.7)",
  surfaceHi: "rgba(36,21,64,0.85)",
  stroke: "rgba(255,255,255,0.08)",
  strokeHi: "rgba(255,255,255,0.14)",
  text: "#F4EEFF",
  textDim: "rgba(244,238,255,0.62)",
  textMute: "rgba(244,238,255,0.38)",
  purple: "#A855F7",
  purpleDeep: "#7C3AED",
  purpleSoft: "#C084FC",
  pink: "#EC4899",
  green: "#34D399",
  greenSoft: "#6EE7B7",
  amber: "#F59E0B",
  amberSoft: "#FCD34D",
  cyan: "#22D3EE",
};

export const VNF = {
  display: "BricolageGrotesque_800ExtraBold", // handoff 900/800
  heading: "BricolageGrotesque_800ExtraBold",
  sub: "BricolageGrotesque_700Bold",
  body: Fonts.regular,
  medium: Fonts.medium,
  semibold: Fonts.semiBold,
  bold: Fonts.bold,
};

// Primary CTA gradient stops + earnings hero gradient
export const VN_CTA_GRADIENT = ["#A855F7", "#7C3AED", "#EC4899"] as const;
export const VN_EARNINGS_GRADIENT = ["#1A1030", "#2A1654", "#4B1A6E"] as const;
export const VN_WORDMARK_GRADIENT = ["#C084FC", "#EC4899"] as const;

// Deterministic cover gradient keyed off an id (service/category covers).
const COVER_PAIRS: [string, string][] = [
  ["#EC4899", "#F59E0B"],
  ["#A855F7", "#7C3AED"],
  ["#22D3EE", "#7C3AED"],
  ["#F59E0B", "#EC4899"],
  ["#34D399", "#22D3EE"],
  ["#7C3AED", "#EC4899"],
];

export function coverGradient(seed: string): [string, string] {
  let h = 0;
  for (let i = 0; i < (seed || "").length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return COVER_PAIRS[h % COVER_PAIRS.length];
}

// Emoji to decorate a category/service cover.
const CATEGORY_EMOJI: Record<string, string> = {
  Chefs: "👨‍🍳",
  "Food and Restaurants": "🍽️",
  Restaurants: "🍽️",
  "Music and Bands": "🎸",
  "Bars and Clubs": "🍸",
  Casinos: "🎰",
  Concerts: "🎤",
  Events: "🎉",
  Transportation: "🚕",
  Venues: "🏛️",
  Florists: "💐",
  Decorations: "🎈",
  Desserts: "🍰",
  Beverages: "🥤",
  Museums: "🖼️",
  Parks: "🌳",
  Hotels: "🏨",
  Spas: "💆",
  Pictures: "📷",
  Photography: "📸",
};

export function categoryEmoji(category?: string): string {
  if (!category) return "✨";
  return CATEGORY_EMOJI[category] || "✨";
}
