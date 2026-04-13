import { City, VendorType, Vendor } from "../models/vendor.model.js";
import Review from "../models/review.model.js";

export async function getAllCities(req, res) {
  try {
    const cities = await City.find().sort({ name: 1 });
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAllVendorTypes(req, res) {
  try {
    const vendorTypes = await VendorType.find().sort({ name: 1 });
    res.status(200).json(vendorTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getVendorTypesByCity(req, res) {
  try {
    // All vendor types are available for all cities
    const vendorTypes = await VendorType.find().sort({ name: 1 });
    res.status(200).json(vendorTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getVendorsByCityAndType(req, res) {
  try {
    const { cityId, vendorTypeId } = req.params;
    const vendors = await Vendor.find({ city: cityId, vendorType: vendorTypeId })
      .populate("city", "name state")
      .populate("vendorType", "name icon")
      .sort({ verified: -1, rating: -1 });
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function rateVendor(req, res) {
  try {
    const { vendorId } = req.params;
    const userId = req.user.id;
    const { rating, review = "" } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    // Upsert: update existing review or create new one
    await Review.findOneAndUpdate(
      { vendor: vendorId, user: userId },
      { rating, review: review.trim() },
      { upsert: true, new: true }
    );

    // Recompute vendor average rating
    const agg = await Review.aggregate([
      { $match: { vendor: vendor._id } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    const avg = agg.length > 0 ? Math.round(agg[0].avg * 10) / 10 : 0;
    await Vendor.findByIdAndUpdate(vendorId, { rating: avg });

    res.json({ rating: avg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getVendorReviews(req, res) {
  try {
    const { vendorId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total, userReview] = await Promise.all([
      Review.find({ vendor: vendorId })
        .populate("user", "username profilePicture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ vendor: vendorId }),
      req.user
        ? Review.findOne({ vendor: vendorId, user: req.user.id })
        : null,
    ]);

    res.json({ reviews, total, userReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function searchVendors(req, res) {
  try {
    const { query } = req.query;
    if (!query || query.trim().length < 2) {
      return res.json({ vendors: [] });
    }
    const results = await Vendor.find({
      name: { $regex: query.trim(), $options: "i" },
    })
      .populate("city", "name")
      .populate("vendorType", "name")
      .limit(20);

    const vendors = results.map((v) => ({
      _id: v._id,
      name: v.name,
      vendorType: v.vendorType?.name || "",
      location: { city: v.city?.name || "" },
      images: v.images,
      description: v.description,
      verified: v.verified,
      rating: v.rating,
    }));

    res.json({ vendors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
