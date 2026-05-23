import { router } from "expo-router";

/**
 * Navigate to a user's public profile. Centralized so every avatar/name in the
 * app links the same way. No-ops on a missing id.
 */
export function openUserProfile(userId?: string | null) {
  if (!userId) return;
  router.push({ pathname: "/user-profile", params: { userId } } as any);
}
