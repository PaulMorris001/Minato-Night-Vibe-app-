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
    const vendors = await Vendor.find({
      city: cityId,
      vendorType: vendorTypeId,
    }).populate('user', 'businessPicture');

    // Enhance vendors with business picture from user if available
    const enhancedVendors = vendors.map(vendor => {
      const vendorObj = vendor.toObject();
      if (vendor.user && vendor.user.businessPicture) {
        // Add business picture to images array if it doesn't exist
        if (!vendorObj.images || vendorObj.images.length === 0) {
          vendorObj.images = [vendor.user.businessPicture];
        } else if (!vendorObj.images.includes(vendor.user.businessPicture)) {
          vendorObj.images.unshift(vendor.user.businessPicture);
        }
      }
      return vendorObj;
    });

    res.status(200).json(enhancedVendors);
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