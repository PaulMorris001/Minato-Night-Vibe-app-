import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String, default: "" },
  description: { type: String, default: "" },

  // Creator of the event
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  // Invited users (for private events)
  invitedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }],

  // Event visibility
  isPublic: { type: Boolean, default: false },

  // Pricing options (only for public events)
  isPaid: { type: Boolean, default: false },
  ticketPrice: { type: Number, default: 0 },
  maxGuests: { type: Number, default: 0 },

  // Shareable link token
  shareToken: { type: String, unique: true, sparse: true },

  // Event status
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Generate share token before saving
eventSchema.pre('save', function(next) {
  if (!this.shareToken) {
    this.shareToken = new mongoose.Types.ObjectId().toString();
  }
  next();
});

export default mongoose.model("event", eventSchema);
