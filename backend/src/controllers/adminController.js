const User          = require('../models/User');
const Campus        = require('../models/Campus');
const CampusRequest = require('../models/CampusRequest');

// ── Helper: map User → verification shape ─────────────
const toVerification = (user) => {
  let status = 'pending';
  if (user.status === 'active' && user.isVerified) status = 'approved';
  if (user.status === 'rejected') status = 'rejected';
  return {
    id:          user._id,
    entity:      user.type === 'campus' ? `${user.campus} — ${user.name}` : user.name,
    type:        user.type,
    submittedBy: user.name,
    email:       user.email,
    campus:      user.campus || '—',
    document:    user.type === 'campus' ? 'Campus Authority Application' : 'Student Registration Form',
    submittedAt: user.createdAt,
    status,
  };
};

// ── Helper: map User → user-management shape ──────────
const toUser = (user) => ({
  id:         user._id,
  name:       user.name,
  email:      user.email,
  role:       user.type,                    // 'student' | 'campus'
  mode:       user.registeredModes || null,  // freelancer / recruiter / both / null
  campus:     user.campus || '—',
  status:     user.status,
  isVerified: user.isVerified,
  joinedAt:   user.createdAt,
});

// ── Helper: map Campus doc → campus-management shape ──
const toCampus = (campus, studentCount = 0) => ({
  id:         campus._id,
  name:       campus.name,
  domain:     campus.domain,
  adminEmail: campus.adminEmail,
  students:   studentCount,
  gigs:       0,          // gig model not built yet
  status:     campus.status,
  joinedAt:   campus.createdAt,
});


/* ═══════════════════════════════════════════════════════
   VERIFICATION ENDPOINTS
═══════════════════════════════════════════════════════ */

// GET /api/admin/verifications
const getVerifications = async (req, res, next) => {
  try {
    const users = await User.find({ type: { $ne: 'admin' } }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users.map(toVerification) });
  } catch (error) { next(error); }
};

// PATCH /api/admin/verifications/:userId/approve
const approveUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: 'active', isVerified: true },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: `${user.name}'s account has been approved.`, data: toVerification(user) });
  } catch (error) { next(error); }
};

// PATCH /api/admin/verifications/:userId/reject
const rejectUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: 'rejected', isVerified: false },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: `${user.name}'s account has been rejected.`, data: toVerification(user) });
  } catch (error) { next(error); }
};


/* ═══════════════════════════════════════════════════════
   USER MANAGEMENT ENDPOINTS
═══════════════════════════════════════════════════════ */

// GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ type: { $ne: 'admin' } }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users.map(toUser) });
  } catch (error) { next(error); }
};

// PATCH /api/admin/users/:userId  — suspend / re-activate
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be active or suspended.' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: `${user.name} is now ${status}.`, data: toUser(user) });
  } catch (error) { next(error); }
};

// DELETE /api/admin/users/:userId
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: `${user.name} has been deleted.` });
  } catch (error) { next(error); }
};


/* ═══════════════════════════════════════════════════════
   CAMPUS MANAGEMENT ENDPOINTS
═══════════════════════════════════════════════════════ */

