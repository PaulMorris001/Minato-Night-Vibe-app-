import Follow from "../models/follow.model.js";

/**
 * Check if two users mutually follow each other.
 * @param {string} userId1
 * @param {string} userId2
 * @returns {Promise<boolean>}
 */
export async function areMutualFollows(userId1, userId2) {
  const [follow1, follow2] = await Promise.all([
    Follow.findOne({ follower: userId1, following: userId2 }).lean(),
    Follow.findOne({ follower: userId2, following: userId1 }).lean(),
  ]);
  return !!(follow1 && follow2);
}
