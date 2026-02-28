const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getVerifications, approveUser, rejectUser,
  getUsers, updateUserStatus, deleteUser,
  getCampuses, addCampus, updateCampus, deleteCampus,
  getAdminProfile, updateAdminProfile, changeAdminPassword,
  getDashboardStats,
  getCampusRequests, approveCampusRequest, rejectCampusRequest,
} = require('../controllers/adminController');
const {
  getReports, resolveReport, dismissReport,
  getLogs, getModerationStats,
  banUser, warnUser, messageUser,
} = require('../controllers/moderationController');

const router = express.Router();

// All admin routes require valid JWT + admin role
router.use(protect);
router.use(restrictTo('admin'));

// ── Dashboard ────────────────────────────────────────────
router.get('/dashboard',                           getDashboardStats);

// ── Verification ───────────────────────────────────────
router.get('/verifications',                       getVerifications);
router.patch('/verifications/:userId/approve',     approveUser);
router.patch('/verifications/:userId/reject',      rejectUser);

// ── Users ──────────────────────────────────────────────
router.get('/users',                               getUsers);
router.patch('/users/:userId',                     updateUserStatus);
router.delete('/users/:userId',                    deleteUser);

// ── Campuses ───────────────────────────────────────────
router.get('/campuses',                            getCampuses);
router.post('/campuses',                           addCampus);
router.patch('/campuses/:campusId',                updateCampus);
router.delete('/campuses/:campusId',               deleteCampus);
// ── Campus Requests ─────────────────────────────────────
router.get('/campus-requests',                     getCampusRequests);
router.patch('/campus-requests/:id/approve',       approveCampusRequest);
router.patch('/campus-requests/:id/reject',        rejectCampusRequest);
// ── Profile ────────────────────────────────────────────
router.get('/profile',                             getAdminProfile);
router.patch('/profile',                           updateAdminProfile);
router.patch('/profile/password',                  changeAdminPassword);

// ── Moderation ─────────────────────────────────────────
router.get('/moderation/reports',                  getReports);
router.patch('/moderation/reports/:id/resolve',    resolveReport);
router.patch('/moderation/reports/:id/dismiss',    dismissReport);
router.get('/moderation/logs',                     getLogs);
router.get('/moderation/stats',                    getModerationStats);
router.post('/moderation/ban',                     banUser);
router.post('/moderation/warn',                    warnUser);
router.post('/moderation/message',                 messageUser);

module.exports = router;
