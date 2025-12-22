import { BASE_URL } from '../constants/constants';

export async function fetchVendors(cityId: string, vendorTypeId: string) {
  const res = await fetch(
    `${BASE_URL}/cities/${cityId}/vendors/${vendorTypeId}`
  );
  return res.json();
}

export async function fetchVendorServices(vendorId: string) {
  const res = await fetch(`${BASE_URL}/vendors/${vendorId}/services`);
  return res.json();
}