// GET /api/admin/campuses
const getCampuses = async (req, res, next) => {
  try {
    const campuses = await Campus.find().sort({ createdAt: -1 });
    // Count verified students per campus
    const studentCounts = await User.aggregate([
      { $match: { type: 'student', isVerified: true } },
      { $group: { _id: '$campus', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    studentCounts.forEach(({ _id, count }) => { if (_id) countMap[_id] = count; });

    res.status(200).json({
      success: true,
      count: campuses.length,
      data: campuses.map((c) => toCampus(c, countMap[c.name] || 0)),
    });
  } catch (error) { next(error); }
};

// POST /api/admin/campuses
const addCampus = async (req, res, next) => {
  try {
    const { name, domain, adminEmail } = req.body;
    if (!name || !domain || !adminEmail) {
      return res.status(400).json({ success: false, message: 'Name, domain and adminEmail are required.' });
    }
    const exists = await Campus.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (exists) return res.status(409).json({ success: false, message: 'A campus with this name already exists.' });

    const campus = await Campus.create({ name: name.trim(), domain: domain.trim(), adminEmail: adminEmail.trim() });
    res.status(201).json({ success: true, message: 'Campus added.', data: toCampus(campus) });
  } catch (error) { next(error); }
};

// PATCH /api/admin/campuses/:campusId
const updateCampus = async (req, res, next) => {
  try {
    const { name, domain, status } = req.body;
    const campus = await Campus.findByIdAndUpdate(
      req.params.campusId,
      { ...(name && { name }), ...(domain && { domain }), ...(status && { status }) },
      { new: true, runValidators: true }
    );
    if (!campus) return res.status(404).json({ success: false, message: 'Campus not found.' });
    res.status(200).json({ success: true, message: 'Campus updated.', data: toCampus(campus) });
  } catch (error) { next(error); }
};

// DELETE /api/admin/campuses/:campusId
const deleteCampus = async (req, res, next) => {
  try {
    const campus = await Campus.findByIdAndDelete(req.params.campusId);
    if (!campus) return res.status(404).json({ success: false, message: 'Campus not found.' });
    res.status(200).json({ success: true, message: `${campus.name} has been deleted.` });
  } catch (error) { next(error); }
};


/* ═══════════════════════════════════════════════════════
   DASHBOARD STATS ENDPOINT
═══════════════════════════════════════════════════════ */

// GET /api/admin/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalCampuses, pendingCount, activeCount, recentUsers] = await Promise.all([
      User.countDocuments({ type: { $ne: 'admin' } }),
      Campus.countDocuments(),
      User.countDocuments({ status: 'pending' }),
      User.countDocuments({ status: 'active', type: { $ne: 'admin' } }),
      User.find({ type: { $ne: 'admin' } }).sort({ createdAt: -1 }).limit(6),
    ]);

    // Top campuses by student count
    const campuses = await Campus.find().sort({ createdAt: -1 });
    const studentCounts = await User.aggregate([
      { $match: { type: 'student', isVerified: true } },
      { $group: { _id: '$campus', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    studentCounts.forEach(({ _id, count }) => { if (_id) countMap[_id] = count; });
    const topCampuses = campuses
      .map((c) => ({ id: c._id, name: c.name, status: c.status, students: countMap[c.name] || 0 }))
      .sort((a, b) => b.students - a.students)
      .slice(0, 5);

    // Recent activity list
    const recentActivity = recentUsers.map((u) => ({
      id:     u._id,
      user:   u.name,
      email:  u.email,
      type:   u.type,
      status: u.status,
      action: u.status === 'pending' ? 'registered and is awaiting verification'
             : u.status === 'active'  ? 'joined the platform'
             : u.status === 'rejected' ? 'was rejected'
             : 'account suspended',
      time:   u.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: [
          { key: 'totalUsers',    label: 'Total Users',           value: totalUsers },
          { key: 'campuses',      label: 'Campuses',              value: totalCampuses },
          { key: 'pending',       label: 'Pending Verifications', value: pendingCount },
          { key: 'activeUsers',   label: 'Active Users',          value: activeCount },
        ],
        recentActivity,
        topCampuses,
      },
    });
  } catch (error) { next(error); }
};


/* ═══════════════════════════════════════════════════════
   ADMIN PROFILE ENDPOINTS
═══════════════════════════════════════════════════════ */

// GET /api/admin/profile
const getAdminProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'Profile not found.' });
    res.status(200).json({ success: true, data: user.toSafeObject() });
  } catch (error) { next(error); }
};

// PATCH /api/admin/profile
const updateAdminProfile = async (req, res, next) => {
  try {
    const { name, email, phone, location, bio } = req.body;
    const updates = {};
    if (name     !== undefined) updates.name     = name;
    if (email    !== undefined) updates.email    = email;
    if (phone    !== undefined) updates.phone    = phone;
    if (location !== undefined) updates.location = location;
    if (bio      !== undefined) updates.bio      = bio;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: 'Profile updated.', data: user.toSafeObject() });
  } catch (error) { next(error); }
};

// PATCH /api/admin/profile/password
const changeAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });
    }
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect.' });

    user.password = newPassword;
    await user.save(); // triggers bcrypt pre-save hook
    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) { next(error); }
};


/* ═══════════════════════════════════════════════════════
   CAMPUS REQUESTS (submitted via public register page)
═══════════════════════════════════════════════════════ */

// GET /api/admin/campus-requests
const getCampusRequests = async (req, res, next) => {
  try {
    const requests = await CampusRequest.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests.map((r) => ({
        id:           r._id,
        campusName:   r.campusName,
        domain:       r.domain,
        contactEmail: r.contactEmail,
        requestedBy:  r.requestedBy,
        message:      r.message,
        status:       r.status,
        adminNote:    r.adminNote,
        createdAt:    r.createdAt,
      })),
    });
  } catch (err) { next(err); }
};

// PATCH /api/admin/campus-requests/:id/approve
// Approves the request AND auto-creates the Campus if it doesn't exist
const approveCampusRequest = async (req, res, next) => {
  try {
    const request = await CampusRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    // Create campus if not already present
    let campus = await Campus.findOne({ name: { $regex: new RegExp(`^${request.campusName}$`, 'i') } });
    if (!campus) {
      campus = await Campus.create({
        name:       request.campusName,
        domain:     request.domain || 'unknown',
        adminEmail: request.contactEmail,
        status:     'active',
      });
    } else {
      campus.status = 'active';
      await campus.save();
    }

    request.status    = 'approved';
    request.adminNote = req.body.adminNote || '';
    await request.save();

    res.status(200).json({
      success: true,
      message: `"${request.campusName}" has been approved and added as an active campus.`,
    });
  } catch (err) { next(err); }
};

// PATCH /api/admin/campus-requests/:id/reject
const rejectCampusRequest = async (req, res, next) => {
  try {
    const request = await CampusRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', adminNote: req.body.adminNote || '' },
      { new: true }
    );
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    res.status(200).json({ success: true, message: `Request for "${request.campusName}" rejected.` });
  } catch (err) { next(err); }
};


module.exports = {
  // dashboard
  getDashboardStats,
  // verifications
  getVerifications, approveUser, rejectUser,
  // users
  getUsers, updateUserStatus, deleteUser,
  // campuses
  getCampuses, addCampus, updateCampus, deleteCampus,
  // campus requests
  getCampusRequests, approveCampusRequest, rejectCampusRequest,
  // profile
  getAdminProfile, updateAdminProfile, changeAdminPassword,
};
