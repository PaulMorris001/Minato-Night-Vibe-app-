import mongoose from "mongoose";
import { Vendor } from "../models/vendor.model.js";
import dotenv from 'dotenv';

dotenv.config();


// Your existing cities
const cities = [
  { _id: "691660f69fce6d48f9f04c98", name: "Boston", state: "Massachusetts" },
  { _id: "691660f69fce6d48f9f04c99", name: "New York City", state: "New York" },
  { _id: "691660f69fce6d48f9f04c9a", name: "Atlanta", state: "Georgia" },
  { _id: "691660f69fce6d48f9f04c9b", name: "Los Angeles", state: "California" },
  { _id: "691660f69fce6d48f9f04c9c", name: "Houston", state: "Texas" },
  { _id: "691660f69fce6d48f9f04c9d", name: "Chicago", state: "Illinois" },
  { _id: "691660f69fce6d48f9f04c9e", name: "Washington", state: "DC" },
  { _id: "691660f69fce6d48f9f04c9f", name: "Miami", state: "Florida" },
  { _id: "691660f69fce6d48f9f04ca0", name: "New Orleans", state: "Louisiana" },
  { _id: "691660f69fce6d48f9f04ca1", name: "Detroit", state: "Michigan" },
  {
    _id: "691660f69fce6d48f9f04ca2",
    name: "San Francisco",
    state: "California",
  },
];

// Your existing vendor types
const vendorTypes = [
  { _id: "691660f69fce6d48f9f04ca4", name: "Chefs" },
  { _id: "691660f69fce6d48f9f04ca5", name: "Restaurants" },
  { _id: "691660f69fce6d48f9f04ca6", name: "Music and Bands" },
  { _id: "691660f69fce6d48f9f04ca7", name: "Bars and Clubs" },
  { _id: "691660f69fce6d48f9f04ca8", name: "Casinos" },
  { _id: "691660f69fce6d48f9f04ca9", name: "Concerts" },
  { _id: "691660f69fce6d48f9f04caa", name: "Events" },
  { _id: "691660f69fce6d48f9f04cab", name: "Transportation" },
  { _id: "691660f69fce6d48f9f04cac", name: "Venues" },
  { _id: "691660f69fce6d48f9f04cad", name: "Florists" },
  { _id: "691660f69fce6d48f9f04cae", name: "Decorations" },
  { _id: "691660f69fce6d48f9f04caf", name: "Desserts" },
  { _id: "691660f69fce6d48f9f04cb0", name: "Beverages" },
  { _id: "691660f69fce6d48f9f04cb1", name: "Other" },
];

// Vendor name templates by type
const vendorTemplates = {
  Chefs: [
    "Chef {name}'s Catering",
    "Gourmet Chef {name}",
    "Executive Chef {name}",
    "{name}'s Culinary Services",
    "Private Chef {name}",
  ],
  Restaurants: [
    "The {adjective} {food}",
    "{name}'s Bistro",
    "{adjective} Table",
    "{name}'s Kitchen",
    "The {food} House",
  ],
  "Music and Bands": [
    "The {name} Band",
    "{adjective} Beats",
    "{name} Entertainment",
    "{adjective} Sounds",
    "{name} Music Group",
  ],
  "Bars and Clubs": [
    "The {adjective} Lounge",
    "{name}'s Bar",
    "Club {name}",
    "{adjective} Nightclub",
    "The {name} Tavern",
  ],
  Casinos: [
    "{name} Casino",
    "The {adjective} Casino",
    "{name} Gaming",
    "Royal {name} Casino",
    "{adjective} Palace Casino",
  ],
  Concerts: [
    "{name} Concert Hall",
    "The {adjective} Amphitheater",
    "{name} Arena",
    "{adjective} Music Venue",
    "{name} Pavilion",
  ],
  Events: [
    "{name} Event Planning",
    "{adjective} Events",
    "{name}'s Celebrations",
    "{adjective} Occasions",
    "{name} Event Co.",
  ],
  Transportation: [
    "{name} Limo Service",
    "{adjective} Transportation",
    "{name} Car Service",
    "{adjective} Rides",
    "{name} Executive Transport",
  ],
  Venues: [
    "The {adjective} Hall",
    "{name} Event Space",
    "{adjective} Venue",
    "{name} Ballroom",
    "The {name} Manor",
  ],
  Florists: [
    "{name} Florist",
    "{adjective} Blooms",
    "{name}'s Flowers",
    "{adjective} Petals",
    "{name} Floral Design",
  ],
  Decorations: [
    "{name} Decor",
    "{adjective} Decorations",
    "{name}'s Design Studio",
    "{adjective} Events Decor",
    "{name} Creative Design",
  ],
  Desserts: [
    "{name}'s Bakery",
    "Sweet {name}",
    "{adjective} Desserts",
    "{name} Pastry Shop",
    "The {adjective} Cake Co.",
  ],
  Beverages: [
    "{name} Bar Services",
    "{adjective} Beverages",
    "{name}'s Drinks",
    "{adjective} Bartending",
    "{name} Mobile Bar",
  ],
  Other: [
    "{name} Services",
    "{adjective} Solutions",
    "{name} & Co.",
    "{adjective} Specialists",
    "{name} Group",
  ],
};

