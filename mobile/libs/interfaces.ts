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

export interface Service {
  _id: string;
  vendor: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  images: string[];
  duration?: {
    value: number;
    unit: "hours" | "days" | "weeks" | "months";
  };
  availability: "available" | "unavailable" | "coming_soon";
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorStats {
  totalServices: number;
  activeServices: number;
  unavailableServices: number;
  averagePrice: string;
  recentServices: Service[];
  servicesByCategory: {
    category: string;
    count: number;
  }[];
}

