// ── API Base URL ───────────────────────────────────────
// Change this one value when deploying to production
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Auth endpoints ─────────────────────────────────────
export const AUTH_ENDPOINTS = {
  LOGIN:    `${BASE_URL}/api/auth/login`,
  REGISTER: `${BASE_URL}/api/auth/register`,
};

// ── Admin endpoints ────────────────────────────────────
export const ADMIN_ENDPOINTS = {
  // Verifications
  VERIFICATIONS:             `${BASE_URL}/api/admin/verifications`,
  APPROVE:     (id) =>      `${BASE_URL}/api/admin/verifications/${id}/approve`,
  REJECT:      (id) =>      `${BASE_URL}/api/admin/verifications/${id}/reject`,
  // Users
  USERS:                     `${BASE_URL}/api/admin/users`,
  UPDATE_USER: (id) =>      `${BASE_URL}/api/admin/users/${id}`,
  DELETE_USER: (id) =>      `${BASE_URL}/api/admin/users/${id}`,
  // Campuses
  CAMPUSES:                  `${BASE_URL}/api/admin/campuses`,
  UPDATE_CAMPUS: (id) =>    `${BASE_URL}/api/admin/campuses/${id}`,
  DELETE_CAMPUS: (id) =>    `${BASE_URL}/api/admin/campuses/${id}`,
  // Profile
  PROFILE:                   `${BASE_URL}/api/admin/profile`,
  UPDATE_PROFILE:            `${BASE_URL}/api/admin/profile`,
  CHANGE_PASSWORD:           `${BASE_URL}/api/admin/profile/password`,
};