const adjectives = [
  "Elegant",
  "Premium",
  "Royal",
  "Golden",
  "Silver",
  "Divine",
  "Grand",
  "Elite",
  "Luxury",
  "Classic",
];
const names = [
  "Alexander",
  "Victoria",
  "Madison",
  "Savannah",
  "Jackson",
  "Brooklyn",
  "Austin",
  "Phoenix",
  "Harper",
  "Lincoln",
];
const foods = [
  "Plate",
  "Grill",
  "Kitchen",
  "Dining",
  "Feast",
  "Table",
  "Cuisine",
  "Fork",
];

const descriptions = [
  "Providing exceptional service for your special occasions with attention to detail and professionalism.",
  "Creating unforgettable experiences with our premium offerings and dedicated team.",
  "Your trusted partner for elegant events and celebrations throughout the year.",
  "Delivering quality and excellence with every service we provide to our valued clients.",
  "Bringing your vision to life with our experienced professionals and creative solutions.",
  "Specializing in upscale events with a commitment to perfection and customer satisfaction.",
  "Making your celebrations memorable with our comprehensive range of premium services.",
  "Expert services tailored to your needs with years of industry experience.",
  "Transforming ordinary moments into extraordinary memories with style and grace.",
  "Premium quality services designed to exceed your expectations every time.",
];

const phoneFormats = [
  "(555) 123-",
  "(555) 234-",
  "(555) 345-",
  "(555) 456-",
  "(555) 567-",
];
const instagramHandles = [
  "deluxe",
  "premium",
  "elite",
  "royal",
  "golden",
  "signature",
  "exclusive",
  "luxury",
];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateVendorName(vendorType) {
  const templates = vendorTemplates[vendorType];
  const template = randomElement(templates);

  return template
    .replace("{name}", randomElement(names))
    .replace("{adjective}", randomElement(adjectives))
    .replace("{food}", randomElement(foods));
}

function generatePhone() {
  return `${randomElement(phoneFormats)}${randomNumber(1000, 9999)}`;
}

function generateInstagram(vendorName) {
  const cleanName = vendorName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${cleanName.substring(0, 15)}${randomElement(instagramHandles)}`;
}

function generateWebsite(vendorName) {
  const cleanName = vendorName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `https://www.${cleanName.substring(0, 20)}.com`;
}

function generateVendors() {
  const vendors = [];

  // Generate at least one vendor for each city and vendor type combination
  cities.forEach((city) => {
    vendorTypes.forEach((vendorType) => {
      const vendorName = generateVendorName(vendorType.name);
      const phone = generatePhone();

      const vendor = {
        name: vendorName,
        vendorType: vendorType._id,
        city: city._id,
        description: randomElement(descriptions),
        images: [
          `https://picsum.photos/800/600?random=${Math.random()}`,
          `https://picsum.photos/800/600?random=${Math.random()}`,
          `https://picsum.photos/800/600?random=${Math.random()}`,
        ],
        priceRange: randomNumber(1, 5),
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
        contact: {
          phone: phone,
          instagram: generateInstagram(vendorName),
          website: generateWebsite(vendorName),
        },
      };

      vendors.push(vendor);
    });
  });

  return vendors;
}

// Seed function to run
async function seedVendors() {
  try {
    // Replace with your MongoDB connection string
    await mongoose.connect(process.env.MONGO_URI);


    // Clear existing vendors (optional)
    // await Vendor.deleteMany({});

    const vendors = generateVendors();

    console.log(`Generating ${vendors.length} vendors...`);

    await Vendor.insertMany(vendors);

    console.log(`Successfully seeded ${vendors.length} vendors!`);
    console.log(`- ${cities.length} cities`);
    console.log(`- ${vendorTypes.length} vendor types`);
    console.log(
      `- ${vendors.length} total vendors (at least 1 per city/type combination)`
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding vendors:", error);
    process.exit(1);
  }
}



import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  seedVendors();
}
