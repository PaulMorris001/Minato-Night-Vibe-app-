import Constants from "expo-constants";

const getBaseUrl = () => {
  let host = "localhost";

  if (Constants.expoConfig?.hostUri) {
    host = Constants.expoConfig.hostUri.split(":")[0];
  }

  return `http://${host}:3000/api`;
};

const BASE_URL = getBaseUrl();

export async function fetchCities() {
  const res = await fetch(`${BASE_URL}/cities`);
  return res.json();
}

export async function fetchVendorTypes(cityId: string) {
  const res = await fetch(`${BASE_URL}/cities/${cityId}/vendor-types`);
  return res.json();
}

export async function fetchVendors(cityId: string, vendorTypeId: string) {
  const res = await fetch(
    `${BASE_URL}/cities/${cityId}/vendors/${vendorTypeId}`
  );
  return res.json();
}
