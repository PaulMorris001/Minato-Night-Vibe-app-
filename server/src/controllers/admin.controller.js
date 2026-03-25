import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/env.js";
import User from "../models/user.model.js";
import Event from "../models/event.model.js";
import Guide from "../models/guide.model.js";

export async function adminLogin(req, res) {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return res.status(500).json({ message: "Admin credentials not configured" });
  }

  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const token = jwt.sign({ isAdmin: true, username }, config.jwt.secret, {
    expiresIn: "24h",
  });

  res.json({ token });
}

export async function getStats(req, res) {
  try {
    const [totalUsers, totalVendors, totalEvents, totalGuides] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isVendor: true }),
      Event.countDocuments(),
      Guide.countDocuments(),
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("username email isVendor createdAt profilePicture");

    res.json({ totalUsers, totalVendors, totalEvents, totalGuides, recentUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getUsers(req, res) {
  try {
    const { search = "", page = 1, limit = 20 } = req.query;
    const query = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("-password -resetPasswordOTP -resetPasswordToken"),
      User.countDocuments(query),
    ]);

    res.json({ users, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function toggleVendorVerified(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user || !user.isVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    user.verified = !user.verified;
    await user.save();
    res.json({ verified: user.verified });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getEvents(req, res) {
  try {
    const { search = "", page = 1, limit = 20 } = req.query;
    const query = search ? { title: { $regex: search, $options: "i" } } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [events, total] = await Promise.all([
      Event.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("createdBy", "username email"),
      Event.countDocuments(query),
    ]);

    res.json({ events, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function toggleEventActive(req, res) {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    event.isActive = !event.isActive;
    await event.save();
    res.json({ isActive: event.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getGuides(req, res) {
  try {
    const { search = "", page = 1, limit = 20 } = req.query;
    const query = search ? { title: { $regex: search, $options: "i" } } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [guides, total] = await Promise.all([
      Guide.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("author", "username email"),
      Guide.countDocuments(query),
    ]);

    res.json({ guides, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function toggleGuideActive(req, res) {
  try {
    const { id } = req.params;
    const guide = await Guide.findById(id);
    if (!guide) return res.status(404).json({ message: "Guide not found" });
    guide.isActive = !guide.isActive;
    await guide.save();
    res.json({ isActive: guide.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteGuide(req, res) {
  try {
    const { id } = req.params;
    await Guide.findByIdAndDelete(id);
    res.json({ message: "Guide deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
