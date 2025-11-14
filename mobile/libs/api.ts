const BASE_URL = "http://172.20.10.2:3000/api";

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
