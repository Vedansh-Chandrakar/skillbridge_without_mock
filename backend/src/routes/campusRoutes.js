const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getCampusStudents,
  inviteStudent,
  updateStudent,
  removeStudent,
  getCampusVerifications,
  approveVerification,
  rejectVerification,
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getOpportunity,
  getApplicants,
  updateApplicantStatus,
  getProfile,
  updateProfile,
  getDashboard,
} = require('../controllers/campusController');

const router = express.Router();

// All campus routes require valid JWT + campus authority role
router.use(protect);
router.use(restrictTo('campus'));

// ── Students ──────────────────────────────────────────
router.get('/students',         getCampusStudents);
router.post('/students/invite', inviteStudent);
router.patch('/students/:id',   updateStudent);
router.delete('/students/:id',  removeStudent);

// ── Verifications ───────────────────────────────
router.get('/verifications',              getCampusVerifications);
router.patch('/verifications/:id/approve', approveVerification);
router.patch('/verifications/:id/reject',  rejectVerification);

// ── Opportunities ─────────────────────────────────────
router.get('/opportunities',                                  getOpportunities);
router.post('/opportunities',                                 createOpportunity);
router.get('/opportunities/:id',                              getOpportunity);
router.patch('/opportunities/:id',                            updateOpportunity);
router.delete('/opportunities/:id',                           deleteOpportunity);

// ── Applicants ────────────────────────────────────────
router.get('/opportunities/:id/applicants',                   getApplicants);
router.patch('/opportunities/:id/applicants/:appId',          updateApplicantStatus);

// ── Profile ───────────────────────────────────────────
router.get('/profile',   getProfile);
router.patch('/profile', updateProfile);
// ── Dashboard ─────────────────────────────────────────────────────
router.get('/dashboard', getDashboard);
module.exports = router;
