/**
 * Format a location for display. Drops empty parts and the implicit US
 * country so domestic listings stay clean ("Austin, Texas") while
 * international ones carry the country ("Lagos, Lagos, Nigeria").
 */
export function formatLocation(loc: {
  city?: string;
  state?: string;
  cityState?: string;
  country?: string;
}): string {
  const state = loc.state || loc.cityState;
  const parts = [loc.city, state].filter(Boolean);
  if (loc.country && loc.country !== "United States") {
    parts.push(loc.country);
  }
  return parts.join(", ");
}
