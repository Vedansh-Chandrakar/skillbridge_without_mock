// ── API Base URL ───────────────────────────────────────
// Change this one value when deploying to production
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Campus Authority endpoints ────────────────────────
export const CAMPUS_ENDPOINTS = {
  STUDENTS:             `${BASE_URL}/api/campus/students`,
  INVITE_STUDENT:       `${BASE_URL}/api/campus/students/invite`,
  UPDATE_STUDENT:   (id) => `${BASE_URL}/api/campus/students/${id}`,
  REMOVE_STUDENT:   (id) => `${BASE_URL}/api/campus/students/${id}`,
  VERIFICATIONS:        `${BASE_URL}/api/campus/verifications`,
  APPROVE_VERIFICATION: (id) => `${BASE_URL}/api/campus/verifications/${id}/approve`,
  REJECT_VERIFICATION:  (id) => `${BASE_URL}/api/campus/verifications/${id}/reject`,
  // Opportunities
  OPPORTUNITIES:            `${BASE_URL}/api/campus/opportunities`,
  UPDATE_OPPORTUNITY: (id) => `${BASE_URL}/api/campus/opportunities/${id}`,
  DELETE_OPPORTUNITY: (id) => `${BASE_URL}/api/campus/opportunities/${id}`,
  // Applicants
  APPLICANTS:     (oppId)           => `${BASE_URL}/api/campus/opportunities/${oppId}/applicants`,
  UPDATE_APPLICANT: (oppId, appId)  => `${BASE_URL}/api/campus/opportunities/${oppId}/applicants/${appId}`,
  // Profile
  PROFILE:        `${BASE_URL}/api/campus/profile`,
  UPDATE_PROFILE: `${BASE_URL}/api/campus/profile`,
  // Dashboard
  DASHBOARD:      `${BASE_URL}/api/campus/dashboard`,
};

// ── Auth endpoints ─────────────────────────────────────
export const AUTH_ENDPOINTS = {
  LOGIN:           `${BASE_URL}/api/auth/login`,
  REGISTER:        `${BASE_URL}/api/auth/register`,
  CAMPUSES:        `${BASE_URL}/api/auth/campuses`,
  CAMPUS_REQUEST:  `${BASE_URL}/api/auth/campus-request`,
};

// ── Admin endpoints ────────────────────────────────────
export const ADMIN_ENDPOINTS = {
  // Dashboard
  DASHBOARD:                 `${BASE_URL}/api/admin/dashboard`,
  // Campus Requests (submitted by public)
  CAMPUS_REQUESTS:                            `${BASE_URL}/api/admin/campus-requests`,
  APPROVE_CAMPUS_REQUEST: (id) =>            `${BASE_URL}/api/admin/campus-requests/${id}/approve`,
  REJECT_CAMPUS_REQUEST:  (id) =>            `${BASE_URL}/api/admin/campus-requests/${id}/reject`,
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
  // Moderation
  MOD_REPORTS:                          `${BASE_URL}/api/admin/moderation/reports`,
  MOD_RESOLVE:   (id) =>               `${BASE_URL}/api/admin/moderation/reports/${id}/resolve`,
  MOD_DISMISS:   (id) =>               `${BASE_URL}/api/admin/moderation/reports/${id}/dismiss`,
  MOD_LOGS:                             `${BASE_URL}/api/admin/moderation/logs`,
  MOD_STATS:                            `${BASE_URL}/api/admin/moderation/stats`,
  MOD_BAN:                              `${BASE_URL}/api/admin/moderation/ban`,
  MOD_WARN:                             `${BASE_URL}/api/admin/moderation/warn`,
  MOD_MESSAGE:                          `${BASE_URL}/api/admin/moderation/message`,
};
