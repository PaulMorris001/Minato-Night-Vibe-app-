import mongoose from "mongoose";

const citySchema = mongoose.Schema({
    name: { type: String, required: true },
    state: { type: String, required: true },
});

const vendorTypeSchema = mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true },
})

const vendorSchema = mongoose.Schema({
    name: { type: String, required: true },
    vendorType: { type: mongoose.Schema.Types.ObjectId, ref: "vendorType", required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "city", required: true },
    description: { type: String },
    images: [{ type: String }],
    priceRange: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    contact: {
        phone: { type: String, required: true },
        instagram: { type: String },
        website: { type: String },
    }
});

export const City = mongoose.model("city", citySchema);
export const VendorType = mongoose.model("vendorType", vendorTypeSchema);
export const Vendor = mongoose.model("vendor", vendorSchema);