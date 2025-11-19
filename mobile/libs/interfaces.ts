export interface Vendor {
  _id: string;
  name: string;
  description: string;
  vendorType: string;
  city: string;
  images: string[];
  priceRange: number;
  rating: number;
  contact: {
    phone: string;
    instagram: string;
    website: string;
  };
  user?: string;
  verified: boolean;
}

export interface City {
  _id: string;
  name: string;
  state: string;
}

export interface VendorType {
  _id: string;
  name: string;
  icon: string;
}

