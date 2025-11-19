import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ["client", "vendor"],
    required: true,
    default: "client"
  },
  // Client-specific fields
  preferences: {
    type: [String],
    default: []
  },
  // Vendor-specific fields
  businessName: { type: String },
  businessDescription: { type: String },
  vendorType: { type: String },
  location: {
    city: { type: String },
    address: { type: String }
  },
  contactInfo: {
    phone: { type: String },
    website: { type: String }
  },
  verified: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model("user", userSchema);
