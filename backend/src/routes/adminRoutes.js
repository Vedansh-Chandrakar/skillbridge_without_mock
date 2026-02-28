const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getVerifications, approveUser, rejectUser,
  getUsers, updateUserStatus, deleteUser,
  getCampuses, addCampus, updateCampus, deleteCampus,
  getAdminProfile, updateAdminProfile, changeAdminPassword,
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require valid JWT + admin role
router.use(protect);
router.use(restrictTo('admin'));

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

// ── Profile ────────────────────────────────────────────
router.get('/profile',                             getAdminProfile);
router.patch('/profile',                           updateAdminProfile);
router.patch('/profile/password',                  changeAdminPassword);

module.exports = router;
