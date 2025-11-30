/**
 * Common population patterns for Mongoose models
 * Centralizes repeated populate configurations following DRY principles
 */

/**
 * User fields to populate
 */
export const userFields = "username email profilePicture";

/**
 * Vendor fields to populate
 */
export const vendorFields = "username email profilePicture businessName businessPicture vendorType";

/**
 * Event population configuration
 */
export const eventPopulate = [
  { path: "createdBy", select: userFields },
  { path: "invitedUsers", select: userFields },
];

/**
 * Chat population configuration
 */
export const chatPopulate = [
  { path: "participants", select: userFields },
  { path: "admins", select: userFields },
  {
    path: "lastMessage",
    populate: { path: "sender", select: userFields },
  },
];

/**
 * Message population configuration
 */
export const messagePopulate = [
  { path: "sender", select: userFields },
  { path: "replyTo" },
  { path: "event" },
];

/**
 * Helper function to apply multiple populates
 * @param {Query} query - Mongoose query
 * @param {Array} populateArray - Array of populate configurations
 * @returns {Query} - Query with populates applied
 */
export const applyPopulate = (query, populateArray) => {
  populateArray.forEach((config) => {
    query = query.populate(config);
  });
  return query;
};
