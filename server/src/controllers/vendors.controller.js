import { City, Vendor, VendorType } from "../models/vendor.model.js";
import User from "../models/user.model.js";

export async function getAllCities(req, res) {
  try {
    const cities = await City.find();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getVendorTypesByCity(req, res) {
  try {
    const { cityId } = req.params;
    const vendorTypes = await VendorType.find();
    res.status(200).json(vendorTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getVendorsByCityAndType(req, res) {
  try {
    const { cityId, vendorTypeId } = req.params;

    // Find the city and vendor type to get their names
    const city = await City.findById(cityId);
    const vendorType = await VendorType.findById(vendorTypeId);

    if (!city || !vendorType) {
      return res.status(404).json({ message: "City or vendor type not found" });
    }

    // Find all users who are vendors, match the city and vendor type
    const vendorUsers = await User.find({
      isVendor: true,
      'location.city': city.name,
      vendorType: vendorType.name
    });

    // Transform vendor users to match the expected format
    const vendors = vendorUsers.map(user => ({
      _id: user._id,
      name: user.businessName,
      description: user.businessDescription,
      images: user.businessPicture ? [user.businessPicture] : [],
      priceRange: 2, // Default price range
      rating: 4.5, // Default rating
      contact: {
        phone: user.contactInfo?.phone || '',
        instagram: user.contactInfo?.instagram || '',
        website: user.contactInfo?.website || ''
      },
      verified: user.verified
    }));

    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAllVendorTypes(req, res) {
  try {
    const vendorTypes = await VendorType.find();
    res.status(200).json(vendorTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}