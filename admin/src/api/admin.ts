import client from "./client";
import type { Stats, AdminUser, AdminEvent, AdminGuide } from "../types";

export const adminApi = {
  login: (username: string, password: string) =>
    client.post<{ token: string }>("/admin/login", { username, password }),

  getStats: () => client.get<Stats>("/admin/stats"),

  getUsers: (params?: { search?: string; page?: number; limit?: number }) =>
    client.get<{ users: AdminUser[]; total: number; page: number; limit: number }>("/admin/users", { params }),

  deleteUser: (id: string) => client.delete(`/admin/users/${id}`),

  toggleVendorVerified: (id: string) =>
    client.patch<{ verified: boolean }>(`/admin/users/${id}/verify`),

  getEvents: (params?: { search?: string; page?: number; limit?: number }) =>
    client.get<{ events: AdminEvent[]; total: number; page: number; limit: number }>("/admin/events", { params }),

  toggleEventActive: (id: string) =>
    client.patch<{ isActive: boolean }>(`/admin/events/${id}/toggle`),

  deleteEvent: (id: string) => client.delete(`/admin/events/${id}`),

  getGuides: (params?: { search?: string; page?: number; limit?: number }) =>
    client.get<{ guides: AdminGuide[]; total: number; page: number; limit: number }>("/admin/guides", { params }),

  toggleGuideActive: (id: string) =>
    client.patch<{ isActive: boolean }>(`/admin/guides/${id}/toggle`),

  deleteGuide: (id: string) => client.delete(`/admin/guides/${id}`),
};
