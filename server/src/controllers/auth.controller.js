import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export async function register(req, res) {
  const { username, email, password, userType = "client" } = req.body;

  try {
    // Validate userType
    if (!["client", "vendor"].includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed, userType });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User Created Successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating User", details: error.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid Credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      userType: user.userType
    }
  });
}

// Update vendor profile with business details
export async function updateVendorProfile(req, res) {
  const { businessName, businessDescription, vendorType, location, contactInfo } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.userType !== "vendor") {
      return res.status(403).json({ message: "Only vendors can update business profile" });
    }

    // Update vendor-specific fields
    if (businessName) user.businessName = businessName;
    if (businessDescription) user.businessDescription = businessDescription;
    if (vendorType) user.vendorType = vendorType;
    if (location) user.location = location;
    if (contactInfo) user.contactInfo = contactInfo;

    await user.save();

    res.json({
      message: "Vendor profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        businessName: user.businessName,
        businessDescription: user.businessDescription,
        vendorType: user.vendorType,
        location: user.location,
        contactInfo: user.contactInfo,
        verified: user.verified
      }
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating profile", details: error.message });
  }
}

// Get current user profile
export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(400).json({ message: "Error fetching profile", details: error.message });
  }
}
